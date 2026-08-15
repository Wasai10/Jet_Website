const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    if (file === 'node_modules' || file === '.git' || file === '.claude') return;
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const images = walk('c:\\Users\\MONICAH\\JetFellowshipWebsite');
console.log('Found images:', images);
