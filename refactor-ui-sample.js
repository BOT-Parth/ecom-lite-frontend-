import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetFiles = [
  'src/components/Navbar/Navbar.jsx',
  'src/components/dashboard/ProductForm/ProductForm.jsx'
];

function refactorFile(filePath) {
  const fullPath = path.resolve(__dirname, filePath);
  if (!fs.existsSync(fullPath)) return;
  
  let lines = fs.readFileSync(fullPath, 'utf8').split('\n');

  lines = lines.map(line => {
    // 0. Pseudo-classes first (hover, focus, disabled)
    line = line.replace(/\bhover:bg-zinc-700(\/80)?\b/g, 'hover:bg-brand-secondary');
    line = line.replace(/\bhover:bg-zinc-800\b/g, 'hover:bg-brand-secondary');
    line = line.replace(/\bhover:text-zinc-200\b/g, 'hover:text-brand-text');
    line = line.replace(/\bhover:text-purple-[3-4]00\b/g, 'hover:text-brand-primary/80');
    line = line.replace(/\bhover:bg-purple-500\b/g, 'hover:bg-brand-primary/90');
    line = line.replace(/\bdisabled:bg-purple-800\b/g, 'disabled:bg-brand-primary/50');
    line = line.replace(/\bfocus:ring-purple-500(\/[0-9]+)?\b/g, 'focus:ring-brand-primary/50');
    line = line.replace(/\bfocus:border-purple-500\b/g, 'focus:border-brand-primary');
    line = line.replace(/\bhover:shadow-purple-500(\/[0-9]+)?\b/g, 'hover:shadow-brand-primary/20');

    // 1. Backgrounds
    // Page-level outer backgrounds: bg-zinc-950 -> bg-brand-surface
    line = line.replace(/\bbg-zinc-950\b/g, 'bg-brand-surface');
    // Card/panel-level backgrounds: bg-zinc-900, bg-zinc-800 -> bg-white
    line = line.replace(/\bbg-zinc-900\b/g, 'bg-white');
    line = line.replace(/\bbg-zinc-800\/[0-9]+\b/g, 'bg-brand-secondary');
    line = line.replace(/\bbg-zinc-800\b/g, 'bg-white');

    // 2. Muted text (zinc 100-500)
    line = line.replace(/\btext-zinc-100\b/g, 'text-brand-text');
    line = line.replace(/\btext-zinc-200\b/g, 'text-brand-text');
    line = line.replace(/\btext-zinc-300\b/g, 'text-brand-muted');
    line = line.replace(/\btext-zinc-400\b/g, 'text-brand-muted');
    line = line.replace(/\btext-zinc-500\b/g, 'text-brand-muted');
    line = line.replace(/\bplaceholder-zinc-500\b/g, 'placeholder-brand-muted/70');

    // 3. Preserve text-white on accent backgrounds
    // Only map text-white to text-brand-text if it's NOT on a primary/purple button or badge.
    if (!line.match(/bg-(purple-[5-9]00|brand-primary|rose-[5-9]00)/)) {
      line = line.replace(/\btext-white\b/g, 'text-brand-text');
    }

    // 4. Exhaustive Purple/Indigo mappings
    
    // Gradients (Text)
    line = line.replace(/\bbg-gradient-to-r\s+from-purple-[0-9]+\s+(via-[a-z-]+-[0-9]+\s+)?to-indigo-[0-9]+\s+bg-clip-text\s+text-transparent\b/g, 'text-brand-primary');

    // Backgrounds (Solid & Tints)
    line = line.replace(/\bbg-purple-950(\/[0-9]+)?\b/g, 'bg-brand-primary/10');
    line = line.replace(/\bbg-purple-[1-4]00(\/[0-9]+)?\b/g, 'bg-brand-primary/20');
    line = line.replace(/\bbg-[a-z]+-purple-[1-4]00(\/[0-9]+)?\b/g, 'bg-brand-primary/20');
    line = line.replace(/\bbg-purple-[5-6]00\b/g, 'bg-brand-primary');
    line = line.replace(/\bbg-indigo-500(\/[0-9]+)?\b/g, 'bg-brand-primary/10');
    
    // Text
    line = line.replace(/\btext-purple-[3-4]00\b/g, 'text-brand-primary');
    line = line.replace(/\btext-purple-[5-6]00\b/g, 'text-brand-primary');

    // Borders
    line = line.replace(/\bborder-purple-[8-9]00(\/[0-9]+)?\b/g, 'border-brand-primary/20');
    line = line.replace(/\bborder-purple-[5-6]00(\/[0-9]+)?\b/g, 'border-brand-primary');
    
    // General Borders
    line = line.replace(/\bborder-zinc-[7-8]00(\/[0-9]+)?\b/g, 'border-brand-border');

    return line;
  });

  // Re-assemble
  let content = lines.join('\n');
  
  fs.writeFileSync(fullPath, content, 'utf8');
}

targetFiles.forEach(refactorFile);
console.log('Sample refactor complete.');
