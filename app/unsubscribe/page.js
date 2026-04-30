import { createClient } from '@supabase/supabase-js'
import Header from '@/app/_components/Header'
import Footer from '@/app/_components/Footer'

function getAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export const metadata = {
  title: 'Unsubscribe — PickSniff',
  robots: { index: false },
}

export default async function UnsubscribePage({ searchParams }) {
  const token = (await searchParams)?.token
  let status = 'invalid'

  if (token) {
    const admin = getAdmin()
    if (admin) {
      const { error } = await admin
        .from('subscribers')
        .delete()
        .eq('token', token)
      status = error ? 'error' : 'success'
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="w-full max-w-sm text-center">
          {status === 'success' && (
            <>
              <p className="text-4xl">👋</p>
              <h1 className="mt-4 text-2xl font-black text-black">You're unsubscribed</h1>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                You've been removed from the PickSniff email list. You won't hear from us again.
              </p>
            </>
          )}
          {status === 'invalid' && (
            <>
              <h1 className="text-2xl font-black text-black">Invalid link</h1>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                This unsubscribe link is invalid or has already been used.
              </p>
            </>
          )}
          {status === 'error' && (
            <>
              <h1 className="text-2xl font-black text-black">Something went wrong</h1>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Please try again or contact us at hello@picksniff.com.
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
