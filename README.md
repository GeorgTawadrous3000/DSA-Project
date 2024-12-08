# XML Parser

## Features
- GUI Text Editor with Electron
- Line Numbers
- Open/Save/Save As functionality
- CLI Mode for file operations

## Installation
1. Clone the repository
2. Run `npm install`
3. Start GUI mode: `npm start`
4. Start CLI mode: `npm run start:cli`

## CLI Usage
- Open a file: `node cli.js -o filename.txt`
- Save content: `node cli.js -s newfile.txt -c "Your content here"`

## Dependencies
- Electron
- fs-extra
- yargs