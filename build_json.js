const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

// --- ASCII85 + FlateDecode ---
function decodeASCII85(str) {
  str = str.replace(/\s/g, '').replace(/~>$/, '');
  const out = [];
  let i = 0;
  while (i < str.length) {
    if (str[i] === 'z') { out.push(0, 0, 0, 0); i++; continue; }
    const chars = str.slice(i, i + 5);
    i += chars.length;
    let val = 0;
    for (let j = 0; j < chars.length; j++) val = val * 85 + (chars.charCodeAt(j) - 33);
    const pad = 5 - chars.length;
    for (let p = 0; p < pad; p++) val = val * 85 + 84;
    out.push((val >> 24) & 0xff, (val >> 16) & 0xff, (val >> 8) & 0xff, val & 0xff);
    for (let p = 0; p < pad; p++) out.pop();
  }
  return Buffer.from(out);
}

function extractPDFText(filepath) {
  const raw = fs.readFileSync(filepath, 'binary');
  const re = /\/Filter\s*\[\s*\/ASCII85Decode\s*\/FlateDecode\s*\][\s\S]*?stream\r?\n([\s\S]*?)endstream/g;
  let match;
  const pages = [];
  while ((match = re.exec(raw)) !== null) {
    try {
      const bin = decodeASCII85(match[1]);
      const dec = zlib.inflateSync(bin).toString('latin1');
      const texts = [];
      const tjRe = /\(([^)]*)\)\s*Tj/g;
      let m;
      while ((m = tjRe.exec(dec)) !== null) texts.push(m[1]);
      if (texts.length) pages.push(texts.join(' '));
    } catch {}
  }
  return pages.join('\n');
}

// Fix PDF escape sequences to readable text
function fix(s) {
  return s
    .replace(/\\362/g, 'ò').replace(/\\351/g, 'é').replace(/\\350/g, 'è')
    .replace(/\\352/g, 'ê').replace(/\\353/g, 'ë').replace(/\\355/g, 'í')
    .replace(/\\364/g, 'ô').replace(/\\341/g, 'á').replace(/\\340/g, 'à')
    .replace(/\\226/g, '-').replace(/\\227/g, '-').replace(/\\261/g, '±')
    .replace(/\\305/g, 'Å').replace(/H (?=Louis Vuitton|Chanel|Hermès)/g, '')
    .replace(/ H$/, '').trim();
}

const CONCS = ['Cologne Absolue', 'Cologne Intense', 'Extrait', 'Parfum', 'Cologne', 'Elixir', 'EDP', 'EDT', 'EDC'];

// Fragrance names with numbers that confuse the row-number regex.
// "1 Million" is special: it starts with a digit, so the row content won't begin with
// an uppercase letter unless we replace the whole token. All others just need the space
// collapsed so "NN Letter" doesn't match the \b\d\s+[A-Z] pattern.
const NORMALIZE_MAP = [
  ['1 Million',      'OneMillion'],   // starts with digit → word replacement
  ['Toy 2',         'Toy2'],
  ['40 Knots',      '40Knots'],
  ['Interlude 53',  'Interlude53'],
  ['Santal 33',     'Santal33'],
  ['Rose 31',       'Rose31'],
  ['The Noir 29',   'TheNoir29'],
  ['Th\\351 Noir 29', 'TheNoir29'],
  ['Another 13',    'Another13'],
  ['Bergamote 22',  'Bergamote22'],
  ['Citron 28',     'Citron28'],
  ['Ylang 49',      'Ylang49'],
];
const DENORMALIZE_MAP = [
  ['OneMillion',  '1 Million'],
  ['Toy2',        'Toy 2'],
  ['40Knots',     '40 Knots'],
  ['Interlude53', 'Interlude 53'],
  ['Santal33',    'Santal 33'],
  ['Rose31',      'Rose 31'],
  ['TheNoir29',   'The Noir 29'],
  ['Another13',   'Another 13'],
  ['Bergamote22', 'Bergamote 22'],
  ['Citron28',    'Citron 28'],
  ['Ylang49',     'Ylang 49'],
];

function normalizeText(text) {
  for (const [from, to] of NORMALIZE_MAP) text = text.split(from).join(to);
  return text;
}
function denormalizeName(s) {
  for (const [from, to] of DENORMALIZE_MAP) s = s.split(from).join(to);
  return s;
}
const ACCORDS_SET = new Set(['Citrus','Floral','Woody','Vanilla','Amber','Spicy','Fresh','Aromatic','Fruity','Aquatic','Green']);

