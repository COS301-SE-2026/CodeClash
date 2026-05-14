
class UserDto{
    id: number;
    elo: number;
    joined_at: number;


    constructor(id: number, elo: number) {
    this.id = id
    this.elo = elo
    this.joined_at = Date.now();
}
}