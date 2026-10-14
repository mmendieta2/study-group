# Study Group Finder

CSC 481 team project. A web app where students post, find and join study sessions for their courses.

**Stack:** Node.js / Express, plain HTML/CSS/JavaScript, SQLite.

## Team

- Maynor Mendieta

(Add your name here in your first pull request.)

## Setup

### 1. Install the tools (once)

You need **git** and **fnm** (a Node version manager). The project uses Node 24 (see `.nvmrc`).

**macOS**

```bash
brew install fnm
echo 'eval "$(fnm env --use-on-cd --shell zsh)"' >> ~/.zshrc
```

**Windows 11** (PowerShell)

```powershell
winget install Git.Git
winget install Schniz.fnm
```

Then add fnm to your PowerShell profile (run `notepad $PROFILE` and add this line):

```powershell
fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression
```

**Linux**: install fnm from <https://github.com/Schniz/fnm>, then add the `eval` line above to your shell config (`~/.bashrc` or `~/.zshrc`, with `--shell bash` or `--shell zsh`).

Close and reopen your terminal, then install Node:

```bash
fnm install 24
fnm use 24
node -v    # should print v24.x.x
```

> Windows tip: keep the project folder outside OneDrive-synced folders (for example `C:\code`).

### 2. Get the code and install packages

```bash
git clone <repo-url>
cd study-group
npm ci
```

`npm ci` installs the exact package versions listed in `package-lock.json`.

### 3. Create your `.env` file

macOS / Linux / Git Bash:

```bash
cp .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

Open `.env` and set `SESSION_SECRET` to any long random string. Never commit `.env`.

## Rules for everyone

- Never commit `.env`, `node_modules/` or `*.db` files. They are already in `.gitignore`.
- Add a new package only through a pull request (so the lock file stays consistent).
- File names are `camelCase.js` or all lowercase. Imports must match the case exactly (Linux is case-sensitive).

## Status

Project setup is in progress. Run instructions, the API contract and the file layout will be added here as they are built.
