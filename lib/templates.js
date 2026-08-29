'use strict';

// Alle Templates als Funktionen: name -> { relPath: content }

const YEAR = 2026;

const mitLicense = (name) => `MIT License

Copyright (c) ${YEAR} <DEIN NAME>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

const gitignore = `node_modules/
*.log
.env
dist/
`;

const ciWorkflow = (checkCmd) => `name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - name: Syntax-Check
        run: ${checkCmd}
`;

// ---------- vanilla ----------
function vanilla(name) {
  return {
    'index.html': `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main>
    <h1>${name}</h1>
    <p>Los geht's — bearbeite <code>app.js</code>.</p>
    <button id="demo-btn">Klick mich</button>
    <p id="output"></p>
  </main>
  <script src="app.js"></script>
</body>
</html>
`,
    'style.css': `* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: system-ui, sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  min-height: 100vh;
  display: grid;
  place-items: center;
}

main { text-align: center; padding: 2rem; }
h1 { margin-bottom: 1rem; }
p { margin-bottom: 1rem; color: #94a3b8; }

button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.6rem 1.4rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}
button:hover { background: #2563eb; }
`,
    'app.js': `'use strict';

let clicks = 0;

document.getElementById('demo-btn').addEventListener('click', () => {
  clicks++;
  document.getElementById('output').textContent = \`Klicks: \${clicks}\`;
});
`,
    'README.md': `# ${name}

Vanilla-JS-Projekt, erstellt mit [create-my-app](https://github.com/).

## Start

\`index.html\` im Browser oeffnen — kein Build-Schritt noetig.
`,
    '.gitignore': gitignore,
    'LICENSE': mitLicense(name),
    '.github/workflows/ci.yml': ciWorkflow('node --check app.js'),
  };
}

// ---------- node-api ----------
function nodeApi(name) {
  return {
    'server.js': `'use strict';

const http = require('node:http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/api/hello') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello from ${name}!' }));
    return;
  }
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(\`${name} laeuft auf http://localhost:\${PORT}\`);
});
`,
    'package.json': JSON.stringify(
      {
        name,
        version: '0.1.0',
        description: 'Node-HTTP-API, erstellt mit create-my-app',
        main: 'server.js',
        scripts: { start: 'node server.js', test: 'node --check server.js' },
        license: 'MIT',
      },
      null,
      2
    ) + '\n',
    'README.md': `# ${name}

Node-API-Projekt (nur Builtins), erstellt mit create-my-app.

## Start

\`\`\`bash
node server.js
curl http://localhost:3000/api/hello
\`\`\`
`,
    '.gitignore': gitignore,
    'LICENSE': mitLicense(name),
    '.github/workflows/ci.yml': ciWorkflow('node --check server.js'),
  };
}

// ---------- cli ----------
function cliTemplate(name) {
  return {
    'bin/cli.js': `#!/usr/bin/env node
'use strict';

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('${name} — CLI-Tool\\n\\nNutzung: ${name} [optionen]');
  process.exit(0);
}

console.log('Hallo von ${name}! Argumente:', args.length ? args : '(keine)');
`,
    'package.json': JSON.stringify(
      {
        name,
        version: '0.1.0',
        description: 'CLI-Tool, erstellt mit create-my-app',
        bin: { [name]: 'bin/cli.js' },
        scripts: { test: 'node --check bin/cli.js' },
        license: 'MIT',
      },
      null,
      2
    ) + '\n',
    'README.md': `# ${name}

CLI-Projekt, erstellt mit create-my-app.

## Nutzung

\`\`\`bash
node bin/cli.js --help
\`\`\`
`,
    '.gitignore': gitignore,
    'LICENSE': mitLicense(name),
    '.github/workflows/ci.yml': ciWorkflow('node --check bin/cli.js'),
  };
}

const templates = {
  vanilla,
  'node-api': nodeApi,
  cli: cliTemplate,
};

module.exports = { templates, TEMPLATE_NAMES: Object.keys(templates) };
