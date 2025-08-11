import fs from 'fs';

const [examplePath, envPath] = process.argv.slice(2);

if (!examplePath || !envPath) {
  console.error('> usage: node setup-env.js <env.example> <env>');
  process.exit(1);
}

if (!fs.existsSync(examplePath)) {
  console.error(`> error: ${examplePath} not found`);
  process.exit(1);
}

const exampleLines = fs.readFileSync(examplePath, 'utf-8').split('\n');

const existingKeys = fs.existsSync(envPath)
  ? new Set(
      fs
        .readFileSync(envPath, 'utf-8')
        .split('\n')
        .filter((line) => /^[A-Z0-9_]+=/.test(line))
        .map((line) => line.split('=')[0])
    )
  : new Set();

const outputLines = [];

for (const line of exampleLines) {
  const trimmed = line.trim();

  if (trimmed === '') {
    outputLines.push('');
  } else if (trimmed.startsWith('#') && !trimmed.includes('=')) {
    outputLines.push(line);
  } else if (/^[A-Z0-9_]+=[^#]*/.test(trimmed)) {
    const [key, ...rest] = line.split('=');
    const valuePart = rest.join('=').split('#')[0].trim();
    if (!existingKeys.has(key.trim())) {
      outputLines.push(`${key.trim()}=${valuePart}`);
      existingKeys.add(key.trim());
    }
  }
}

if (outputLines.length > 0) {
  if (fs.existsSync(envPath)) {
    const currentContent = fs.readFileSync(envPath, 'utf-8');
    const toAppend = outputLines
      .filter((line) => !currentContent.includes(line))
      .join('\n');
    if (toAppend.trim() !== '') {
      fs.appendFileSync(envPath, '\n' + toAppend);
      console.log(`> ${envPath} updated with new variables`);
    } else {
      console.log(`> no new variables to add in ${envPath}`);
    }
  } else {
    fs.writeFileSync(envPath, outputLines.join('\n'));
    console.log(`> ${envPath} created from ${examplePath}`);
  }
} else {
  console.log(`> nothing to add in ${envPath}`);
}

console.log(`✔ ${envPath} file is ready.`);