// Known brands sorted longest-first for greedy matching
const BRANDS = [
  'Yves Saint Laurent','Giorgio Armani','Dolce & Gabbana','Hugo Boss','Ralph Lauren',
  'Calvin Klein','Tommy Hilfiger','Viktor & Rolf','Paco Rabanne','Carolina Herrera',
  'Jean Paul Gaultier','Maison Margiela','Parfums de Marly','Le Labo','Tom Ford',
  'Frederic Malle','By Kilian','Maison Francis Kurkdjian','Histoires de Parfums',
  'Roja Parfums','Jo Malone','Emporio Armani','Louis Vuitton','Issey Miyake',
  'Kenneth Cole','Britney Spears','Juicy Couture','Taylor Swift','Ariana Grande',
  'Jessica Simpson','Paris Hilton','Elizabeth Arden',"Victoria's Secret",
  'Narciso Rodriguez','Thierry Mugler','Salvatore Ferragamo','Estee Lauder',
  'Este Lauder','Atelier Cologne',"Penhaligon's",'Etat Libre d Orange',
  'Marc Jacobs','Serge Lutens','Creed','Byredo','Diptyque','Nishane',
  'Xerjoff','Initio','Nasomatto','Mancera','Amouage','Montblanc','Davidoff',
  'Azzaro','Nautica','Adidas','Lacoste','Dunhill','Clinique','Kenzo',
  'Joop!','Joop','Guess','Chanel','Dior','Givenchy','Gucci','Prada','Versace',
  'Valentino','Burberry','Lancôme','Lancome','Guerlain','Hermès','Hermes',
].sort((a, b) => b.length - a.length);

function findBrand(text) {
  const t = text.trim();
  for (const brand of BRANDS) {
    const bl = brand.toLowerCase();
    const tl = t.toLowerCase();
    if (tl.endsWith(bl) && (tl.length === bl.length || tl[tl.length - bl.length - 1] === ' ')) {
      return { brand: t.slice(t.length - brand.length), name: t.slice(0, t.length - brand.length).trim() };
    }
  }
  // fallback: last word
  const parts = t.split(/\s+/);
  return { brand: parts[parts.length - 1], name: parts.slice(0, -1).join(' ') };
}

function parseRow(raw) {
  let text = fix(raw.trim());
  // Remove leading row number
  text = text.replace(/^\d{1,2}\s+/, '').trim();

  // Split on the bullet separator \267 to get accords (allow 2 if PDF stream is truncated)
  const parts = text.split(' \\267 ');
  if (parts.length < 2) return null;

  const accord3 = parts.length >= 3 ? parts[parts.length - 1].trim() : null;
  const accord2 = parts.length >= 3 ? parts[parts.length - 2].trim() : parts[parts.length - 1].trim();
  let beforePart = parts.length >= 3
    ? parts.slice(0, -2).join(' \\267 ').trim()
    : parts.slice(0, -1).join(' \\267 ').trim();

  // The last word of beforePart is accord1 (find it from end)
  const words = beforePart.split(/\s+/);
  let accord1 = null;
  let acc1Idx = -1;
  for (let i = words.length - 1; i >= 0; i--) {
    if (ACCORDS_SET.has(words[i])) { accord1 = words[i]; acc1Idx = i; break; }
  }
  if (!accord1) return null;

  const nameAndBrandAndConc = words.slice(0, acc1Idx).join(' ').trim();

  // Extract concentration from end
  let conc = null;
  let nameAndBrand = nameAndBrandAndConc;
  for (const c of CONCS) {
    if (nameAndBrandAndConc.endsWith(' ' + c) || nameAndBrandAndConc === c) {
      conc = c;
      nameAndBrand = nameAndBrandAndConc.slice(0, nameAndBrandAndConc.length - c.length).trim();
      break;
    }
  }
  if (!conc) {
    // If no conc found, try accord1 as conc-adjacent word
    return null;
  }

  // Split brand from end
  const { brand, name: rawName } = findBrand(nameAndBrand);

  // Strip trailing concentration from the name portion (it may appear twice from PDF column merge)
  let name = rawName;
  for (const c of CONCS) {
    if (name.endsWith(' ' + c)) { name = name.slice(0, -(c.length + 1)).trim(); break; }
    if (name === c) { name = brand; break; }
  }
  if (!name.trim()) name = rawName.trim();

  const accords = [accord1, accord2, accord3].filter(a => a && ACCORDS_SET.has(a));

  return {
    name: fix(name),
    brand: fix(brand),
    concentration: conc,
    accords,
  };
}

