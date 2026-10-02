// Coaching checkout. Amounts live here. The browser cannot set a price.
// No Stripe product id and no price id. Checkout creates the line with price_data.

const PLANS = {
  "coaching-monthly": {
    mode: "subscription",
    name: "Coaching with Russ Laggan",
    description: "Six months. $2,500 each month. Ends after the sixth payment.",
    unitAmount: 250000,
    recurring: true,
  },
  "coaching-upfront": {
    mode: "payment",
    name: "Coaching with Russ Laggan, paid up front",
    description: "Six months, paid once. Ten percent off the $15,000 total.",
    unitAmount: 1350000,
    recurring: false,
  },
};

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    const sessionId = typeof req.query.session_id === "string" ? req.query.session_id : "";
    if (sessionId) return sessionStatus(req, res, sessionId);
    return res.status(200).json({
      upfront: Boolean(process.env.STRIPE_SECRET_KEY),
      monthly: Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET),
    });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Use POST to start checkout." });
  }

  const body = await readJson(req);
  const plan = PLANS[body && body.plan];
  const name = clean(body && body.name, 120);
  const email = clean(body && body.email, 200);
  if (!plan) return res.status(400).json({ error: "Choose the monthly plan or the up-front plan." });
  if (!name) return res.status(400).json({ error: "Add your name." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Add a real email." });
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return res.status(503).json({ error: "Payments are not connected yet." });
  }
  if (plan.recurring && !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(503).json({
      error: "The monthly plan is not open yet. Pay up front, or email info@russlaggan.com.",
    });
  }

  const origin = siteOrigin(req);
  const success = origin + "/coaching.html?session_id={CHECKOUT_SESSION_ID}";
  const cancel = origin + "/coaching.html?canceled=1";

  const params = new URLSearchParams();
  params.set("mode", plan.mode);
  params.set("customer_email", email);
  params.set("client_reference_id", name);
  params.set("metadata[plan]", body.plan);
  params.set("metadata[name]", name);
  params.set("metadata[email]", email);
  params.set("metadata[term_months]", "6");
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "usd");
  params.set("line_items[0][price_data][unit_amount]", String(plan.unitAmount));
  params.set("line_items[0][price_data][product_data][name]", plan.name);
  params.set("line_items[0][price_data][product_data][description]", plan.description);
  if (plan.recurring) {
    params.set("line_items[0][price_data][recurring][interval]", "month");
    params.set("subscription_data[metadata][plan]", body.plan);
    params.set("subscription_data[metadata][term_months]", "6");
  }

  const encoded =
    params.toString() +
    "&success_url=" +
    keepSessionToken(success) +
    "&cancel_url=" +
    encodeURIComponent(cancel);

  let session;
  try {
    session = await stripePost("checkout/sessions", encoded, key);
  } catch (err) {
    console.error("checkout_failed", err.publicMessage || "stripe_error");
    return res.status(502).json({ error: err.publicMessage || "Payments could not be started." });
  }

  if (!session.url) return res.status(502).json({ error: "Payments could not be started." });
  return res.status(200).json({ url: session.url });
};

async function sessionStatus(req, res, sessionId) {
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    return res.status(400).json({ error: "That checkout session is not valid." });
  }
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return res.status(503).json({ error: "Payments are not connected yet." });
  let session;
  try {
    session = await stripeGet("checkout/sessions/" + encodeURIComponent(sessionId), key);
  } catch (err) {
    console.error("session_lookup_failed", err.publicMessage || "stripe_error");
    return res.status(502).json({ error: "Could not confirm that checkout." });
  }
  return res.status(200).json({
    payment_status: session.payment_status || "unpaid",
    status: session.status || "",
    plan: session.metadata && session.metadata.plan ? session.metadata.plan : "",
  });
}

function siteOrigin(req) {
  const raw = String(req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0].trim().toLowerCase();
  const host = raw.replace(/:\d+$/, "");
  const ok = host === "russlaggan.com" || host === "www.russlaggan.com" || host.endsWith(".vercel.app");
  return ok ? "https://" + host : "https://www.russlaggan.com";
}

function keepSessionToken(url) {
  return encodeURIComponent(url).replaceAll("%7B", "{").replaceAll("%7D", "}");
}

function clean(value, max) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}

function readJson(req) {
  if (req.body && typeof req.body === "object") return Promise.resolve(req.body);
  return new Promise((resolve) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
      } catch (err) {
        resolve({});
      }
    });
    req.on("error", () => resolve({}));
  });
}

async function stripePost(path, body, key) {
  const resp = await fetch("https://api.stripe.com/v1/" + path, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + key,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  return readStripe(resp);
}

async function stripeGet(path, key) {
  const resp = await fetch("https://api.stripe.com/v1/" + path, {
    headers: { Authorization: "Bearer " + key },
  });
  return readStripe(resp);
}

async function readStripe(resp) {
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const err = new Error("stripe_error");
    const message = data.error && data.error.message ? data.error.message : "";
    err.publicMessage = /sk_|rk_|api[_ ]key/i.test(message)
      ? "Payments could not be started."
      : "Stripe rejected the request.";
    throw err;
  }
  return data;
}
