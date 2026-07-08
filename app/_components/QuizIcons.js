// Line-style icons for quiz answer options — same stroke language as the
// quiz-hub icons (1.75 stroke, round caps). Color comes from the parent via
// currentColor; wrap in a `text-green-deep` span per Design.md icon rules.

const PATHS = {
  // Personality — vibes
  moon: (
    <path d="M19 4 A12 12 0 1 0 28 17 A9.5 9.5 0 0 1 19 4 Z" />
  ),
  sprig: (
    <>
      <path d="M16 28 V13" />
      <path d="M16 15 C10 15 7 11 7 6 C12 6 16 9 16 15 Z" />
      <path d="M16 20 C21 20 24 17 24 12 C20 12 16 15 16 20 Z" />
    </>
  ),
  flame: (
    <>
      <path d="M16 4 C20 9 24 13 24 19 A8 8 0 1 1 8 19 C8 13 12 9 16 4 Z" />
      <path d="M16 27 A4 4 0 0 1 12 22 C12 19.5 14 17.5 16 15.5 C18 17.5 20 19.5 20 22 A4 4 0 0 1 16 27 Z" />
    </>
  ),
  candle: (
    <>
      <rect x="11" y="15" width="10" height="13" rx="1.5" />
      <path d="M16 12 V15" />
      <path d="M16 4 C18 6.5 18.5 8 16 10 C13.5 8 14 6.5 16 4 Z" />
    </>
  ),
  // Personality — places
  pine: (
    <>
      <path d="M16 3 L22 12 H18.5 L24.5 21 H7.5 L13.5 12 H10 Z" />
      <path d="M16 21 V28" />
    </>
  ),
  city: (
    <>
      <path d="M4 28 V13 H12 V28" />
      <path d="M12 28 V6 H21 V28" />
      <path d="M21 28 V16 H28 V28" />
      <path d="M4 28 H28" />
    </>
  ),
  wave: (
    <>
      <path d="M4 15 C8 10 12 10 16 15 C20 20 24 20 28 15" />
      <path d="M4 22 C8 17 12 17 16 22 C20 27 24 27 28 22" />
    </>
  ),
  rose: (
    <>
      <circle cx="16" cy="10" r="6" />
      <path d="M16 7 A3 3 0 0 1 16 13 A3 3 0 0 1 13 10" />
      <path d="M16 16 V28" />
      <path d="M16 22 C12 22 9.5 20 9 16.5 C13 16.5 15.5 18.5 16 22 Z" />
    </>
  ),
  // Personality — times
  sunrise: (
    <>
      <path d="M4 22 H28" />
      <path d="M10 22 A6 6 0 0 1 22 22" />
      <path d="M16 9 V5 M6.5 13.5 L4.5 11.5 M25.5 13.5 L27.5 11.5" />
    </>
  ),
  sun: (
    <>
      <circle cx="16" cy="16" r="5.5" />
      <path d="M16 5 V8 M16 24 V27 M5 16 H8 M24 16 H27 M8.2 8.2 L10.3 10.3 M21.7 21.7 L23.8 23.8 M8.2 23.8 L10.3 21.7 M21.7 10.3 L23.8 8.2" />
    </>
  ),
  sunset: (
    <>
      <path d="M4 20 H28" />
      <path d="M10 20 A6 6 0 0 1 22 20" />
      <path d="M13 26 H19 M8 24 H24" />
    </>
  ),
  night: (
    <>
      <path d="M17 6 A10 10 0 1 0 25 17 A8 8 0 0 1 17 6 Z" />
      <path d="M25 5 L25.8 7.2 L28 8 L25.8 8.8 L25 11 L24.2 8.8 L22 8 L24.2 7.2 Z" />
    </>
  ),
  // Mood — energy
  battery: (
    <>
      <rect x="4" y="11" width="20" height="10" rx="2" />
      <path d="M27 14 V18" />
      <path d="M8 14.5 V17.5" />
    </>
  ),
  bolt: (
    <path d="M18 4 L8 18 H14.5 L13 28 L24 13.5 H17 Z" />
  ),
  // Mood — headspace
  people: (
    <>
      <circle cx="11" cy="11" r="4" />
      <circle cx="21.5" cy="12.5" r="3.2" />
      <path d="M4 26 C4 20.5 7.5 18 11 18 C14.5 18 18 20.5 18 26" />
      <path d="M19.5 26 C19.5 21.5 21 19.5 21.5 19.5 C24.5 19.5 27.5 21.5 27.5 26" />
    </>
  ),
  lotus: (
    <>
      <circle cx="16" cy="8" r="3.5" />
      <path d="M16 13 C12.5 14.5 11 17 11 20.5 H21 C21 17 19.5 14.5 16 13 Z" />
      <path d="M6 25 C9 21.5 13 20.5 16 24 C19 20.5 23 21.5 26 25" />
    </>
  ),
  briefcase: (
    <>
      <rect x="5" y="11" width="22" height="15" rx="2" />
      <path d="M12 11 V9 A2 2 0 0 1 14 7 H18 A2 2 0 0 1 20 9 V11" />
      <path d="M5 17 H27" />
    </>
  ),
  heart: (
    <path d="M16 27 C8.5 21.5 4.5 16.5 4.5 12 A6 6 0 0 1 16 9 A6 6 0 0 1 27.5 12 C27.5 16.5 23.5 21.5 16 27 Z" />
  ),
  // Mood — intent
  burst: (
    <>
      <circle cx="16" cy="16" r="3" />
      <path d="M16 4 V9 M16 23 V28 M4 16 H9 M23 16 H28 M7.5 7.5 L11 11 M21 21 L24.5 24.5 M7.5 24.5 L11 21 M21 11 L24.5 7.5" />
    </>
  ),
  shield: (
    <>
      <path d="M16 4 L26 8 V15 C26 21.5 21.5 26 16 28 C10.5 26 6 21.5 6 15 V8 Z" />
      <path d="M11.5 16 L15 19.5 L21 12.5" />
    </>
  ),
  sprout: (
    <>
      <path d="M16 28 V15" />
      <path d="M16 15 C16 9.5 12.5 6.5 7 6.5 C7 12 10.5 15 16 15 Z" />
      <path d="M16 15 C16 9.5 19.5 6.5 25 6.5 C25 12 21.5 15 16 15 Z" />
    </>
  ),
  star: (
    <path d="M16 5 L18.6 12 L26 12 L20.2 16.8 L22.6 24 L16 19.6 L9.4 24 L11.8 16.8 L6 12 L13.4 12 Z" />
  ),
  // Accord explorer
  citrus: (
    <>
      <circle cx="16" cy="16" r="11" />
      <path d="M16 16 V6 M16 16 L24.7 11 M16 16 L24.7 21 M16 16 V26 M16 16 L7.3 21 M16 16 L7.3 11" />
    </>
  ),
  flower: (
    <>
      <circle cx="16" cy="16" r="3" />
      <path d="M16 13 C13.5 9.5 13.5 5.5 16 3.5 C18.5 5.5 18.5 9.5 16 13 Z" />
      <path d="M16 19 C13.5 22.5 13.5 26.5 16 28.5 C18.5 26.5 18.5 22.5 16 19 Z" />
      <path d="M13 16 C9.5 13.5 5.5 13.5 3.5 16 C5.5 18.5 9.5 18.5 13 16 Z" />
      <path d="M19 16 C22.5 13.5 26.5 13.5 28.5 16 C26.5 18.5 22.5 18.5 19 16 Z" />
    </>
  ),
  droplet: (
    <>
      <path d="M16 4 C21 11 24 15 24 19.5 A8 8 0 1 1 8 19.5 C8 15 11 11 16 4 Z" />
      <path d="M12 20 A4 4 0 0 0 15 24" />
    </>
  ),
  amber: (
    <>
      <circle cx="16" cy="16" r="6" />
      <path d="M16 5 A11 11 0 0 1 27 16" />
      <path d="M16 27 A11 11 0 0 1 5 16" />
    </>
  ),
  chili: (
    <>
      <path d="M13 9 C13 19 18 26 26 26 C27 22 24 12 17 9 Z" />
      <path d="M13 9 C12 6 14 4 17 5" />
    </>
  ),
  wind: (
    <>
      <path d="M4 11 H19 A3 3 0 1 0 16 6.5" />
      <path d="M4 17 H25 A3.2 3.2 0 1 1 21.5 21.5" />
      <path d="M4 23 H14 A2.5 2.5 0 1 0 11.5 19" />
    </>
  ),
  peach: (
    <>
      <circle cx="16" cy="18" r="9" />
      <path d="M16 9 C14.5 14 14.5 23 16 27" />
      <path d="M16 9 C16 5.5 19 3.5 22.5 4 C22 7.5 19.5 9 16 9 Z" />
    </>
  ),
  leaf: (
    <>
      <path d="M16 3 C20 4 24 10 23 17 C22 22 19 27 16 29 C13 27 10 22 9 17 C8 10 12 4 16 3 Z" />
      <path d="M16 3 V29" />
    </>
  ),
  snowflake: (
    <>
      <path d="M16 4 V28 M5.6 10 L26.4 22 M26.4 10 L5.6 22" />
      <path d="M13 6.5 L16 9.5 L19 6.5 M13 25.5 L16 22.5 L19 25.5" />
    </>
  ),
  // Gift occasions
  cake: (
    <>
      <rect x="6" y="17" width="20" height="10" rx="1.5" />
      <rect x="9" y="12" width="14" height="5" rx="1.5" />
      <path d="M16 8 V12" />
      <path d="M16 4.5 C16.9 5.5 16.9 6.5 16 7.2 C15.1 6.5 15.1 5.5 16 4.5 Z" />
    </>
  ),
  ring: (
    <>
      <circle cx="16" cy="19" r="8" />
      <path d="M16 4 L20 8 L16 11.5 L12 8 Z" />
    </>
  ),
  envelope: (
    <>
      <rect x="4" y="8" width="24" height="16" rx="2" />
      <path d="M4.5 10 L16 19 L27.5 10" />
    </>
  ),
  sparkle: (
    <path d="M16 3 C17.5 10 22 10.5 29 16 C22 21.5 17.5 22 16 29 C14.5 22 10 21.5 3 16 C10 10.5 14.5 10 16 3 Z" />
  ),
  // Badges
  medal: (
    <>
      <circle cx="16" cy="20" r="7" />
      <circle cx="16" cy="20" r="3" />
      <path d="M12.5 14 L9 4 H14.5 L16 8.5 L17.5 4 H23 L19.5 14" />
    </>
  ),
  bookmark: (
    <path d="M9 4 H23 V28 L16 22.5 L9 28 Z" />
  ),
  magnifier: (
    <>
      <circle cx="14" cy="14" r="8" />
      <path d="M20 20 L27 27" />
    </>
  ),
  gem: (
    <>
      <path d="M9 5 H23 L28 12 L16 28 L4 12 Z" />
      <path d="M4 12 H28 M11 5 L14 12 L16 28 M21 5 L18 12 L16 28" />
    </>
  ),
  book: (
    <>
      <path d="M6 6 C10 4.5 14 4.5 16 6.5 C18 4.5 22 4.5 26 6 V25 C22 23.5 18 23.5 16 25.5 C14 23.5 10 23.5 6 25 Z" />
      <path d="M16 6.5 V25.5" />
    </>
  ),
}

export default function QuizIcon({ name, size = 30 }) {
  const paths = PATHS[name]
  if (!paths) return null
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths}
    </svg>
  )
}
