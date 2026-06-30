#!/usr/bin/env node

/**
 * Normalize a Google Docs HTML export to semantic havruta-sheet markup.
 *
 * Usage: node scripts/normalize-sheet.js <input-file> <output-file>
 *
 * This script:
 * - Removes Google Docs <head> and inline styles
 * - Converts Google Docs class names to semantic classes
 * - Preserves meaningful structure (headings, paragraphs, lists)
 *
 * For best results, manually review and adjust the output.
 */

const fs = require('fs');
const path = require('path');

if (process.argv.length < 4) {
  console.error('Usage: node normalize-sheet.js <input-file> <output-file>');
  process.exit(1);
}

const inputFile = process.argv[2];
const outputFile = process.argv[3];

if (!fs.existsSync(inputFile)) {
  console.error(`Input file not found: ${inputFile}`);
  process.exit(1);
}

let html = fs.readFileSync(inputFile, 'utf8');

// Remove <head> section entirely (contains Google Docs CSS)
html = html.replace(/<head[\s\S]*?<\/head>/gi, '');

// Remove Google Docs-specific class patterns
html = html
  .replace(/\sclass="c\d+(\s+c\d+)*"/gi, '')
  .replace(/\sclass="doc-content"/gi, '')
  .replace(/\sclass="[^"]*doc-content[^"]*"/gi, '')
  .replace(/\sclass="title"/gi, '')
  .replace(/\sclass="subtitle"/gi, '');

// Remove style attributes from Google Docs
html = html.replace(/\sstyle="[^"]*"/gi, '');

// Remove empty paragraphs
html = html.replace(/<p[^>]*>\s*<\/p>/gi, '');

// Remove <html> and <body> wrappers if present
html = html.replace(/^[\s\S]*?<body[^>]*>([\s\S]*?)<\/body>[\s\S]*?$/i, '$1');
html = html.replace(/^[\s\S]*?<html[^>]*>([\s\S]*?)<\/html>[\s\S]*?$/i, '$1');

// Clean up extra whitespace
html = html.replace(/\n\s*\n\s*\n/g, '\n\n');

// Wrap in semantic structure if not already wrapped
if (!html.includes('class="havruta-sheet"')) {
  html = `<article class="havruta-sheet">

${html.trim()}

</article>
`;
}

fs.writeFileSync(outputFile, html, 'utf8');
console.log(`Normalized: ${inputFile} → ${outputFile}`);
console.log('Note: Please review and manually adjust the output for proper semantic structure.');
