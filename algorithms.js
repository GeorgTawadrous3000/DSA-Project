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
    for(let id in user1){
        if(id===user2)
            return true;
    }
    return false;
}
const mutfol= (users)=>{
    let userwthmaxfllwrs=null;
    let max=0;
    for(let user1 in users){
        let no_ofusrflwrs=0;
        for(let user2 in users){
            if(follows(user1,user2)){
                no_ofusrflwrs++;
            }
        }
        if(no_ofusrflwrs>max){
            max=no_ofusrflwrs;
            userwthmaxfllwrs=user1;
        }
    }
    return userwthmaxfllwrs;
}
const suggestedusrs=(user1,users)=>{
    suggestions=[];
        for(let user2 in users){
            for(let user3 in users){
                if(follows(user1,user2) && follows(user2,user3)){
                    suggestions.push(user3);
                }
            }
        }
        return suggestions;
}
const searchword=(word,posts)=>{
    results=[];
    for(let post in posts){
        if(word in post){
            results.push(post);
        }
    }
    return results;
}
const searchtopic=(topic,posts)=>{
    results=[];
    for(let post in posts){
        if(topic in post){
            results.push(post);
        }
    }
    return results;
} 