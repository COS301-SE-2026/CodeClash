import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TournamentEliminationService } from '../../../../src/application/usecases/services/tournament/elimination.service'

let marking_service: any;
let service: TournamentEliminationService;

const startTournament = (players = 4,rounds = 2) => {
    const ids = ['a', 'b', 'c', 'd'].slice(0,players);
    service.init('t1', ids.map((id) => ({ id, username: `user-${id}` })));
    const tournament = service.getTournament('t1');
    for (let r = 0; r < rounds; r++) {
        tournament.rounds.push({
            round_number: r,
            questions: [{ id: `q${r}` }]
        } as any)
    }

    return tournament;
}

const submission = (player_id: string, round_number = 0, question_id = 'q0') => ({
    player_id,
    round_number,
    question_id,
    submission: {
        answer: '1'
    }
}) as any;


beforeEach(() => {
    vi.clearAllMocks();
    marking_service = {
        execute: vi.fn(async () => {
            return {
                correct: true
            }
        })
    }

    service = new TournamentEliminationService(marking_service);
})


describe("Tests Tournament Elimination Service Submissions", () => {

    it('Marks a correct answer', async () => {
        const t = startTournament();

        const result = await service.submit('t1', submission('a'));

        expect(result).toMatchObject({
            player_id: 'a',
            correct: true,
            attempt_number: 1
        })
        expect(t.players.get('a').correct).toBe(1);
    })

    it("Updates attempt number for incorrect submisisons", async () => {
        const t = startTournament();
        marking_service.execute.mockResolvedValue({ correct: false });

        await service.submit('t1', submission('a'));
        const second_try = await service.submit('t1', submission('a'));

        expect(second_try).toMatchObject({
            correct: false,
            attempt_number: 2
        });
        expect(t.players.get('a').correct).toBe(0);
    })

    it("Doesn't remark questions already marked correctly", async () => {
        const t = startTournament();
        await service.submit('t1', submission('a'));
        const second_try = await service.submit('t1', submission('a'));

        expect(second_try).toMatchObject({
            correct: true,
            attempt_number: 1
        });
        expect(marking_service.execute).toHaveBeenCalledTimes(1);
        expect(t.players.get('a').correct).toBe(1);
    });

    it("Rejects eliminated and unknown player submissions", async () => {
        const t = startTournament();
        t.players.get('a').elimination_round = 0;

        await expect(service.submit('t1', submission('a'))).rejects.toThrow('not active');
        await expect(service.submit('t1', submission('rando'))).rejects.toThrow('not active');
    })

    it("rejects submissions not in this round", async () => {
        startTournament();
        await expect(service.submit('t1', submission('a', 0, 'q9'))).rejects.toThrow('Question not in this round');
    })
})


describe("Tests Tournament Elimination Service Round Completion", () => {
    it("rejects unknown and eliminated players", () => {
        const t = startTournament();
        t.players.get('b').elimination_round = 0;

        expect(() => service.completeRound('t1', 'b')).toThrow("Invalid player");
        expect(() => service.completeRound('t1', 'rando')).toThrow("Invalid player");
    })

    it("moves finishers to the next round and the rest are in danger", () => {
        const t = startTournament();
        service.completeRound('t1', 'a');

        expect(t.players.get('a')).toMatchObject({
            current_round: 1,
            in_danger: false,
            elimination_round: -1
        });

        for (const id of ['b', 'c', 'd']) {
            expect(t.players.get(id)).toMatchObject({
                in_danger: true,
                elimination_round: -1
            })
        }
    })

    it("Eliminates remaining players once half have finished the round", () => {
        const t = startTournament();

        service.completeRound('t1', 'a');
        service.completeRound('t1', 'b');

        expect(t.players.get('c')).toMatchObject({
            elimination_round: 0,
            in_danger: false
        })
        expect(t.players.get('d')).toMatchObject({
            elimination_round: 0,
            in_danger: false
        })

        expect(t.players.get('a').elimination_round).toBe(-1);
        expect(t.players.get('b').elimination_round).toBe(-1);
    })

    it("For 2 players the first finisher eliminate the other", ()=>{
        const t = startTournament(2);
        service.completeRound('t1', 'a');

        expect(t.players.get('b').elimination_round).toBe(0);
    })

    it("The first to finish the final round wins", ()=>{
        const t = startTournament(3,1);

        const winner = service.completeRound('t1', 'a');

        expect(winner.elimination_round).toBe(-1);
        expect(t.players.get('b').elimination_round).toBe(0);
        expect(t.players.get('c').elimination_round).toBe(0);
    })
})