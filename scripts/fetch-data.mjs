/**
 * Fetch real BDIFF fire data and geocode communes via geo.api.gouv.fr.
 *
 * Source: https://bdiff.agriculture.gouv.fr/incendies/zip
 * Geocoding: https://geo.api.gouv.fr/communes/{codeInsee}?fields=centre
 */

import { writeFileSync, readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'data');
const TMP_ZIP = '/tmp/bdiff_pipeline.zip';
const TMP_DIR = '/tmp/bdiff_pipeline/';

const BDIFF_URL = 'https://bdiff.agriculture.gouv.fr/incendies/zip';

async function main() {
  console.log('\n=== Carte des Incendies - Data Pipeline ===\n');

  // 1. Download BDIFF ZIP (using curl to bypass SSL cert issues)
  console.log('Step 1: Downloading BDIFF data...');
  execSync(`curl -sk "${BDIFF_URL}" -o ${TMP_ZIP}`, { stdio: 'pipe', timeout: 60000 });
  execSync(`rm -rf ${TMP_DIR} && mkdir -p ${TMP_DIR} && unzip -o ${TMP_ZIP} -d ${TMP_DIR}`, { stdio: 'pipe' });

  const csvText = readFileSync(join(TMP_DIR, 'Incendies.csv'), 'utf-8');
  console.log(`  -> ${(csvText.length / 1024).toFixed(0)} KB downloaded`);

  // 2. Parse CSV
  console.log('Step 2: Parsing CSV...');
  const lines = csvText.split('\n');
  let headerIdx = lines.findIndex(l => l.startsWith('Ann'));
  if (headerIdx === -1) throw new Error('Header row not found');

  const fires = [];
  const communeCodes = new Set();

  for (let i = headerIdx + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const f = parseCsvLine(line, ';');
    if (f.length < 19) continue;

    const codeInsee = f[3].replace(/"/g, '');
    if (!codeInsee) continue;

    communeCodes.add(codeInsee);
    fires.push({
      annee: parseInt(f[0]),
      num: f[1],
      dept: f[2].replace(/"/g, ''),
      codeInsee,
      commune: f[4].replace(/"/g, ''),
      date: f[5].replace(/"/g, '').split(' ')[0],
      surfaceM2: parseFloat(f[6]) || 0,
      cause: normalizeCause(f[18]),
    });
  }

  console.log(`  -> ${fires.length} fires, ${communeCodes.size} unique communes`);

  // 3. Geocode communes
  console.log('Step 3: Geocoding communes via geo.api.gouv.fr...');
  const geo = new Map();
  const codes = [...communeCodes];

  for (let i = 0; i < codes.length; i += 50) {
    const batch = codes.slice(i, i + 50);
    await Promise.all(batch.map(async (code) => {
      try {
        const r = await fetch(`https://geo.api.gouv.fr/communes/${code}?fields=centre&format=json`);
        if (!r.ok) return;
        const d = await r.json();
        if (d.centre?.coordinates) {
          geo.set(code, [
            Math.round(d.centre.coordinates[1] * 10000) / 10000,
            Math.round(d.centre.coordinates[0] * 10000) / 10000,
          ]);
        }
      } catch { /* skip */ }
    }));
    if ((i + 50) % 500 < 50) {
      console.log(`  -> ${Math.min(i + 50, codes.length)} / ${codes.length}`);
    }
  }
  console.log(`  -> ${geo.size} communes geocoded`);

  // 4. Build output
  const result = fires
    .filter(f => geo.has(f.codeInsee))
    .map(f => {
      const [lat, lng] = geo.get(f.codeInsee);
      return {
        id: `${f.annee}-${f.num}`,
        date: f.date,
        lat, lng,
        dept: f.dept,
        commune: f.commune,
        surface: Math.round(f.surfaceM2 / 100) / 100, // m² → ha, 2 decimals
        cause: f.cause,
      };
    });

  const years = [...new Set(fires.map(f => f.annee))].sort();
  const output = {
    meta: {
      demo: false,
      generatedAt: new Date().toISOString(),
      source: 'BDIFF - Base de Donnees sur les Incendies de Forets en France',
      url: 'https://bdiff.agriculture.gouv.fr',
      years,
      total: result.length,
    },
    fires: result,
  };

  mkdirSync(OUT_DIR, { recursive: true });
  const outPath = join(OUT_DIR, 'incendies.json');
  writeFileSync(outPath, JSON.stringify(output));
  const sizeMB = (Buffer.byteLength(JSON.stringify(output)) / 1024 / 1024).toFixed(2);
  console.log(`\nWritten ${outPath} (${sizeMB} MB, ${result.length} fires)\n`);
}

function normalizeCause(raw) {
  if (!raw) return 'Inconnue';
  const n = raw.replace(/"/g, '').toLowerCase();
  if (n.includes('malveill')) return 'Intentionnelle';
  if (n.includes('involontaire') || n.includes('accident') || n.includes('imprudence')) return 'Involontaire';
  if (n.includes('naturel') || n.includes('foudre')) return 'Naturelle';
  return 'Inconnue';
}

function parseCsvLine(line, sep) {
  const fields = [];
  let cur = '', inQ = false;
  for (const c of line) {
    if (c === '"') inQ = !inQ;
    else if (c === sep && !inQ) { fields.push(cur); cur = ''; }
    else cur += c;
  }
  fields.push(cur);
  return fields;
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
