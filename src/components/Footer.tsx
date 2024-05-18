export function Footer() {
  return (
    <footer className="pt-3 px-6 pb-8 border-t-2 border-white/10 text-spotify-200/50">
      <p>
        <span>Made by Ben Gaudry</span>
        <br />
        <div className="flex flex-row items-center gap-8">

        <span>© {new Date().getFullYear()}</span>
        <a href="/legal" className="hover:text-spotify-100 underline underline-offset-2 transition-colors duration-150">Legal notice</a>
        <a
          href="https://github.com/bengaudry/sortify"
          target="_blank" className="hover:text-spotify-100 underline underline-offset-2 transition-colors duration-150"
          >
          GitHub
        </a>
          </div>
      </p>
    </footer>
  );
}
