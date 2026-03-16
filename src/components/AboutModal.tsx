import { timeAgo } from '../utils/format';

interface Props {
  onClose: () => void;
  lastUpdate?: string;
  isDemo?: boolean;
}

export function AboutModal({ onClose, lastUpdate, isDemo }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-900">A propos</h2>
        <div className="mt-3 space-y-3 text-sm text-gray-600">
          <p>
            Cette carte interactive recense les incendies de forets en France a
            partir de la base de donnees nationale BDIFF. Elle permet de filtrer par
            annee, surface minimale et cause, et de visualiser la repartition
            geographique des feux.
          </p>
          {isDemo && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-amber-700">
              Les donnees affichees sont des donnees de demonstration.
            </p>
          )}
          <p>
            <strong>Source :</strong> BDIFF (Base de Donnees sur les Incendies de
            Forets en France) — Ministere de l'Agriculture / IGN ·{' '}
            <a
              href="https://bdiff.agriculture.gouv.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              bdiff.agriculture.gouv.fr
            </a>
          </p>
          <p>
            <strong>Licence :</strong> Licence Ouverte v2.0
          </p>
          {lastUpdate && (
            <p>
              <strong>Derniere mise a jour :</strong> {timeAgo(lastUpdate)}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
