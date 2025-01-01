const getmostinfluential= (graph)=>{
    let res=null;
    let max=0;
    for (let id in graph) {
        let folcount = graph[id].length;
        if (folcount>max) {
            max=folcount;
            res=id;
        }
    }
    return res;
}

const follows = (user1,user2)=>{
    res = false
    user1.followers.follower.some(follower => {
        if(user2.id == follower.id){
            res = true
        }
        return res
    })
    return res;
}
const mutfol= (users)=>{
    let total_followers = []
    
    users.forEach((user) => {
        let inner_followers = []
        if (Array.isArray(user.followers.follower)) {
            user.followers.follower.forEach((fol) => {
                inner_followers.push(fol.id)
            })
        }else{
            inner_followers.push(user.follower.id)
        }
        total_followers.push(inner_followers)
    })
    const intersection = total_followers.reduce((acc, currentArray) => {
        return acc.filter((ele) => currentArray.includes(ele))
    })
    return intersection;
}
const suggestedusrs=(user1,users)=>{
    console.log(users)
    function addSuggestions(followers, suggestions) {
        if (Array.isArray(followers)) {
            followers.forEach(follower => {
                if (!suggestions.has(follower.id)) {
                    suggestions.add(follower.id);
                }
            });
        } else if (followers && followers.id) {
            if (!suggestions.has(followers.id)) {
                suggestions.add(followers.id);
            }
        }
    }
    
    // Create a Map for quick user lookup
    const userMap = new Map(users.map(user => [user.id, user]));
    
    const suggestions = new Set();
    
    // Ensure user1.followers.follower is processed consistently
    const user1Followers = Array.isArray(user1.followers.follower)
        ? user1.followers.follower
        : [user1.followers.follower];
    
    user1Followers.forEach(f => {
        const matchedUser = userMap.get(f.id);
        if (matchedUser) {
            addSuggestions(matchedUser.followers.follower, suggestions);
        }
    });
    
    // Convert the Set back to an array if needed
    const suggestionArray = Array.from(suggestions);
    
    return suggestionArray
}
const getAllPosts = (users) => {
    let posts = []
    users.forEach((u) => {
        if (Array.isArray(u.posts.post)) {
            u.posts.post.forEach((p) => {
                posts.push(p)
            })
        }else{
            posts.push(u.posts.post)
        }
    })
    return posts
}
const searchword=(word,posts)=>{
    let results=[];
    posts.forEach((p) => {
        if(p.body.includes(word)){
            results.push(p)
        }
    })
    return results;
}
const searchtopic=(topic,posts)=>{
    let results=[];
    posts.forEach((p) => {
        const topics = Array.isArray(p.topics.topic)
        ? p.topics.topic
        : [p.topics.topic];
        if(topics.includes(topic)){
            results.push(p)
        }
    })
    return results;
} 

const most_active = (graph) => {
    
    graph.forEach((u) => {
        
        u['followings'] = []
        graph.forEach((u2) => {
            const u2Followers = Array.isArray(u2.followers.follower)
        ? u2.followers.follower
        : [u2.followers.follower];
            u2Followers.forEach(f => {
                if(u.id == f.id){
                    u['followings'].push(u2.id)
                }
            });
        })
    })
    
    let l_res = 0
    let u_res = null

    graph.forEach(u => {
        let folcount = u.followers.follower.length;
        let followingCount = u.followings.length;
        if(folcount+followingCount > l_res){
            l_res = folcount+followingCount
            u_res = u
        }
    });

    return u_res
}

module.exports = {getmostinfluential, follows, mutfol, suggestedusrs, searchword, searchtopic, most_active}
