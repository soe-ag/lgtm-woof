export function Footer() {
  return (
    <footer className="border-t mt-20 py-8 bg-white dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-[13px] text-zinc-500">
          {/* Section 1: Branding/Love */}
          <div className="flex items-center gap-2">
            <span>Made with ❤️ for paw-some code reviews.</span>
          </div>

          {/* Section 2: Tech Stack */}
          <div className="flex items-center gap-4 md:border-x md:border-zinc-200 md:dark:border-zinc-800 md:px-6">
            <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">Tech</span>
            <div className="flex items-center gap-3">
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-50 hover:opacity-100 transition-opacity"
              >
                <svg
                  className="h-3 dark:invert"
                  viewBox="0 0 394 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="currentColor"
                    d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"
                  />
                  <path
                    fill="currentColor"
                    d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"
                  />
                </svg>
              </a>
              <a
                href="https://convex.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 opacity-50 hover:opacity-100 transition-opacity"
              >
                <svg
                  className="h-3.5 w-3.5 text-[#EECA40]"
                  viewBox="0 0 256 256"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M128 0L256 128L128 256L0 128L128 0Z" fill="currentColor" />
                  <path d="M128 64L192 128L128 192L64 128L128 64Z" fill="white" fillOpacity="0.8" />
                </svg>
                <span className="font-bold text-zinc-900 dark:text-white text-[12px] tracking-tight">
                  Convex
                </span>
              </a>
            </div>
          </div>

          {/* Section 3: Credits */}
          <div className="flex items-center gap-3 text-zinc-400">
            <a
              href="https://www.flaticon.com/free-icons/paw"
              title="paw icons"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            >
              Paw icons
            </a>
            <span className="opacity-20">•</span>
            <span>
              Images by{' '}
              <a
                href="https://dog.ceo/dog-api/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-2"
              >
                Dog API
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
