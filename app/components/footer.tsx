import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full flex justify-center items-center py-6 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border-t border-white/20">
      <Link
        href="https://github.com/bitflowcode/webln-boost-widget"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        aria-label="GitHub"
      >
        <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.8 1.6 2.7 1.1.1-.7.4-1.1.7-1.4-2.7-.3-5.5-1.3-5.5-5.7 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.9 1.2 1.9 1.2 3.2 0 4.4-2.8 5.4-5.5 5.7.4.3.8 1 .8 2v3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"/>
        </svg>
      </Link>
    </footer>
  )
}