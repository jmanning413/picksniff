const fs = require('fs');
const zlib = require('zlib');

function decodeASCII85(str) {
  str = str.replace(/\s/g, '').replace(/~>$/, '');
  const out = [];
  let i = 0;
  while (i < str.length) {
    if (str[i] === 'z') {
      out.push(0, 0, 0, 0);
      i++;
      continue;
    }
    const chars = str.slice(i, i + 5);
    i += chars.length;
    let val = 0;
    for (let j = 0; j < chars.length; j++) {
      val = val * 85 + (chars.charCodeAt(j) - 33);
    }
    const pad = 5 - chars.length;
    for (let p = 0; p < pad; p++) val = val * 85 + 84;
    out.push((val >> 24) & 0xff, (val >> 16) & 0xff, (val >> 8) & 0xff, val & 0xff);
    for (let p = 0; p < pad; p++) out.pop();
  }
  return Buffer.from(out);
}

function extractTextFromContentStream(text) {
  // Extract strings from Tj and TJ operators
  const lines = [];
  // Match (string)Tj
  const tjRe = /\(([^)]*)\)\s*Tj/g;
  let m;
  while ((m = tjRe.exec(text)) !== null) {
    lines.push(m[1].replace(/\\n/g, '\n').replace(/\\r/g, '').replace(/\\\\/g, '\\'));
  }
  // Match [(string) ...] TJ
  const tjArrayRe = /\[([^\]]+)\]\s*TJ/g;
  while ((m = tjArrayRe.exec(text)) !== null) {
    const inner = m[1];
    const strRe = /\(([^)]*)\)/g;
    let sm;
    while ((sm = strRe.exec(inner)) !== null) {
      lines.push(sm[1]);
    }
  }
  return lines.join(' ');
}

const files = [
  'c:/Users/jman8/picksniff/fragrances/male 250.pdf',
  'c:/Users/jman8/picksniff/fragrances/Female 250.pdf',
  'c:/Users/jman8/picksniff/fragrances/unisex 250.pdf',
];

for (const file of files) {
  console.log('\n========== ' + file + ' ==========');
  const raw = fs.readFileSync(file, 'binary');

  // Find all ASCII85+Flate encoded streams
  const streamRe = /\/Filter\s*\[\s*\/ASCII85Decode\s*\/FlateDecode\s*\][\s\S]*?stream\r?\n([\s\S]*?)endstream/g;
  let match;
  let pageNum = 0;
  let allPageText = '';

  while ((match = streamRe.exec(raw)) !== null) {
    const a85data = match[1];
    try {
      const binary = decodeASCII85(a85data);
      const decompressed = zlib.inflateSync(binary);
      const contentText = decompressed.toString('latin1');
      const extracted = extractTextFromContentStream(contentText);
      if (extracted.trim().length > 10) {
        allPageText += extracted + '\n';
        pageNum++;
      }
    } catch(e) {
      // skip non-decompressible streams
    }
  }

  // Print first 8000 chars
  console.log(allPageText.substring(0, 8000));
}
