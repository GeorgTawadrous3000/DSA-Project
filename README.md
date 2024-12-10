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
- Open a file: `node cli.js -o filename.xml`
- Save content: `node cli.js -s newfile.xml -c "Your content here"`
- Validate an XML: `node cli.js -v filename.xml`
- Correct an XML: `node cli.js -r filename.xml`
- Beautify an XML: `node cli.js -b filename.xml`



## Dependencies
- Electron
- fs-extra
- yargs