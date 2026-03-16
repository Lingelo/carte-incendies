import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import type { Fire } from '../types.ts';
import { getFireColor, getFireRadius } from '../utils/colors.ts';
import { formatDate, formatHa } from '../utils/format.ts';

interface MapViewProps {
  fires: Fire[];
}

const FRANCE_CENTER: [number, number] = [43.5, 3.5];
const DEFAULT_ZOOM = 7;

export function MapView({ fires }: MapViewProps) {
  return (
    <MapContainer
      center={FRANCE_CENTER}
      zoom={DEFAULT_ZOOM}
      className="w-full h-full"
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {fires.map((fire) => (
        <CircleMarker
          key={fire.id}
          center={[fire.lat, fire.lng]}
          radius={getFireRadius(fire.surface)}
          pathOptions={{
            color: getFireColor(fire.surface),
            fillColor: getFireColor(fire.surface),
            fillOpacity: 0.6,
            weight: 1,
          }}
        >
          <Popup>
            <div className="text-sm leading-relaxed">
              <div className="font-semibold text-gray-900">{fire.commune}</div>
              <div className="text-gray-600">
                Departement {fire.dept}
              </div>
              <div className="mt-1">
                <span className="text-gray-500">Date :</span>{' '}
                {formatDate(fire.date)}
              </div>
              <div>
                <span className="text-gray-500">Surface :</span>{' '}
                <span className="font-medium">{formatHa(fire.surface)}</span>
              </div>
              <div>
                <span className="text-gray-500">Cause :</span> {fire.cause}
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
