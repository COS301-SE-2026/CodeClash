//  PLAYER
export class Player {
    id: number;


    constructor(id: number) {
        this.id = id;
    }
}

//  MATCH
export interface Match {
    id: number;
}

// ROUND
export interface Round {
    id: number;
}

//  SUBMISSION
export interface Submission {
    id: number;
}

//  RESULT
export interface Result {
    id: number;
}
