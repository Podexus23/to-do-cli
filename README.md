# to-do-cli

A simple, interactive task manager for the terminal. Manage tasks locally with a JSON store in your home directory.

## Features

- Add, update, delete, and list tasks
- Filter tasks by status: `todo`, `in-progress`, `done`
- Persistent storage in `~/tasks-app/data.json`
- Safe writes via temporary file (no partial overwrites)
- TypeScript, tests (Vitest), ESLint, Prettier

## Prerequisites

- **Node.js** >= 18.0.0

## Installation

### From source

```bash
git clone https://github.com/Podexus23/to-do-cli.git
cd to-do-cli
npm install
npm run build
```

### Run locally

```bash
npm start
```

Or in development with auto-reload:

```bash
npm run dev
```

### Install globally (optional)

```bash
npm run build
npm link
# or: npm install -g .
```

Then run from anywhere:

```bash
task-cli
```

## Usage

Start the app; you'll see a prompt `>`. Type a command and press Enter.

| Command | Description |
|--------|-------------|
| `add "<description>"` | Add a new task |
| `update <id> "<new description>"` | Update a task's description |
| `delete <id>` | Delete a task |
| `delete-all` | Delete all tasks |
| `mark-in-progress <id>` | Set task status to in progress |
| `mark-todo <id>` | Set task status to todo |
| `mark-done <id>` | Set task status to done |
| `list` | List all tasks |
| `list <status>` | List tasks with status `todo`, `in-progress`, or `done` |
| `help` | Show available commands |
| `exit` | Exit the application |

### Examples

```text
> add "Buy groceries"
Task added: Buy groceries (id: 1)

> add "Read documentation"
Task added: Read documentation (id: 2)

> list
1. Buy groceries (ID: 1, status: todo)
2. Read documentation (ID: 2, status: todo)

> mark-in-progress 1
Task ID:1 - status changed

> list in-progress
1. Buy groceries (ID: 1)

> update 1 "Buy groceries and cook dinner"
Task ID:1 - updated

> delete 2
Task ID:2 - deleted

> exit
bye bye
```

Use double quotes around descriptions that contain spaces.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled app (`node dist/index.js`) |
| `npm run dev` | Run with nodemon (watch mode) |
| `npm test` | Run tests (Vitest) |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## Data storage

Tasks are stored in:

- **Path:** `~/tasks-app/data.json` (or `%USERPROFILE%\tasks-app\data.json` on Windows)
- **Format:** JSON array of tasks; the file is created automatically on first run.

## License

ISC © Podexus23

## Links

- [Repository](https://github.com/Podexus23/to-do-cli)
- [Issues](https://github.com/Podexus23/to-do-cli/issues)
- [Roadmap-task](https://roadmap.sh/projects/task-tracker)
