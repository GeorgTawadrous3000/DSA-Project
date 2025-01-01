import fs from 'fs-extra';
import yargs from 'yargs';
import { Stack, validate, correct, beautify } from './ds/parsing';
import { getGraph } from './Graph';
import { getmostinfluential, follows, mutfol, suggestedusrs, searchword, searchtopic, most_active } from './algorithms';

import fs from "fs";
import * as d3 from "d3";
import { createCanvas } from "canvas";


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
},
(argv) => {

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
  },
  (argv) => {
  
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
    const content = fs.readFileSync(input, 'utf-8');
    const xmlObject = XML2JSObject(content);
  
    let graph = getGraph(xmlObject)
    
    const width = 800;
    const height = 600;
    const nodeRadius = 20;
    
    function createGraphFromAdjList(adjList) {
        const nodes = [];
        const edges = [];
        const nodeSet = new Set();
    
        // Create nodes and edges from adjacency list
        Object.entries(adjList).forEach(([source, targets]) => {
            if (!nodeSet.has(source)) {
                nodes.push({ id: source });
                nodeSet.add(source);
            }
            
            targets.forEach(target => {
                if (!nodeSet.has(target)) {
                    nodes.push({ id: target });
                    nodeSet.add(target);
                }
                edges.push({ source, target });
            });
        });
    
        return { nodes, edges };
    }
    
    function drawGraph(adjList, outputPath) {
        // Create canvas
        const canvas = createCanvas(width, height);
        const context = canvas.getContext('2d');
        
        // Set white background
        context.fillStyle = 'white';
        context.fillRect(0, 0, width, height);
    
        // Create graph data
        const graph = createGraphFromAdjList(adjList);
    
        // Create force simulation
        const simulation = d3.forceSimulation(graph.nodes)
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('link', d3.forceLink(graph.edges).id(d => d.id).distance(100))
            .stop();
    
        // Run simulation synchronously
        for (let i = 0; i < 300; ++i) simulation.tick();
    
        // Draw edges
        context.strokeStyle = '#999';
        context.lineWidth = 1;
        graph.edges.forEach(edge => {
            context.beginPath();
            context.moveTo(edge.source.x, edge.source.y);
            context.lineTo(edge.target.x, edge.target.y);
            context.stroke();
        });
    
        // Draw nodes
        graph.nodes.forEach(node => {
            // Draw circle
            context.beginPath();
            context.fillStyle = '#69b3a2';
            context.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI);
            context.fill();
            context.strokeStyle = '#fff';
            context.stroke();
    
            // Draw label
            context.fillStyle = '#fff';
            context.font = '12px Arial';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(node.id, node.x, node.y);
        });
    
        // Save to file
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(outputPath, buffer);
    }
    
    
    drawGraph(graph, 'graph.png');
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
