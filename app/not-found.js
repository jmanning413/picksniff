import Image from 'next/image'
import Link from 'next/link'

export const metadata = { title: 'Page Not Found — PickSniff' }

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-5 text-center">
      <Image src="/logo.svg" alt="PickSniff" width={64} height={64} priority />
      <h1 className="mt-6 text-4xl font-black tracking-tight text-black">Page not found</h1>
      <p className="mt-3 max-w-sm text-base text-zinc-500">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-green-accent px-8 py-3 text-sm font-black text-black transition hover:brightness-95"
      >
        Back to PickSniff
      </Link>
    </main>
  )
}
