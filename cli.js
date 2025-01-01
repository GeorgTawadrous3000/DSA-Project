const fs = require('fs-extra');
const yargs = require('yargs');
const {Stack, validate, correct, beautify} = require("./ds/parsing")
const {minifyXML, encodeXMLTags, decodeXMLTags} = require("./compression.js")
// const {getGraph} = require("./Graph")
const {getmostinfluential, follows, mutfol, suggestedusrs, searchword, searchtopic, most_active} = require("./algorithms")

function main() {
  
  yargs
.scriptName("xml_editor")
.strict()
.help()
.command("verify", "Verify the xml file", 
  {
    input: {
      describe: "Input file",
      alias: "i",
      type: "string",
      demandOption: true
    },
    output: {
      describe: "Output file",
      alias: "o",
      type: "string",
      demandOption: false
    },
    format: {
      alias: "f",
      describe: "Format the XML file",
      type: "boolean",
      default: false,
    },
  },
  (argv) => {
    const {input, output, format} = argv
    try {
      const content = fs.readFileSync(input, 'utf-8');
      console.log(validate(content));
      if(format){
        const formatted = beautify(content)
        console.log(formatted)
        if(output){
          fs.writeFileSync(output, formatted)
        }
      }
    } catch (error) {
      console.error('Error reading file:', error.message);
    }
    
})
.command("format", "Format the Xml file", 
  {
    input: {
      describe: "Input file",
      alias: "i",
      type: "string",
      demandOption: true
    },
    output: {
      describe: "Output file",
      alias: "o",
      type: "string",
      demandOption: true
    },
  },
  (argv) => {
  const {input, output} = argv
  try{
    const content = fs.readFileSync(input, 'utf-8');
    const formatted = beautify(content)
    fs.writeFileSync(output, formatted)
  }catch(error){
    console.error('Error reading file:', error.message);
  }
})
.command("json", "Convert the xml file to JSON",
  {
    input: {
      describe: "Input file",
      alias: "i",
      type: "string",
      demandOption: true
    },
    output: {
      describe: "Output file",
      alias: "o",
      type: "string",
      demandOption: true
    },
  },
  (argv) => {
    const {input, output} = argv
    try{
      const content = fs.readFileSync(input, 'utf-8');
      fs.writeFileSync(output, XML2JSON(content))
    }catch(error){
      console.error('Error reading file:', error.message);
    }
  }
)
.command("mini", "Minifiy the xml file", 
  {
    input: {
      describe: "Input file",
      alias: "i",
      type: "string",
      demandOption: true
    },
    output: {
      describe: "Output file",
      alias: "o",
      type: "string",
      demandOption: true
    },
  },
  (argv) => {
    const {input, output} = argv
    try{
      const content = fs.readFileSync(input, 'utf-8');
      const minified = minifyXML(content)
      fs.writeFileSync(output, minified)
    }catch(error){
      console.error('Error reading file:', error.message);
    }
  }
)
.command("compress", "Compress the file", 
{
  input: {
    describe: "Input file",
    alias: "i",
    type: "string",
    demandOption: true
  },
  output: {
    describe: "Output file",
    alias: "o",
    type: "string",
    demandOption: true
  },
  encodingMap: {
    describe: "file to save the encoding map",
    alias: "e",
    type: "string",
    demandOption: true
  }
},
(argv) => {
  const {input, output, encodingMap} = argv
    try{
      const content = fs.readFileSync(input, 'utf-8');
      const {encodedContent, tagsArray} = encodeXMLTags(content);
      fs.writeFileSync(output, encodedContent);
      fs.writeFileSync(encodingMap, JSON.stringify(tagsArray, null, 2), 'utf-8');

      console.log(`Encoded file saved to: ${output}`);
      console.log(`Unique tags map saved to: ${encodingMap}`);
    }catch(error){
      console.error('Error reading file:', error, input, output, encodingMap);
    }
})
.command("decompress", "Decompress the file",
  {
    input: {
      describe: "Input file",
      alias: "i",
      type: "string",
      demandOption: true
    },
    output: {
      describe: "Output file",
      alias: "o",
      type: "string",
      demandOption: true
    },
    encodingMap: {
      describe: "file to save the encoding map",
      alias: "e",
      type: "string",
      demandOption: true
    }
  },
  (argv) => {
    const {input, output, encodingMap} = argv
    try{
      const content = fs.readFileSync(input, 'utf-8');
      const decodedContent = decodeXMLTags(content, encodingMap);
      fs.writeFileSync(output, decodedContent);

      console.log(`Encoded file saved to: ${output}`);
    }catch(error){
      console.error('Error reading file:', error, input, output, encodingMap);
    }
  }
)
.command("draw", "Draw the xml file",
  {
    input: {
      describe: "Input file",
      alias: "i",
      type: "string",
      demandOption: true
    },
    output: {
      describe: "Output file",
      alias: "o",
      type: "string",
      demandOption: true
    },
  },
  (argv) => {
    const {input, output} = argv
  }
)
.command("most_active", "Most Active User", {
  input: {
    describe: "Input file",
    alias: "i",
    type: "string",
    demandOption: true
  },
},
(argv) => {
  
  const {input} = argv
  try {
    const content = fs.readFileSync(input, 'utf-8');
    const xmlObject = XML2JSObject(content);
    let graph = getGraph(xmlObject)
    let res = most_active(graph);
    console.log(res)
  }catch(e){
    console.log(e)
  }
})
.command("most_influencer", "Most Influencial Influencer ", {
  input: {
    describe: "Input file",
    alias: "i",
    type: "string",
    demandOption: true
  },
},
(argv) => {
  const {input} = argv
  try {
    const content = fs.readFileSync(input, 'utf-8');
    const xmlObject = XML2JSObject(content);
  
    let graph = getGraph(xmlObject)
    let res = getmostinfluential(graph);
    console.log(res)
  }catch(e){
    console.log(e)
  }

})
.command("mutual", "Mutual Friends", {
  input: {
    describe: "Input file",
    alias: "i",
    type: "string",
    demandOption: true
  },
  ids: {
    describe: "IDs",
    alias: "ids",
    type: "string",
    demandOption: true
  },
},
(argv) => {
  const {input, ids} = argv
  const ids_list = ids.split(",")
  try {
    const content = fs.readFileSync(input, 'utf-8');
    const xmlObject = XML2JSObject(content);
    let users = []
    xmlObject.users[0].user.forEach(u => {
        if(ids_list.includes(u.id)){
          users.push(u)
        }
    });
    
    const res = mutfol(users);
    console.log(res)
  } catch (e) {
    console.log(e)
  }
})
.command("suggest", "Suggest Users", {
  input: {
    describe: "Input file",
    alias: "i",
    type: "string",
    demandOption: true
  },
  id: {
    describe: "ID",
    alias: "id",
    type: "number",
    demandOption: true
  },
},
(argv) => {
  const {input, id} = argv
  try {
    const content = fs.readFileSync(input, 'utf-8');
    const xmlObject = XML2JSObject(content);
    let user1 = null
    xmlObject.users[0].user.forEach((u) => {
      if(u.id == id){
        user1 = u
      }
    })
    
    const res = suggestedusrs(user1, xmlObject.users[0].user)
    console.log(res)
  } catch (e) {
    console.log(e)
  }
})
.command("search", "Search Word in Posts", {
  word: {
    describe: "Word",
    alias: "w",
    type: "string",
    demandOption: true
  },
  input:{
    describe: "Input file",
    alias: "i",
    type: "string",
    demandOption: true
  }
},
(argv) => {
  const {word, input} = argv
  
  try {
    const content = fs.readFileSync(input, 'utf-8');
    const xmlObject = XML2JSObject(content);
    const posts = getAllPosts(xmlObject.users[0].user)
    const results = searchword(word, posts);
    console.log(results)
  }catch(e){
    console.error('Error reading file:', error.message);
  }
})
.command("topic", "Search a Topic in Posts", {
  topic: {
    describe: "Topic",
    alias: "t",
    type: "string",
    demandOption: true
  },
  input:{
    describe: "Input file",
    alias: "i",
    type: "string",
    demandOption: true
  }
},
(argv) => {
  const {topic, input} = argv
  try {
    const content = fs.readFileSync(input, 'utf-8');
    const xmlObject = XML2JSObject(content);
    const posts = getAllPosts(xmlObject.users[0].user)
    const results = searchtopic(topic, posts);
    console.log(results)
  }catch(e){
    console.error('Error reading file:', error.message);
  }
})
.demandCommand(1, "You need to specify at least one command.")
  .parse();
  
}

main();