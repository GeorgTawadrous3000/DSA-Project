import { DOMParser } from 'xmldom';


export function XML2JSObject(data) {
  const xmlDoc = new DOMParser().parseFromString(data, "text/xml");
  const jsonResult = xmlToJson(xmlDoc.documentElement);
  const rootElement = xmlDoc.documentElement.nodeName;
  const result = { [rootElement]: [jsonResult] };

  return result;
}

export function XML2JSON(obj) {
  return JSON.stringify(XML2JSObject(obj), null, 2);
}

export function xmlToJson(xml) {
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

