import { useState } from 'react';
import { useData } from './hooks/useData.ts';
import { timeAgo } from './utils/format.ts';
import { MapView } from './components/MapView.tsx';
import { Header } from './components/Header.tsx';
import { Controls } from './components/Controls.tsx';
import { StatsBar } from './components/StatsBar.tsx';
import { Legend } from './components/Legend.tsx';
import { AboutModal } from './components/AboutModal.tsx';

function App() {
  const { fires, meta, loading, error, filters, setFilters, stats, allCauses } =
    useData();
  const [showAbout, setShowAbout] = useState(false);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-fire-50">
        <div className="text-fire-700 font-medium text-lg">
          Chargement des donnees...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50">
        <div className="text-red-700 font-medium">Erreur : {error}</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Map */}
      <MapView fires={fires} />

      {/* Top overlay */}
      <div className="absolute top-2 left-2 right-2 md:top-3 md:left-3 md:right-3 z-[1000] flex flex-col gap-1.5 md:gap-2">
        <div className="flex flex-wrap items-start gap-1.5 md:gap-2">
          <Header />
          {meta?.demo && (
            <div className="glass rounded-lg shadow px-2 py-1 md:px-3 md:py-2 text-[10px] md:text-xs text-fire-700 font-medium">
              Donnees de demonstration
            </div>
          )}
        </div>
        <Controls
          filters={filters}
          onChange={setFilters}
          years={meta?.years ?? []}
          allCauses={allCauses}
        />
        <StatsBar
          totalFires={stats.totalFires}
          totalHa={stats.totalHa}
          largest={stats.largest}
          mostDept={stats.mostDept}
          mostCount={stats.mostCount}
        />
      </div>

      {/* Legend bottom-left */}
      <div className="absolute bottom-4 left-2 md:bottom-6 md:left-3 z-[1000]">
        <Legend />
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 right-2 md:bottom-6 md:right-3 z-[1000] hidden md:flex items-center gap-2 glass rounded-lg px-3 py-1.5 text-[11px] text-gray-600 shadow-sm">
        {meta?.generatedAt && <span>{timeAgo(meta.generatedAt)}</span>}
        <button onClick={() => setShowAbout(true)} className="underline hover:text-gray-900">
          A propos
        </button>
      </div>

      {showAbout && (
        <AboutModal
          onClose={() => setShowAbout(false)}
          lastUpdate={meta?.generatedAt}
          isDemo={meta?.demo}
        />
      )}
    </div>
  );
}

export default App;
