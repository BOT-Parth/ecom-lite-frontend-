import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, filesList);
    } else {
      if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
        filesList.push(fullPath);
      }
    }
  }
  return filesList;
}

const targetFiles = getFiles(path.resolve(__dirname, 'src'));

function refactorFile(filePath) {
  const fullPath = path.resolve(__dirname, filePath);
  if (!fs.existsSync(fullPath)) return;
  
  const originalContent = fs.readFileSync(fullPath, 'utf8');
  let lines = originalContent.split('\n');

  lines = lines.map(line => {
    // 0. Pre-emptively fix hover/active states for modified classes
    line = line.replace(/\bhover:bg-zinc-850\b/g, 'hover:bg-brand-secondary');

    // 1. Specific classes
    line = line.replace(/\bbg-zinc-850\b/g, 'bg-white');
    line = line.replace(/\bborder-zinc-900\b/g, 'border-brand-border');
    line = line.replace(/\bdivide-zinc-900\b/g, 'divide-brand-border');
    line = line.replace(/\bborder-zinc-850\b/g, 'border-brand-border');
    line = line.replace(/\btext-zinc-600\b/g, 'text-brand-muted');
    line = line.replace(/\btext-zinc-650\b/g, 'text-brand-muted');

    // 2. Shadows (preserving opacity)
    line = line.replace(/\bshadow-purple-500\/20\b/g, 'shadow-brand-primary/20');
    line = line.replace(/\bshadow-purple-600\/10\b/g, 'shadow-brand-primary/10');

    // 3. Profiles / settings specifics
    line = line.replace(/\bbg-gradient-to-tr\s+from-purple-500\s+to-indigo-600 flex items-center justify-center font-bold text-2xl text-brand-text shadow-lg shadow-brand-primary\/20\b/g, 'bg-brand-primary flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-brand-primary/20');
    line = line.replace(/\bbg-gradient-to-tr\s+from-purple-500\s+to-indigo-600\b/g, 'bg-brand-primary');
    line = line.replace(/\bbg-purple-900\/20\b/g, 'bg-brand-primary/10');
    
    // 4. Gradients removal (StoreDashboard, PublicStore, ProductDetails)
    // Replace the specific header banner gradients with empty string (strip it)
    line = line.replace(/\s*bg-gradient-to-r\s+from-zinc-900\/[0-9]+\s+via-zinc-950\s+to-zinc-950\b/g, '');
    // Replace landing page gradients with solid bg-brand-surface
    line = line.replace(/\bbg-gradient-to-b\s+from-purple-900\/[0-9]+\s+via-zinc-950\s+to-zinc-950\b/g, 'bg-brand-surface');
    // Replace logo gradient placeholder with solid bg-brand-secondary
    line = line.replace(/\bbg-gradient-to-tr\s+from-purple-500\/30\s+to-indigo-600\/30\b/g, 'bg-brand-secondary');

    return line;
  });

  const content = lines.join('\n');
  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf8');
  }
}

targetFiles.forEach(refactorFile);
console.log('Secondary bulk refactor complete.');
