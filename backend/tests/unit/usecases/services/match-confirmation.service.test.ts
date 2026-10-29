import { MatchConfirmationService } from '../../../../src/application/usecases/services/match/match-confirmation.service';
import { describe, expect, it } from 'vitest'
import { HttpError } from '../../../../src/entities/errors/http-error'

const service = new MatchConfirmationService()

describe("Tests Match Confirmation Service", () => {
    const players = [
        { id: 'player 1', elo: 600 },
        { id: 'player 2', elo: 616 },
    ]

    let key: string;

    it("Creates a group id for matched players", () => {
        key = service.create(players);

        expect(key).toBeTruthy();
        expect(service.get(key)).toEqual([
            { id: 'player 1', elo: 600, accepted: false },
            { id: 'player 2', elo: 616, accepted: false },
        ])
    });

    it("Generates the same key for the same set of players", () => {
        const first_key = service.create(players);
        const second_key = service.create([...players].reverse());

        expect(first_key).toBe(second_key);
    });

    it("Updates a players acceptance", () => {
        key = service.create(players);
        service.accept(key, 'player 2');

        const pair = service.get(key);
        expect(pair).toEqual([
            { id: 'player 1', elo: 600, accepted: false },
            { id: 'player 2', elo: 616, accepted: true },
        ])
    })

    it("Throws an error for an invalid group id", () => {
        expect(() => service.accept('Not a valid key', 'player 1')).toThrow("Match offer no longer available");
    })

    it("Throws an error for an invalid player id", () => {
        expect(() => service.accept(key, 'random player')).toThrow('Match offer no longer available');
    })

    it("Checks if both players have accepted", () => {
        expect(service.bothAccepted(key)).toBe(false);
    })

    
    it("Deleted a pair if a player declines", () => {
        service.decline(key);

        expect(service.get(key)).toBeUndefined();
    })


})