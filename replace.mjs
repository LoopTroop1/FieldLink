import fs from 'fs';
import path from 'path';

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walkDir(file));
        } else { 
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json') || file.endsWith('.md')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = [...walkDir('./src'), ...walkDir('./server'), './package.json', './README.md'];
let totalReplacements = 0;

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const newContent = content
        .replace(/FieldLink/g, 'Field Pulse')
        .replace(/FIELDLINK/g, 'FIELD_PULSE')
        .replace(/fieldlink/g, 'fieldpulse');
        
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Updated ${file}`);
        totalReplacements++;
    }
});

console.log(`Total files updated: ${totalReplacements}`);
