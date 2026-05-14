import redis from "../../redis-client"

function matchmaking (){

    redis.set('User', 0, (err,result)=>{
        if(err){
            console.error("Error setting key: ", err);
        }
        else{
            
        }
    })
}


export default matchmaking