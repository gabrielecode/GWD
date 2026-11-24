import fs from 'fs';

let content = fs.readFileSync('src/data/projects.ts', 'utf8');

const parts = content.split("  {\n    slug: '");

for (let i = 1; i < parts.length; i++) {
  const part = parts[i];
  const slugEnd = part.indexOf("'");
  const slug = part.substring(0, slugEnd);

  const extMatch = part.match(/externalUrl:\s*'([^']+)'/);
  if (!extMatch) continue;

  let extUrl = extMatch[1];
  if (slug === 'auto-social-publisher') {
    extUrl = 'https://autosocialpubblisher.lovable.app';
  } else if (slug === 'ata-school-scraper') {
    extUrl = 'https://ataschoolscraper.lovable.app';
  }

  const u = new URL(extUrl);
  const domainUrl = u.host;

  let newPart = part.replace(/externalUrl:\s*'[^']+'/, `externalUrl: '${extUrl}'`);
  newPart = newPart.replace(/domainUrl:\s*'[^']+'/, `domainUrl: '${domainUrl}'`);

  parts[i] = newPart;
}

const newContent = parts.join("  {\n    slug: '");
fs.writeFileSync('src/data/projects.ts', newContent, 'utf8');
console.log('Successfully updated projects.ts via src/update.ts!');
