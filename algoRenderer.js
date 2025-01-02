const ipcRenderer = window.require("electron").ipcRenderer;
import {
  getAllPosts,
  getmostinfluential,
  mutfol,
  suggestedusrs,
  searchword,
  searchtopic,
  most_active
} from "./algorithms.js";

document.addEventListener("DOMContentLoaded", () => {
  //   console.log("DOMContentLoaded");
  ipcRenderer.on("algorithms", (event, xmlObject, graph, type) => {
    let res = null;
    document.querySelector('title').innerHTML = type.split("-").join(" ");
    // console.log("receiving algorithm data:", xmlObject, graph, type);

    switch (type) {
      case "Most-influential":
        res = getmostinfluential(graph);
        console.log(res);
        document.getElementById("result").textContent = res;
        break;
      case "Most-active":
        console.log(graph);
        res = most_active(xmlObject.users[0].user);
        document.getElementById("result").textContent = res;
        console.log(res)
        break;
      default:
        let p = document.getElementById("input");
        p.style.display = "block";
        p.removeAttribute("hidden");
        let btn = document.getElementById("btn");
        btn.style.display = "block";
        btn.removeAttribute("hidden");
        btn.addEventListener("click", () => {
          const input = document.getElementById("input").value;
          if (input === "") {
            console.log("No input");
            return;
          }
          let posts = null;
          let res = null;
          switch (type) {
            case "Mutual-friends":
              let ids_list = input.split(",");
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
                if (u.id == input) {
                  user1 = u;
                }
              });
        
              res = suggestedusrs(user1, xmlObject.users[0].user);
              break;
            case "Search-word":
              posts = getAllPosts(xmlObject.users[0].user);
              res = JSON.stringify(searchword(input, posts), null, 4);
              break;
            case "Search-topic":
              posts = getAllPosts(xmlObject.users[0].user);
              res = JSON.stringify(searchtopic(input, posts), null, 4);
              break;
          }
          if (res != null) {
            document.getElementById("result").textContent = res;
          }
        });
        break;
    }
  });
});