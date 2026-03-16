export function Header() {
  return (
    <div className="glass rounded-lg shadow-lg px-4 py-2 flex items-center gap-2">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-6 h-6 md:w-7 md:h-7 text-fire-600 shrink-0"
        aria-hidden="true"
      >
        <path
          d="M12 2C12 2 7 8 7 13a5 5 0 0 0 10 0c0-5-5-11-5-11z"
          fill="currentColor"
          opacity="0.3"
        />
        <path
          d="M12 2C12 2 7 8 7 13a5 5 0 0 0 10 0c0-5-5-11-5-11z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M12 18a2 2 0 0 0 2-2c0-2-2-4-2-4s-2 2-2 4a2 2 0 0 0 2 2z"
          fill="currentColor"
        />
      </svg>
      <h1 className="text-base md:text-lg font-bold text-gray-900 whitespace-nowrap">
        Carte des Incendies de Foret
      </h1>
    </div>
  );
}
