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

## CLI Usage
### Note:
- `--`: means that this parameter is optional.
- If the output file is not specified then the program modifies the input file
- In verify command, if `--f` is added, the verify command also formats the xml file.

### Commands:
- Checking the XML consistency `xml_editor.exe verify -i input_file.xml --f --o output_file.xml`
- Converting XML to JSON `xml_editor.exe json -i input_file.xml -o output_file.json`
- Formatting (Prettifying) the XML `xml_editor.exe format -i input_file.xml --o output_file.xml`
- Writes the most active user name and id `xml_editor.exe most_active -i input_file.xml`
- Writes the most influencer user name and id `xml_editor.exe most_influencer -i input_file.xml`
- Writes a list of the mutual users between users with id 1, id 2 and id 3 `xml_editor.exe mutual -i input_file.xml -ids 1,2,3`
- Writes a list of posts where the given word was mentioned `xml_editor.exe search -w word -i input_file.xml` 
- Writes a list of posts where the given topic was mentioned `xml_editor.exe topic -t topic -i input_file.xml`
- Writes a list of suggested users for user with id 1 `xml_editor.exe suggest -i input_file.xml -id 1`
- Draws the input data as a graph in output_file.jpg  `xml_editor.exe draw -i input_file.xml -o output.png`
- Minifies the input_file.xml and save it in output_file.xml  `xml_editor.exe mini -i input_file.xml --o output_file.xml`
- Compress the input_file.xml and save the compressed version in output_file.comp  `xml_editor.exe compress -i input_file.xml -o output_file.xml -e EncodingMap.json`
- Decompress the input_file.comp and save the decompressed version in output_file.xml  `xml_editor.exe decompress -i input_file.xml -o output_file.xml -e EncodingMap.json`


## Dependencies
- Electron
- fs-extra
- yargs

