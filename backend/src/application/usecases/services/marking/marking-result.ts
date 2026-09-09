


export class MarkingResult{

  private constructor(
    public readonly correct: boolean,
    public readonly reason: string,
    ){
        
    }

    static correct(reason = "correct"): MarkingResult {
        return new MarkingResult(true, reason);
    }

    static incrorect(reason: string): MarkingResult {
        return new MarkingResult(false, reason);
    }
}
