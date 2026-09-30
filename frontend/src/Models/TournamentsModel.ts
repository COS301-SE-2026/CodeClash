export interface TournamentModel{
    id: number,
    type: "programming" | "math",
    timeout: string, //change type, temporary
    totalPlayers: number,
    currentPlayers: number
    
}

//maybe we can let players choose the total amount of players they want for the tournament?


export interface TournamentsModel{
    tournaments: TournamentModel[]
}

export const DefaultTournamentsModel: TournamentsModel = {
    tournaments: []
}