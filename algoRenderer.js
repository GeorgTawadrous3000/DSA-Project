const { ipcRenderer } = require("electron");
const {
  getmostinfluential,
  follows,
  mutfol,
  suggestedusrs,
  searchword,
  searchtopic,
  most_active,
} = require("./algorithms");

document.addEventListener("DOMContentLoaded", () => {
  // console.log("DOMContentLoaded"); // Debugging log
  ipcRenderer.on("algorithms", (event, xmlObject, graph, type) => {
    let res = null;

    switch (type) {
      case "Most-influential":
        res = getmostinfluential(graph);
        document.getElementById("result").textContent = res;
        break;
      case "Most-active":
        res = most_active(graph);
        document.getElementById("result").textContent = res;
        break;
      default:
        let p = document.getElementById("input");
        p.removeAttribute("hidden");
        let btn = document.getElementById("btn");
        btn.removeAttribute("hidden");
        break;
    }
  });
});

function executeCode() {
  const input = document.getElementById("input").value;
  if (input === "") {
    console.log("No input");
    return;
  }
  const posts = null;
  const results = null;
  const res = null;
  switch (type) {
    case "Mutual-friends":
      let users = [];
      xmlObject.users[0].user.forEach((u) => {
        if (ids_list.includes(u.id)) {
          users.push(u);
        }
      });

      res = mutfol(users);
      break;
    case "Suggest-users":
      let user1 = null;
      xmlObject.users[0].user.forEach((u) => {
        if (u.id == id) {
          user1 = u;
        }
      });

      res = suggestedusrs(user1, xmlObject.users[0].user);
      break;
    case "Search-word":
      posts = getAllPosts(xmlObject.users[0].user);
      results = searchword(word, posts);
      break;
    case "Search-topic":
      posts = getAllPosts(xmlObject.users[0].user);
      results = searchtopic(topic, posts);
      break;
  }
  if (res != null) {
    document.getElementById("result").textContent = res;
  } else if (results != null) {
    document.getElementById("result").textContent = results.join("\n");
  }
}
