import { useData } from './hooks/useData.ts';
import { MapView } from './components/MapView.tsx';
import { Header } from './components/Header.tsx';
import { Controls } from './components/Controls.tsx';
import { StatsBar } from './components/StatsBar.tsx';
import { Legend } from './components/Legend.tsx';

function App() {
  const { fires, meta, loading, error, filters, setFilters, stats, allCauses } =
    useData();

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
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-col gap-2">
        <div className="flex flex-wrap items-start gap-2">
          <Header />
          {meta?.demo && (
            <div className="glass rounded-lg shadow px-3 py-2 text-xs text-fire-700 font-medium">
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
      <div className="absolute bottom-6 left-3 z-[1000]">
        <Legend />
      </div>
    </div>
  );
}

export default App;
