import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center text-center gap-6 max-w-lg">
        <Image src="/logo.svg" alt="PickSniff logo" width={320} height={320} priority />
        <h1 className="text-6xl font-bold tracking-tight text-black">
          Pick<span className="text-green-accent">Sniff</span>
        </h1>
        <p className="text-xl text-zinc-500 leading-relaxed">
          Find your perfect fragrance
        </p>
        <Link
          href="/quiz"
          className="mt-2 px-10 py-4 text-lg font-semibold text-white bg-green-accent rounded-full hover:opacity-90 transition-opacity"
        >
          Find My Scent
        </Link>
      </div>
    </main>
  );
}
