// Stops the coaching subscription after six monthly payments.
// Checkout cannot set that end date itself. This runs when Stripe says the session completed.

const crypto = require("crypto");

module.exports.config = {
  api: { bodyParser: false },
};

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("POST only");
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!secret || !key) return res.status(503).end("webhook not connected");

  const payload = await rawBody(req);
  const header = req.headers["stripe-signature"];
  if (!verify(payload, header, secret)) return res.status(400).end("bad signature");

  let event;
  try {
    event = JSON.parse(payload.toString("utf8"));
  } catch (err) {
    return res.status(400).end("bad payload");
  }

  if (event.type !== "checkout.session.completed") return res.status(200).json({ received: true });

  const session = event.data && event.data.object ? event.data.object : {};
  const months = Number(session.metadata && session.metadata.term_months);
  const subscriptionId = typeof session.subscription === "string" ? session.subscription : "";
  if (session.mode !== "subscription" || months !== 6 || !/^sub_[A-Za-z0-9]+$/.test(subscriptionId)) {
    return res.status(200).json({ received: true, skipped: true });
  }

  try {
    const sub = await stripe("GET", "subscriptions/" + subscriptionId, null, key);
    if (sub.cancel_at) return res.status(200).json({ received: true, already: true });

    const anchor = Number(sub.billing_cycle_anchor || sub.start_date);
    if (!anchor) return res.status(500).end("subscription has no start");
    // One minute before the seventh cycle. Six invoices are created; the next one is not.
    const cancelAt = plusMonths(anchor, 6) - 60;

    await stripe("POST", "subscriptions/" + subscriptionId, "cancel_at=" + cancelAt, key);
    return res.status(200).json({ received: true, cancel_at: cancelAt });
  } catch (err) {
    return res.status(500).end("could not stop the subscription at six months");
  }
};

function plusMonths(unix, months) {
  const date = new Date(unix * 1000);
  date.setUTCMonth(date.getUTCMonth() + months);
  return Math.floor(date.getTime() / 1000);
}

function rawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function verify(payload, header, secret) {
  if (!header || !payload) return false;
  const parts = String(header).split(",").map((part) => part.split("="));
  const timestamp = (parts.find((part) => part[0] === "t") || [])[1];
  const signatures = parts.filter((part) => part[0] === "v1").map((part) => part[1]);
  if (!timestamp || signatures.length === 0) return false;
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;
  const expected = crypto.createHmac("sha256", secret).update(timestamp + "." + payload.toString("utf8")).digest("hex");
  const expectedBuf = Buffer.from(expected);
  return signatures.some((signature) => {
    const actual = Buffer.from(signature);
    return actual.length === expectedBuf.length && crypto.timingSafeEqual(actual, expectedBuf);
  });
}

async function stripe(method, path, body, key) {
  const resp = await fetch("https://api.stripe.com/v1/" + path, {
    method,
    headers: {
      Authorization: "Bearer " + key,
      ...(body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: body || undefined,
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    console.error("stripe_webhook_call_failed", data.error && data.error.type ? data.error.type : resp.status);
    const err = new Error("stripe_failed");
    throw err;
  }
  return data;
}
