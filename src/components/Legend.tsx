import { FIRE_SCALE } from '../utils/colors.ts';

export function Legend() {
  return (
    <div className="glass rounded-lg shadow-lg p-3 text-sm">
      <div className="font-semibold text-gray-800 mb-2">Surface brulee</div>
      <div className="flex flex-col gap-1.5">
        {FIRE_SCALE.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className="inline-block w-3.5 h-3.5 rounded-full border border-gray-300"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