function slugify(s) {
  return s.toLowerCase()
    .replace(/[éèêëòôáà]/g, c => ({é:'e',è:'e',ê:'e',ë:'e',ò:'o',ô:'o',á:'a',à:'a'}[c]||''))
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Extract numbered rows from a block of text
// Returns array of { num, text }
function extractRows(text) {
  // Remove the table header lines
  const cleaned = text.replace(/# Fragrance Brand Conc\. Top 3 Accords/g, ' ');
  // Find all row starts: a number 1-17 followed by an uppercase letter
  const rowRe = /\b(\d{1,2})\s+([A-ZÀ-ɏ][^]*?)(?=\s+\d{1,2}\s+[A-ZÀ-ɏ]|\s*$)/g;
  const rows = [];
  let m;
  while ((m = rowRe.exec(cleaned)) !== null) {
    rows.push({ num: parseInt(m[1]), text: m[1] + ' ' + m[2].trim() });
  }
  return rows;
}

// Group rows into tiers: budget (17), quality (17), niche (16)
// We detect tier breaks when the row number goes back to 1
function groupIntoTiers(rows) {
  const tiers = [];
  let current = [];
  for (const row of rows) {
    if (row.num === 1 && current.length > 0) {
      tiers.push(current);
      current = [];
    }
    current.push(row);
  }
  if (current.length > 0) tiers.push(current);
  return tiers;
}

const GENDER_FILES = [
  { file: 'fragrances/male 250.pdf', gender: 'male', prefix: 'Male' },
  { file: 'fragrances/Female 250.pdf', gender: 'female', prefix: 'Female' },
  { file: 'fragrances/unisex 250.pdf', gender: 'unisex', prefix: 'Unisex' },
];

const VIBE_KEYS = {
  'Daily': 'daily',
  'Date Night': 'date_night',
  'Sport': 'sport',
  'Chill': 'chill',
  'Formal': 'formal',
};

const TIER_NAMES = ['budget', 'quality', 'niche'];

for (const { file, gender, prefix } of GENDER_FILES) {
  console.log(`\nProcessing ${file}...`);
  const fullText = extractPDFText(file);

  // Split text into vibe sections by detecting "Male Daily", "Female Sport" etc.
  const vibePattern = new RegExp(
    `${prefix}\\s+(Daily|Date Night|Sport|Chill|Formal)([\\s\\S]*?)(?=${prefix}\\s+(?:Daily|Date Night|Sport|Chill|Formal)|$)`,
    'g'
  );

  let vibeMatch;
  const vibeCount = { found: 0 };
  while ((vibeMatch = vibePattern.exec(fullText)) !== null) {
    const vibeName = vibeMatch[1].trim();
    const vibeKey = VIBE_KEYS[vibeName];
    const vibeContent = vibeMatch[2];
    vibeCount.found++;

    console.log(`  Vibe: ${vibeName} (${vibeContent.length} chars)`);

    // Extract all numbered rows from this vibe section
    const allRows = extractRows(normalizeText(vibeContent));
    console.log(`    Total rows extracted: ${allRows.length}`);

    // Group by tier resets
    const tierGroups = groupIntoTiers(allRows);
    console.log(`    Tier groups: ${tierGroups.map(g => g.length).join(', ')}`);

    const allFragrances = [];
    for (let ti = 0; ti < tierGroups.length && ti < 3; ti++) {
      const tier = TIER_NAMES[ti];
      const tierRows = tierGroups[ti];
      for (const row of tierRows) {
        const parsed = parseRow(row.text);
        if (!parsed || !parsed.name) {
          console.log(`    SKIP: ${row.text.substring(0, 80)}`);
          continue;
        }
        parsed.name = denormalizeName(parsed.name);
        parsed.brand = denormalizeName(parsed.brand);
        const id = slugify(`${gender}-${vibeKey}-${tier}-${parsed.brand}-${parsed.name}`);
        allFragrances.push({
          id,
          name: parsed.name,
          brand: parsed.brand,
          concentration: parsed.concentration,
          tier,
          accords: parsed.accords,
          top_notes: parsed.accords.slice(),
          description: '',
          sephora_url: null,
          jomashop_url: null,
        });
      }
      console.log(`    ${tier}: ${tierRows.length} rows → ${allFragrances.filter(f => f.tier === tier).length} parsed`);
    }

    const outFile = path.join('fragrances', `${gender}_${vibeKey}_final.json`);
    fs.writeFileSync(outFile, JSON.stringify(allFragrances, null, 2));
    console.log(`  → ${outFile} (${allFragrances.length} total)\n`);
  }

  if (!vibeCount.found) {
    console.log('  WARNING: No vibe sections found! Checking text...');
    console.log('  Text starts with:', JSON.stringify(fullText.substring(0, 200)));
  }
}
console.log('\nDone!');
