export interface PlayerFinalResults {
    username: string;
    avatar: number; //this is for the users avatar/profile image
    correctness: number; //this can be a % foe example if the user gets 3 of 5 questions completely correct, this correctness % will be 60%
    speed: string; //this will be formated as mm:ss
    eloEffect: number; //the effect of the in or loss on their elo
    position: 1 | 2;
}

export interface FinalResultsContent {
    titleLoading: string;
    labelLoading: string;
    titleResults: string;
    tableHeaders: string[];
    labelPlayAgain: string;
    labelReturn: string;
    titleError: string;
    messageError: string;
}

export const finalResultsContent: FinalResultsContent = {
    titleLoading: 'Calculating Results',
    labelLoading: 'Results Loading...',
    titleResults: 'Final Results',
    tableHeaders: ['User', 'Correctness', 'Speed (minutes)', 'Effect on Elo', 'Position'],
    labelPlayAgain: 'Play Again',
    labelReturn: 'Return',
    titleError: 'Not Ready',
    messageError: 'Your results are still being calculated. Please come back later.',
}