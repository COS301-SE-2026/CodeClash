import { Player, Match, Round, Submission, Result } from "./Entities"


// Map<id, entity>

const players = new Map<number, Player>();
const matches = new Map<number, Match>();
const rounds = new Map<number, Round>();
const submissons = new Map<number, Submission>();
const results = new Map<number, Result>();


export const World = () => {

}