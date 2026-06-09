import fs from 'fs';
import path from 'path';

const projectRoot = 'E:\\gen 2026\\omega';
const srcDir = path.join(projectRoot, 'src');

// Function to recursively find JSX files
function findJsxFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findJsxFiles(fullPath, filesList);
    } else if (fullPath.endsWith('.jsx')) {
      filesList.push(fullPath);
    }
  }
  return filesList;
}

const jsxFiles = findJsxFiles(srcDir);

// Read index.css to find all light mode overrides
const indexCssPath = path.join(srcDir, 'index.css');
const cssContent = fs.readFileSync(indexCssPath, 'utf8');

// Parse overrides in index.css
const lightModeMatches = [...cssContent.matchAll(/\[data-theme="light"\]\s+\.([a-zA-Z0-9\-\\\/\[\]\#\%\:\.]+)/g)];
const overriddenClasses = new Set(lightModeMatches.map(m => {
  // Unescape css selector names
  return m[1].replace(/\\/g, '');
}));

console.log(`Found ${overriddenClasses.size} overridden classes in index.css.`);

// Search for potential issues in JSX files
const issues = [];
jsxFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Find all classNames
  const classNameMatches = [...content.matchAll(/className=(?:{`([^`]+)`}|"([^"]+)"|'([^']+)')/g)];
  classNameMatches.forEach(match => {
    const classStr = match[1] || match[2] || match[3] || '';
    const classes = classStr.split(/\s+/).filter(c => c.trim().length > 0);
    
    classes.forEach(c => {
      // If the class contains custom color like bg-[#...] or text-[#...] or border-[#...]
      if (c.includes('[#') || c.includes('text-white')) {
        // Check if it has a light mode override in index.css
        let cleanClass = c.replace(/[^a-zA-Z0-9\-\[\]\#\/\:]/g, ''); // strip dynamic parts
        // Remove active state modifiers like hover:, focus:, etc.
        const colonIdx = cleanClass.lastIndexOf(':');
        if (colonIdx !== -1) {
          cleanClass = cleanClass.substring(colonIdx + 1);
        }
        
        if (!overriddenClasses.has(cleanClass) && !c.includes('text-[#ff7a45]') && !c.includes('border-[#ff7a45]') && !c.includes('bg-[#ff7a45]')) {
          // If it is orange (#ff7a45) it's the primary theme accent, maybe acceptable. Otherwise it could be an issue.
          issues.push({
            file: path.relative(projectRoot, file),
            className: c
          });
        }
      }
    });
  });
});

console.log(`\nPotential light mode contrast issues (${issues.length}):`);
const uniqueIssues = new Map();
issues.forEach(issue => {
  const key = `${issue.file} -> ${issue.className}`;
  uniqueIssues.set(key, issue);
});

uniqueIssues.forEach(val => {
  console.log(`- File: ${val.file} | Class: ${val.className}`);
});
