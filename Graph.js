export default function getGraph(obj) {
  const users = obj[users][user]; // return the array of users
  // adjaceny list
  const graph = {};

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const id = user.id;
    const name = user.name;
    const followers = user.followers.follower;

    graph[id] = followers.map((follower) => follower.id);
  }

  return graph;
}
