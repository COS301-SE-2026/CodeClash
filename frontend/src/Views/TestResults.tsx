// TEST FILE ONLY -> NEEDS TO BE DELETED AFTER PR IS APPROVED!!

import React from "react";
import FinalResults from "./FinalResults";
import type { PlayerFinalResults } from "../Models/FinalResultsModel";
import Robot from "../assets/Robots/Pink_fighting.png";
import Avatar from "../assets/Avatar/blue_avatar.jpeg"

const mockResults: PlayerFinalResults[] = [
    {
        username: 'player1',
        avatar: Robot,
        correctness: 60,
        speed: '01:48',
        eloEffect: +100,
        position: 1,
    },
    {
        username: 'player2',
        avatar: Avatar,
        correctness: 40,
        speed: '01:56',
        eloEffect: -100,
        position: 2,
    },
];

type TestState = 'loading' | 'results' | 'error';
const TEST_STATE: TestState = 'results'; //change here to test pages

const fetchForState = (state: TestState) => async (): Promise<PlayerFinalResults[]> => {
    await new Promise( r=> setTimeout(r,3000));
    if (state === 'results') return mockResults;
    if (state === 'error') throw new Error('Not ready');
    return new Promise(() => {});
};

const TestResults: React.FC = () => {
    return (
        <FinalResults onReturn={() => console.log('Home')}
            onPlayAgain={() => console.log('Play Again')}
            fetchResults={fetchForState(TEST_STATE)}/>
    );
};

export default TestResults;