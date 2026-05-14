import redis from "../../redis-client"
import UserDto from "./matchmaking.dto";

const elo_difference = 100;   // this can be changed later


// adds player to queue
async function enqueue(user: UserDto) {
    await redis.rpoplpush("Player_Queue", JSON.stringify(user));
}

function dequeue(user: UserDto): UserDto {

    // return {

    // };
}

function match(user: UserDto) {

}


//export default matchmaking