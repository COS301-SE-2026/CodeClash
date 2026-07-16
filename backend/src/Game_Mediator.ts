


export class Game_Mediator {
    match: number;
    rounds: number[] = [];
    answers = new Map<number, Map<number, number>>();   // <player_id, <question_id, submission_id>>


    constructor(match_id: number) {
        this.match = match_id;
    }


    initialise(): void {

    }

    subscribe(player_id: number) {

    };

    submit(question_id: number, answer:string){

    }

    getRounds(): readonly number[]  {
        return this.rounds;
    }
}