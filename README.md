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
4. Start CLI mode: `node cli.js`

## CLI Usage
- Checking the XML consistency `node cli.js verify -i input_file.xml -f -o output_file.xml`
- Converting XML to JSON `node cli.js json -i input_file.xml -o output_file.json`
- Formatting (Prettifying) the XML `node cli.js format -i input_file.xml -o output_file.json`
- Writes the most active user name and id `node cli.js most_active -i input_file.xml`
- Writes the most influencer user name and id `node cli.js most_influencer -i input_file.xml`
- Writes a list of the mutual users between users with id 1, id 2 and id 3 `node cli.js mutual -i input_file.xml -ids 1,2,3`
- Writes a list of posts where the given word was mentioned `node cli.js search -w word -i input_file.xml` 
- Writes a list of posts where the given topic was mentioned `node cli.js search -t topic -i input_file.xml`
- Writes a list of suggested users for user with id 1 `node cli.js suggest -i input_file.xml -id 1`
- Draws the input data as a graph in output_file.jpg  `node cli.js draw -i input_file.xml -o output.png`
- Minifies the input_file.xml and save it in output_file.xml  `node cli.js mini -i input_file.xml -o output_file.xml`
- Compress the input_file.xml and save the compressed version in output_file.comp  `node cli.js mini -i input_file.xml -o output_file.xml -e EncodingMap.json`
- Decompress the input_file.comp and save the decompressed version in output_file.xml  `node cli.js mini -i input_file.xml -o output_file.xml -e EncodingMap.json`


## Dependencies
- Electron
- fs-extra
- yargs
