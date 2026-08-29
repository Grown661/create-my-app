# create-my-app

Projekt-Scaffolder als CLI: erzeugt in Sekunden ein startklares Projekt-Geruest —
inklusive MIT-Lizenz, `.gitignore` und vorbereitetem GitHub-Actions-Workflow.
Komplett ohne npm-Dependencies (nur Node-Builtins).

## Problem

Jedes neue Projekt beginnt mit denselben Handgriffen: Ordner anlegen, HTML-Grundgeruest
oder Server-Boilerplate schreiben, Lizenz und `.gitignore` kopieren, CI einrichten.
`create-my-app` erledigt das in einem Befehl — konsistent und reproduzierbar.

## Features

- **3 Templates:** `vanilla` (HTML/CSS/JS ohne Build), `node-api` (HTTP-Server nur mit Builtins), `cli` (CLI-Geruest mit `bin`-Mapping)
- Jedes Template enthaelt: `README.md`, `LICENSE` (MIT), `.gitignore`, GitHub-Actions-CI (`node --check`)
- **Interaktiver Modus** (readline), wenn kein Projektname uebergeben wird
- Optionales `git init` per `--git`
- Farbige Terminal-Ausgabe, korrekte Exit-Codes
- **0 Dependencies** — laeuft ueberall, wo Node >= 18 installiert ist

## Stack

Node.js (nur Builtins: `fs`, `path`, `readline`, `child_process`)

## Installation & Nutzung

```bash
git clone <repo-url>
cd create-my-app

# Direkt nutzen:
node bin/cli.js meine-app --template vanilla

# Oder global verlinken:
npm link
create-my-app meine-api --template node-api --git

# Interaktiver Modus:
node bin/cli.js
```

Beispiel-Output:

```
create-my-app — erstelle meine-app (vanilla)

  + index.html
  + style.css
  + app.js
  + README.md
  + .gitignore
  + LICENSE
  + .github/workflows/ci.yml

Fertig! Projekt "meine-app" (vanilla) erstellt.

Naechste Schritte:
  cd meine-app
  # index.html im Browser oeffnen
```

## Templates im Detail

| Template   | Inhalt                                              | Start                    |
|------------|-----------------------------------------------------|--------------------------|
| `vanilla`  | index.html + style.css + app.js (Dark-Theme-Demo)   | Datei im Browser oeffnen |
| `node-api` | server.js mit `/api/hello`-Endpoint (node:http)     | `node server.js`         |
| `cli`      | bin/cli.js mit Arg-Parsing + package.json-bin       | `node bin/cli.js --help` |

## Screenshot

_(Screenshot folgt)_

## Lizenz

MIT
