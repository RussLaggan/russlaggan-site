function doPost(e) {
  var data = {};
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    data = e.parameter || {};
  }
  if (String(data.company || "").trim()) {
    return json({ ok: true });
  }
  var first = String(data.first || "").trim();
  var last = String(data.last || "").trim();
  var email = String(data.email || "").trim();
  var phone = String(data.phone || "").trim();
  var interest = String(data.interest || "").trim();
  var message = String(data.message || "").trim();
  var page = String(data.page || "").trim();
  var body = [
    "Name: " + first + " " + last,
    "Email: " + email,
    "Phone: " + phone,
    "Interest: " + interest,
    "Page: " + page,
    "",
    message
  ].join("\n");
  MailApp.sendEmail({
    to: "russ@russlaggan.com,brett@brettkmoore.com",
    replyTo: email,
    subject: "Russ Laggan site: " + interest + " from " + first + " " + last,
    body: body
  });
  return json({ ok: true });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
