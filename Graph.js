export function getGraph(obj) {
  const users = obj.users[0].user; // Access the array of users correctly
  const graph = {};

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const id = user.id;
    const followers = user.followers.follower;

    // Handle cases where there's only one follower or multiple followers
    const followerArray = Array.isArray(followers) ? followers : [followers];

    graph[id] = followerArray.map((follower) => follower.id);
  }

  return graph;
}

// { '1': [ '2', '3' ], '2': [ '1' ], '3': [ '1' ] }
