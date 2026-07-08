export function welcomeEmail(unsubscribeUrl = 'https://picksniff.com/unsubscribe') {
  return {
    subject: 'Welcome to PickSniff 👃',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'DM Sans',Arial,sans-serif;color:#000000">
  <div style="max-width:560px;margin:0 auto;padding:48px 24px">

    <div style="margin-bottom:32px">
      <span style="font-size:22px;font-weight:900;letter-spacing:-0.5px">Pick<span style="color:#7fe040">Sniff</span></span>
    </div>

    <h1 style="font-size:28px;font-weight:900;margin:0 0 12px;letter-spacing:-0.5px">
      You're on the list.
    </h1>
    <p style="font-size:15px;line-height:1.6;color:#52525b;margin:0 0 24px">
      Welcome to PickSniff, the fastest way to find a fragrance you'll actually love.
      We'll send you weekly picks, hidden gems, and scent guides straight to your inbox.
    </p>

    <a href="https://picksniff.com/quiz"
       style="display:inline-block;background:#7fe040;color:#000000;font-weight:900;font-size:14px;padding:14px 28px;border-radius:9999px;text-decoration:none">
      Take the Quiz →
    </a>

    <hr style="border:none;border-top:1px solid #e4e4e7;margin:40px 0">

    <p style="font-size:12px;color:#a1a1aa;margin:0">
      You're receiving this because you signed up at picksniff.com. ·
      <a href="${unsubscribeUrl}" style="color:#a1a1aa">Unsubscribe</a>
    </p>
  </div>
</body>
</html>`,
  }
}
