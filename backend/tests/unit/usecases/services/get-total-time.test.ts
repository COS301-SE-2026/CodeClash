import { describe, expect, it } from 'vitest'
import { GetTotalTime } from '../../../../src/application/usecases/services/questions.service'

const q = (time_limit: string) => ({ time_limit }) as any;

describe('GetTotalTime', () => {
    it('sums full HH:MM:SS time limits into minutes', () => {
        const total = new GetTotalTime().execute({
            easy: [q('00:10:00'), q('00:01:30')],
            medium: [q('00:02:00')],
            hard: [],
        } as any);

        expect(total).toBe(13.5);
    })

    it('does not ignore the hours field', () => {
        expect(new GetTotalTime().execute({ easy: [q('01:00:00')], medium: [], hard: [] } as any)).toBe(60);
    })
})
