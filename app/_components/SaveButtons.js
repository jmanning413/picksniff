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
        <a href="/auth" className="font-bold text-green-deep hover:underline">
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

  // Deliberately quiet: the buy button is the one loud action on a card
  return (
    <div className="mt-3 flex gap-5">
      <button
        type="button"
        onClick={handleWishlist}
        disabled={isPending}
        className={[
          'text-xs font-bold transition disabled:opacity-50',
          wishlisted ? 'text-green-deep' : 'text-slate hover:text-black',
        ].join(' ')}
      >
        {wishlisted ? '♥ Wishlisted' : '♡ Wishlist'}
      </button>
      <button
        type="button"
        onClick={handleOwned}
        disabled={isPending}
        className={[
          'text-xs font-bold transition disabled:opacity-50',
          owned ? 'text-green-deep' : 'text-slate hover:text-black',
        ].join(' ')}
      >
        {owned ? '✓ Owned' : '+ Own it'}
      </button>
    </div>
  )
}
