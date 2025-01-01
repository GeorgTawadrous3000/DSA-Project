const fs = require('fs');
const path = require('path');
const {Stack, validate, correct, beautify} = require("./ds/parsing");



//Minify
function minifyXML(xmlContent) {
    const noWhitecontent = xmlContent.replace(/^\s*[\r\n]/gm, '') //remove empty lines
    .replace(/\s{2,}/g, ' ') //replace multiple spaces with a single space
    .replace(/\n\s+/g, '\n') //remove leading spaces on each line
    .replace(/>\s+</g, '><'); //remove whitespaces between two tags
    return noWhitecontent;
}



//encoding
function encodeXMLTags(content) {
    try {
        // const content = fs.readFileSync(filePath, 'utf-8');

        noSpacecontent = minifyXML(content);

        const uniqueTags = new Map();
        let tagCounter = 1;

        const encodedContent = noSpacecontent.replace(/<\/?([a-zA-Z0-9_:.-]+)[^>]*>/g, (match, tagName) => {
            if (!uniqueTags.has(tagName)) {
                uniqueTags.set(tagName, `\$${tagCounter++}|`);
            }
            return match.replace(match, uniqueTags.get(tagName));
        });
        const tagsArray = Array.from(uniqueTags.entries());

        return {encodedContent,tagsArray};

        // const outputFilePath = path.join(path.dirname(filePath), 'encoded_output.txt');
        // fs.writeFileSync(outputFilePath, encodedContent, 'utf-8');

        // Save the uniqueTags map to a JSON file
        // const uniqueTagsFilePath = (tagsFileName.includes(".json"))? 
        //                 path.join(path.dirname(filePath), `${tagsFileName}`) :
        //                 path.join(path.dirname(filePath), `${tagsFileName}.json`);
        // const tagsArray = Array.from(uniqueTags.entries());
        // fs.writeFileSync(uniqueTagsFilePath, JSON.stringify(tagsArray, null, 2), 'utf-8');

        // console.log(`Encoded file saved to: ${outputFilePath}`);
        // console.log(`Unique tags map saved to: ${uniqueTagsFilePath}`);
    } catch (error) {
        // console.error('Error processing XML file:', error.message);
    }
}




// decode
function decodeXMLTags(content, tagsFilePath) {
    try {
        // const content = fs.readFileSync(filePath, 'utf-8');
        let isClosingTag = 0;
        let tagStack = new Stack();

        // Load the saved uniqueTags map from the JSON file
        const tagsArray = JSON.parse(fs.readFileSync(tagsFilePath, 'utf-8'));
        const uniqueTags = new Map(tagsArray);

        // Replace encoded tags back with the original tag names
        const decodedContent = content.replace(/\$(\d+)\|/g, (match, index) => {
            const tagName = [...uniqueTags.keys()][index - 1]; // Get the original tag name

            if(tagStack?.top() == tagName) {
                isClosingTag = 1;
                tagStack.pop(tagName);
            } else {
                isClosingTag = 0;
                tagStack.push(tagName);
            }

            if(!isClosingTag) {
                return `<${tagName}>`; // Replace with the original tag
            } else {
                return `</${tagName}>`; // Replace with the original tag
            }
        });
        return decodedContent;

        // const outputFilePath = path.join(path.dirname(filePath), 'decoded_output.xml');
        // fs.writeFileSync(outputFilePath, decodedContent, 'utf-8');

        // console.log(`Decoded file saved to: ${outputFilePath}`);
    } catch (error) {
        // console.error('Error processing encoded XML file:', error.message);
    }
}




module.exports = {minifyXML, encodeXMLTags, decodeXMLTags};



// Command-line interface
// const args = process.argv.slice(2);
// //if (args.length !== 2 && args.length !== 3) {
// if (args.length !== 3) {
//     console.error('Usage: node bpe_xml_cli.js <encode|decode> <path_to_xml_file> [tags_file]', args);
//     process.exit(1);
// }

// const action = args[0];
// const filePath = args[1];
// const tagsFilePath = args[2];

// if (!fs.existsSync(filePath)) {
//     console.error('Error: File does not exist');
//     process.exit(1);
// }

// if (action === 'encode') {
//     if (args.length !== 3) {
//         console.error('Error: Please provide the path to export the tags file for decoding later.');
//         process.exit(1);
//     }
//     encodeXMLTags(filePath, tagsFilePath);
// } else if (action === 'decode') {
//     if (args.length !== 3) {
//         console.error('Error: Please provide the path to the tags file for decoding.');
//         process.exit(1);
//     }
//     if (!fs.existsSync(tagsFilePath)) {
//         console.error('Error: Tags file does not exist');
//         process.exit(1);
//     }
//     decodeXMLTags(filePath, tagsFilePath);
// } else {
//     console.error('Error: Invalid action. Use "encode" or "decode".');
//     process.exit(1);
// }