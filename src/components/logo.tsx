
export function Logo() {
  return (
    <div className="flex items-center gap-2" aria-label="Shift Resume logo">
      <svg
        className="h-6 w-6 text-primary"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM16 18H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
        <path d="M5.12 14.12L6.54 15.54L9 13V18h2v-5l2.46 2.46l1.42-1.42L9.12 9.29z" />
      </svg>
      <span className="text-xl font-bold text-primary font-headline">Shift Resume</span>
    </div>
  );
}
