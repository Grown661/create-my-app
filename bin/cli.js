#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');
const { execSync } = require('node:child_process');
const { templates, TEMPLATE_NAMES } = require('../lib/templates.js');

// ---------- ANSI colors (no deps) ----------
const isTTY = process.stdout.isTTY;
const c = (code) => (s) => (isTTY ? `\x1b[${code}m${s}\x1b[0m` : s);
const green = c('32');
const red = c('31');
const yellow = c('33');
const cyan = c('36');
const bold = c('1');
const dim = c('2');

// ---------- args ----------
function parseArgs(argv) {
  const args = { _: [], template: null, git: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--template' || a === '-t') {
      args.template = argv[++i];
    } else if (a === '--git') {
      args.git = true;
    } else if (a === '--help' || a === '-h') {
      args.help = true;
    } else if (a.startsWith('-')) {
      console.error(red(`Unbekannte Option: ${a}`));
      process.exit(1);
    } else {
      args._.push(a);
    }
  }
  return args;
}

function usage() {
  console.log(`
${bold('create-my-app')} — Projekt-Scaffolder

${bold('Nutzung:')}
  create-my-app <projektname> --template <${TEMPLATE_NAMES.join('|')}> [--git]
  create-my-app            ${dim('# interaktiver Modus')}

${bold('Optionen:')}
  -t, --template   Template: ${TEMPLATE_NAMES.join(', ')}
      --git        Nach dem Scaffolding "git init" ausfuehren
  -h, --help       Diese Hilfe
`);
}

// ---------- interactive mode ----------
function ask(rl, q) {
  return new Promise((resolve) => rl.question(q, resolve));
}

async function interactive() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  let name = '';
  while (!name) {
    name = (await ask(rl, cyan('Projektname: '))).trim();
    if (name && !isValidName(name)) {
      console.log(red('  Ungueltiger Name (erlaubt: a-z, 0-9, - und _)'));
      name = '';
    }
  }
  let template = '';
  while (!TEMPLATE_NAMES.includes(template)) {
    template = (await ask(rl, cyan(`Template (${TEMPLATE_NAMES.join('/')}): `))).trim();
  }
  const gitAns = (await ask(rl, cyan('git init ausfuehren? (j/N): '))).trim().toLowerCase();
  rl.close();
  return { name, template, git: gitAns === 'j' || gitAns === 'y' };
}

function isValidName(n) {
  return /^[a-z0-9_-]+$/i.test(n);
}

// ---------- scaffolding ----------
function scaffold(name, templateName, gitInit) {
  const target = path.resolve(process.cwd(), name);
  if (fs.existsSync(target)) {
    console.error(red(`Fehler: Ordner "${name}" existiert bereits.`));
    process.exit(1);
  }

  const files = templates[templateName](name);
  fs.mkdirSync(target, { recursive: true });

  for (const [rel, content] of Object.entries(files)) {
    const filePath = path.join(target, rel);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ${green('+')} ${rel}`);
  }

  if (gitInit) {
    try {
      execSync('git init', { cwd: target, stdio: 'ignore' });
      console.log(`  ${green('+')} git init`);
    } catch {
      console.log(`  ${yellow('!')} git init fehlgeschlagen (git installiert?)`);
    }
  }

  console.log(`
${green(bold('Fertig!'))} Projekt "${name}" (${templateName}) erstellt.

${bold('Naechste Schritte:')}
  cd ${name}${templateName === 'node-api' ? '\n  node server.js' : ''}${templateName === 'cli' ? '\n  node bin/cli.js --help' : ''}${templateName === 'vanilla' ? '\n  # index.html im Browser oeffnen' : ''}
`);
}

// ---------- main ----------
async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    return;
  }

  let name = args._[0];
  let template = args.template;
  let git = args.git;

  if (!name) {
    ({ name, template, git } = await interactive());
  }

  if (!isValidName(name)) {
    console.error(red(`Ungueltiger Projektname: "${name}" (erlaubt: a-z, 0-9, - und _)`));
    process.exit(1);
  }
  if (!template || !TEMPLATE_NAMES.includes(template)) {
    console.error(red(`Ungueltiges oder fehlendes Template. Erlaubt: ${TEMPLATE_NAMES.join(', ')}`));
    console.error(dim('Beispiel: create-my-app meine-app --template vanilla'));
    process.exit(1);
  }

  console.log(`\n${bold('create-my-app')} — erstelle ${cyan(name)} (${template})\n`);
  scaffold(name, template, git);
}

main().catch((err) => {
  console.error(red(`Fehler: ${err.message}`));
  process.exit(1);
});
