'use client'

import { useState } from 'react'

export default function AdminEmailPage() {
  const [secret, setSecret] = useState('')
  const [authed, setAuthed] = useState(false)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [preview, setPreview] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  function handleAuth(e) {
    e.preventDefault()
    // The server-side BROADCAST_SECRET check on /api/broadcast is the only
    // real gate; this form just collects the password to send with requests.
    if (secret.trim().length > 0) setAuthed(true)
  }

  async function handleSend(e) {
    e.preventDefault()
    if (!subject || !body) return
    const confirmed = window.confirm(`Send "${subject}" to your entire subscriber list?`)
    if (!confirmed) return

    setLoading(true)
    setResult(null)
    try {
      const html = bodyToHtml(body)
      const res = await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, subject, html }),
      })
      const data = await res.json()
      if (data.ok) {
        setResult({ type: 'success', message: `Sent to ${data.sent} subscriber${data.sent !== 1 ? 's' : ''}.` })
        setSubject('')
        setBody('')
      } else {
        setResult({ type: 'error', message: data.error || 'Something went wrong.' })
      }
    } catch {
      setResult({ type: 'error', message: 'Network error.' })
    } finally {
      setLoading(false)
    }
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-5">
        <form onSubmit={handleAuth} className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-black text-black">Admin</h1>
          <input
            type="password"
            placeholder="Password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="w-full rounded-lg border border-sand px-4 py-3 text-sm outline-none focus:border-green-accent"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-green-accent py-3 text-sm font-black text-black transition hover:brightness-95"
          >
            Enter
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream px-5 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-black text-black">Send Email</h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPreview(false)}
              className={`rounded-full px-4 py-2 text-xs font-black transition ${!preview ? 'bg-green-accent text-black' : 'border border-sand text-slate hover:text-black'}`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setPreview(true)}
              className={`rounded-full px-4 py-2 text-xs font-black transition ${preview ? 'bg-green-accent text-black' : 'border border-sand text-slate hover:text-black'}`}
            >
              Preview
            </button>
          </div>
        </div>

        {result && (
          <div className={`mb-6 rounded-xl px-5 py-4 text-sm font-bold ${result.type === 'success' ? 'bg-green-accent/15 text-green-700' : 'bg-red-50 text-red-600'}`}>
            {result.message}
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
              Subject
            </label>
            <input
              type="text"
              required
              placeholder="This week's fragrance pick..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-sand px-4 py-3 text-sm outline-none focus:border-green-accent"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-black uppercase tracking-[0.16em] text-zinc-400">
              Body
            </label>
            {preview ? (
              <div
                className="min-h-64 rounded-lg border border-sand p-5 text-sm leading-7 text-zinc-700"
                dangerouslySetInnerHTML={{ __html: bodyToHtml(body) }}
              />
            ) : (
              <textarea
                required
                rows={14}
                placeholder={`Write your email here...\n\nUse blank lines between paragraphs.\n\nYou can add a link like this:\n[Click here](https://picksniff.com)`}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full rounded-lg border border-sand px-4 py-3 text-sm leading-7 outline-none focus:border-green-accent resize-none"
              />
            )}
            <p className="mt-1.5 text-xs text-zinc-400">
              Blank line = new paragraph · <code>[Link text](url)</code> = clickable link
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !subject || !body}
            className="w-full rounded-full bg-green-accent py-3.5 text-sm font-black text-black transition hover:brightness-95 disabled:opacity-50"
          >
            {loading ? 'Sending…' : 'Send to All Subscribers'}
          </button>
        </form>
      </div>
    </div>
  )
}

function bodyToHtml(text) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const withLinks = p.replace(
        /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
        '<a href="$2" style="color:#7fe040;font-weight:700">$1</a>',
      )
      const withBreaks = withLinks.replace(/\n/g, '<br>')
      return `<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#3f3f46">${withBreaks}</p>`
    })
    .join('')

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:48px 24px">
    <div style="margin-bottom:32px">
      <span style="font-size:22px;font-weight:900;letter-spacing:-0.5px">Pick<span style="color:#7fe040">Sniff</span></span>
    </div>
    ${paragraphs}
    <hr style="border:none;border-top:1px solid #e4e4e7;margin:40px 0">
    <p style="font-size:12px;color:#a1a1aa;margin:0">
      You're receiving this because you signed up at picksniff.com.
    </p>
  </div>
</body>
</html>`
}
