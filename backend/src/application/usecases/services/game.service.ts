import { IQuestionRepository } from "src/application/interfaces/IQuestionRepository";
import { Life_Component, Match_Component, Players_Component, Rank_Component, Round_Component } from "src/entities/components";
import { leagueMapping } from "src/entities/league-mapping";
import { World } from "src/entities/World";

export const gameService = (
    question_repo: IQuestionRepository,
    player_ids: string[],
    game_mode: string,
    league: string
) => {

    let questions: number[] = [];

    // Creat entities Components - use world 
    const { createEntity, addMatchComponent } = World();

    /** PLAYER ENTITY */
    const player_entity = createEntity();
    createPlayer(player_entity, 100, 1, 600, "Placeholder");
    createPlayer(player_entity, 100, 1, 600, "Placeholder");

    /** MATCH ENTITY */
    const match_entity = createEntity();

    // need api calls here
    const players: Players_Component = {
        player_ids: player_ids,
    }

    // this data also needs to be fetched from the db 
    // how are match titles generated
    const match_component: Match_Component = {
        title: 'To Be Determined',
        status: 'active',
        game_mode: game_mode,
        difficulty: 1,  // also to be determined
        winner: -1  // will become winning players id once the game is over
    }

    addMatchComponent(match_entity, "Players", players);
    addMatchComponent(match_entity, "Match", match_component);


    /** Question Entity */
    // fetch questions form the db 



    // how do we determine the number of rounds in a game ??
    /**ROUND ENTITY */
    const round_entity = createEntity();
    createRound(round_entity, match_entity, questions, 5); // set to 5 minutes just for now
}

const questionRatio = (question_repo: IQuestionRepository, league: string, avg_elo: number, question_number: number, game_mode: "Maths" | "Prog") => {
    const mapping = leagueMapping(league, avg_elo);

    if (!mapping) throw new Error("League not found")

    const easy_count = question_number * mapping.easy.percentage!;
    const medium_count = question_number * mapping.medium.percentage!;
    const hard_count = question_number * mapping.hard.percentage!;


    const easy_questions = question_repo.getRandQuestions(easy_count, mapping.easy.difficulty, game_mode);
    const medium_questions = question_repo.getRandQuestions(medium_count, mapping.medium.difficulty, game_mode);
    const hard_questions = question_repo.getRandQuestions(hard_count, mapping.hard.difficulty, game_mode);

    return {
        easy_questions,
        medium_questions,
        hard_questions
    }

}

const createPlayer = (player_entity: number, player_life: number, player_rank: number, elo: number, league: string) => {
    const { addPlayerComponent } = World();

    const life: Life_Component = {
        current_life: player_life,
        max_life: 100,
    }

    const rank: Rank_Component = {
        rank: player_rank,    //needs to be fetched
        elo: elo,   //needs to be fetched
        league: league
    }


    addPlayerComponent(player_entity, "Life", life);
    addPlayerComponent(player_entity, 'Rank', rank);
}

const createRound = (round_entity: number, match_id: number, question_ids: number[], duration: number) => {
    const { addRoundComponent } = World();

    const start_time = new Date();

    const round: Round_Component = {
        match_id: match_id,
        question_ids: question_ids,
        start_time: start_time,
        end_time: new Date(start_time.getTime() + (duration * 60000)),
        question_number: question_ids.length
    }

    addRoundComponent(round_entity, "Round", round);
}