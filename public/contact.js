(function () {
  var ENDPOINT = "";
  var CHOICES = ["Speaking", "Coaching", "Training"];
  var lastFocus = null;
  var interest = "";

  var css = document.createElement("style");
  css.textContent = [
    ".rq{position:fixed;inset:0;z-index:80;display:grid;place-items:center;padding:24px}",
    ".rq[hidden]{display:none}",
    ".rq-back{position:absolute;inset:0;background:rgba(18,8,24,.62)}",
    ".rq-card{position:relative;width:min(520px,100%);max-height:min(720px,calc(100vh - 48px));overflow:auto;background:#fff;color:#18181b;border-radius:16px;padding:28px 24px 24px;box-shadow:0 24px 60px -20px rgba(0,0,0,.45)}",
    ".rq-x{position:absolute;top:12px;right:12px;border:0;background:transparent;font-size:24px;line-height:1;cursor:pointer;color:#52525b}",
    ".rq-label{margin:0;font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#1a4e8c}",
    ".rq h2{margin:8px 0 0;font-size:32px;letter-spacing:-.04em;line-height:1}",
    ".rq-lede{margin:10px 0 18px;color:#52525b;font-size:15px;line-height:1.5}",
    ".rq form{display:grid;gap:12px}",
    ".rq-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}",
    ".rq label{display:grid;gap:6px;font-size:13px;font-weight:600}",
    ".rq input,.rq textarea{width:100%;border:1px solid rgba(24,24,27,.14);border-radius:8px;padding:10px 12px;font:inherit;font-size:16px;font-weight:400;color:#18181b;background:#fff}",
    ".rq input:focus,.rq textarea:focus{outline:2px solid #ef5d17;border-color:transparent}",
    ".rq fieldset{border:0;margin:0;padding:0}",
    ".rq legend{font-size:13px;font-weight:600;margin-bottom:8px}",
    ".rq-pills{display:flex;flex-wrap:wrap;gap:8px}",
    ".rq-pills button{border:1px solid rgba(24,24,27,.16);background:#fff;border-radius:8px;padding:8px 14px;font:inherit;font-size:14px;font-weight:600;cursor:pointer;color:#18181b}",
    ".rq-pills button[aria-pressed='true']{background:#ef5d17;border-color:#ef5d17;color:#fff}",
    ".rq-hp{position:absolute;left:-9999px;height:0;overflow:hidden}",
    ".rq-err{margin:0;color:#9a3412;font-size:14px}",
    ".rq-send{width:100%}",
    ".rq-done{display:grid;gap:12px}",
    ".rq-done[hidden],.rq form[hidden]{display:none}",
    "@media(max-width:560px){.rq{padding:0;align-items:end}.rq-card{width:100%;max-height:92vh;border-radius:16px 16px 0 0}.rq-row{grid-template-columns:1fr}}"
  ].join("");
  document.head.appendChild(css);

  var root = document.createElement("div");
  root.className = "rq";
  root.hidden = true;
  root.innerHTML = [
    '<div class="rq-back" data-close></div>',
    '<div class="rq-card" role="dialog" aria-modal="true" aria-labelledby="rq-title">',
    '<button type="button" class="rq-x" data-close aria-label="Close">&times;</button>',
    '<form>',
    '<p class="rq-label">Contact</p>',
    '<h2 id="rq-title">Contact Russ</h2>',
    '<p class="rq-lede">Speaking, coaching, or training. Tell him what you need.</p>',
    '<div class="rq-row">',
    '<label>First name<input name="first" required autocomplete="given-name"></label>',
    '<label>Last name<input name="last" required autocomplete="family-name"></label>',
    "</div>",
    '<label>Email<input type="email" name="email" required autocomplete="email"></label>',
    '<label>Phone<input type="tel" name="phone" autocomplete="tel"></label>',
    "<fieldset><legend>What do you want to talk about?</legend><div class=\"rq-pills\">",
    CHOICES.map(function (name) {
      return '<button type="button" data-choice="' + name + '">' + name + "</button>";
    }).join(""),
    "</div></fieldset>",
    '<label>Message<textarea name="message" rows="4"></textarea></label>',
    '<label class="rq-hp">Company<input name="company" tabindex="-1" autocomplete="off"></label>',
    '<p class="rq-err" hidden></p>',
    '<button class="btn rq-send" type="submit">Send</button>',
    "</form>",
    '<div class="rq-done" hidden><p class="rq-label">Sent</p><h2>Russ has this.</h2><p class="rq-lede">He will reply to you.</p><button type="button" class="btn" data-close>Close</button></div>',
    "</div>"
  ].join("");
  document.body.appendChild(root);

  var form = root.querySelector("form");
  var done = root.querySelector(".rq-done");
  var err = root.querySelector(".rq-err");
  var pills = root.querySelectorAll("[data-choice]");

  function setInterest(value) {
    interest = CHOICES.indexOf(value) >= 0 ? value : "";
    pills.forEach(function (pill) {
      pill.setAttribute("aria-pressed", pill.getAttribute("data-choice") === interest ? "true" : "false");
    });
  }

  function open(value) {
    lastFocus = document.activeElement;
    form.hidden = false;
    done.hidden = true;
    err.hidden = true;
    setInterest(value || "");
    root.hidden = false;
    document.body.style.overflow = "hidden";
    var first = form.querySelector("[name=first]");
    if (first) first.focus();
  }

  function close() {
    root.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  window.russContact = open;

  pills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      setInterest(pill.getAttribute("data-choice"));
    });
  });

  root.addEventListener("click", function (event) {
    if (event.target.closest("[data-close]")) close();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !root.hidden) close();
  });

  document.addEventListener("click", function (event) {
    var toggle = event.target.closest(".nav-toggle");
    var nav = document.getElementById("site-nav");
    if (toggle && nav) {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      return;
    }
    if (nav && nav.classList.contains("open") && !event.target.closest("#site-nav")) {
      nav.classList.remove("open");
      var button = document.querySelector(".nav-toggle");
      if (button) button.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[href='#contact'], a[data-interest]");
    if (!link) return;
    if (link.getAttribute("href") !== "#contact") return;
    event.preventDefault();
    open(link.getAttribute("data-interest") || "");
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    err.hidden = true;
    if (!interest) {
      err.textContent = "Pick speaking, coaching, or training.";
      err.hidden = false;
      return;
    }
    if (!ENDPOINT) {
      err.textContent = "The form is on the site. The mailbox hook is the last step.";
      err.hidden = false;
      return;
    }
    var data = {
      first: form.first.value.trim(),
      last: form.last.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      interest: interest,
      message: form.message.value.trim(),
      page: location.pathname,
      company: form.company.value.trim()
    };
    var button = form.querySelector(".rq-send");
    button.disabled = true;
    button.textContent = "Sending";
    fetch(ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data)
    }).then(function () {
      if (data.company) return;
      form.hidden = true;
      done.hidden = false;
      form.reset();
      setInterest("");
    }).catch(function () {
      err.textContent = "That did not send. Try again.";
      err.hidden = false;
    }).then(function () {
      button.disabled = false;
      button.textContent = "Send";
    });
  });
})();
