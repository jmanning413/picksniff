import Image from 'next/image'

export default function LoadingSniff({ message = 'Sniffing for you...' }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white gap-5">
      <div className="flex flex-col items-center gap-4">
        <Image src="/logo.svg" alt="PickSniff" width={80} height={80} priority />

        <div className="flex flex-col items-center gap-2">
          <div
            className="h-1 w-12 rounded-full bg-green-accent origin-center"
            style={{ animation: 'scent-breathe 1.5s ease-in-out infinite' }}
          />
          <div
            className="h-1 w-8 rounded-full bg-green-accent origin-center"
            style={{ animation: 'scent-breathe-2 1.5s ease-in-out infinite 0.15s' }}
          />
          <div
            className="h-1 w-5 rounded-full bg-green-accent origin-center"
            style={{ animation: 'scent-breathe-3 1.5s ease-in-out infinite 0.3s' }}
          />
        </div>
      </div>

      <p className="text-sm font-medium text-zinc-400">{message}</p>
    </div>
  )
}
