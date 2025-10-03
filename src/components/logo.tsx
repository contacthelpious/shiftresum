
export function Logo() {
  return (
    <div className="flex items-center gap-2" aria-label="Shift Resume logo">
      <svg
        className="h-6 w-6 text-primary"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M14 2H6C4.9 2 4 2.9 4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 10V8.5h2.5L11 4L6.5 8.5H9V12h4zm4 4H8v-2h9v2zm0-4H8v-2h9v2z" />
      </svg>
      <span className="text-xl font-bold text-primary font-headline">Shift Resume</span>
    </div>
  );
}
