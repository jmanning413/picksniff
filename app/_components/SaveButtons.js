'use client'

import { useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import { toggleWishlist, toggleOwned } from '@/app/_actions/collection'

export default function SaveButtons({ fragranceId, initialWishlisted, initialOwned, isLoggedIn }) {
  const [isPending, startTransition] = useTransition()
  const [wishlisted, setWishlisted] = useState(initialWishlisted)
  const [owned, setOwned] = useState(initialOwned)

  if (!isLoggedIn) {
    return (
      <p className="mt-4 text-center text-xs text-zinc-400">
        <a href="/auth" className="font-bold text-green-accent hover:underline">
          Sign in
        </a>{' '}
        to save to wishlist or collection
      </p>
    )
  }

  function handleWishlist() {
    startTransition(async () => {
      const result = await toggleWishlist(fragranceId)
      if (result && !result.error) {
        setWishlisted(result.wishlisted)
        toast.success(result.wishlisted ? 'Added to wishlist' : 'Removed from wishlist')
      }
    })
  }

  function handleOwned() {
    startTransition(async () => {
      const result = await toggleOwned(fragranceId)
      if (result && !result.error) {
        setOwned(result.owned)
        toast.success(result.owned ? 'Added to collection' : 'Removed from collection')
      }
    })
  }

  return (
    <div className="mt-4 flex gap-2">
      <button
        type="button"
        onClick={handleWishlist}
        disabled={isPending}
        className={[
          'flex-1 rounded-full border px-4 py-2.5 text-xs font-bold transition disabled:opacity-50',
          wishlisted
            ? 'border-green-accent bg-green-accent text-black'
            : 'border-zinc-200 text-zinc-600 hover:border-green-accent',
        ].join(' ')}
      >
        {wishlisted ? '♥ Wishlisted' : '♡ Wishlist'}
      </button>
      <button
        type="button"
        onClick={handleOwned}
        disabled={isPending}
        className={[
          'flex-1 rounded-full border px-4 py-2.5 text-xs font-bold transition disabled:opacity-50',
          owned
            ? 'border-green-accent bg-green-accent text-black'
            : 'border-zinc-200 text-zinc-600 hover:border-green-accent',
        ].join(' ')}
      >
        {owned ? '✓ Owned' : '+ Own it'}
      </button>
    </div>
  )
}
