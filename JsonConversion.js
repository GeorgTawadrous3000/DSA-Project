import { DOMParser } from 'xmldom';


function XML2JSObject(data) {
  const xmlDoc = new DOMParser().parseFromString(data, "text/xml");
  const jsonResult = xmlToJson(xmlDoc.documentElement);
  const rootElement = xmlDoc.documentElement.nodeName;
  const result = { [rootElement]: [jsonResult] };

  return result;
}

function XML2JSON(obj) {
  return JSON.stringify(XML2JSObject(obj), null, 2);
}

function xmlToJson(xml) {
  // Create the return object
  let obj = {};

  if (xml.nodeType === 1) {
    // element
    // Handle attributes
    if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
      for (let i = 0; i < xml.attributes.length; i++) {
        const attribute = xml.attributes.item(i);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType === 3) {
    // text
    return xml.nodeValue.trim();
  }

  // Handle child nodes
  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      const item = xml.childNodes.item(i);
      const nodeName = item.nodeName;

      if (nodeName === "#text") {
        if (xml.childNodes.length === 1) {
          return item.nodeValue.trim();
        } else {
          continue;
        }
      }
      // if the node does not exist in the object already, assign it to the object
      if (typeof obj[nodeName] === "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (!Array.isArray(obj[nodeName])) {
          obj[nodeName] = [obj[nodeName]];
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
}

module.exports = { XML2JSObject, XML2JSON };

// const data = `
// <users>
//     <user>
//         <id>1</id>
//         <name>Ahmed Ali</name>
//         <posts>
//             <post>
//                 <body>
//                     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
//                 </body>
//                 <topics>
//                     <topic>
//                         economy
//                     </topic>
//                     <topic>
//                         finance
//                     </topic>
//                 </topics>
//             </post>
//             <post>
//                 <body>
//                     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
//                 </body>
//                 <topics>
//                     <topic>
//                         solar_energy
//                     </topic>
//                 </topics>
//             </post>
//         </posts>
//         <followers>
//             <follower>
//                 <id>2</id>
//             </follower>
//             <follower>
//                 <id>3</id>
//             </follower>
//         </followers>
//     </user>
//     <user>
//         <id>2</id>
//         <name>Yasser Ahmed</name>
//         <posts>
//             <post>
//                 <body>
//                     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
//                 </body>
//                 <topics>
//                     <topic>
//                         education
//                     </topic>
//                 </topics>
//             </post>
//         </posts>
//         <followers>
//             <follower>
//                 <id>1</id>
//             </follower>
//         </followers>
//     </user>
//     <user>
//         <id>3</id>
//         <name>Mohamed Sherif</name>
//         <posts>
//             <post>
//                 <body>
//                     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
//                 </body>
//                 <topics>
//                     <topic>
//                         sports
//                     </topic>
//                 </topics>
//             </post>
//         </posts>
//         <followers>
//             <follower>
//                 <id>1</id>
//             </follower>
//         </followers>
//     </user>
// </users>
// `;

// console.log(JSON.stringify(result, null, 2));
// console.log(xmlDoc.documentElement.nodeName)
