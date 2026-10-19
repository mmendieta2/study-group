# Study Group Finder

CSC 481 team project. A web app where students post, find and join study sessions for their courses.

**Stack:** Node.js / Express, plain HTML/CSS/JavaScript, SQLite.

## Team

- Victor Martinez
- Oscar Hernandez
- Angel Avila
- Anthony Farris
- Maynor Mendieta

## Setup

### 1. Install the tools (once)

You need **git** and **Node.js 24**.

**Git**

1. Go to <https://git-scm.com/downloads>.
2. Choose your operating system and follow the instructions on that page. On Windows, download the installer and keep the default options.
3. Close and reopen your terminal, then check:

```bash
git --version
```

4. Link to your Github account

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

**Node.js 24**

1. Go to <https://nodejs.org/en/download>.
2. Choose **version 24** (the `v24` LTS line) for your operating system and download the installer. Do not pick 26 or any other version, even if it is the default button. Everyone on the team must use the same version.
3. Run the installer with the default options.
4. Close and reopen your terminal, then check:

```bash
node -v    # must print v24.x.x
npm -v
```

If `node -v` prints a different version, another Node is installed on your computer and is being found first. Find out where it is with `which node` (macOS/Linux) or `where node` (Windows), uninstall the old one, or ask the team for help.

### 2. Get the code and install packages

```bash
git clone https://github.com/mmendieta2/study-group.git
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
