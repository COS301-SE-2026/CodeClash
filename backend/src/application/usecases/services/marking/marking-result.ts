


export class MarkingResult{

  private constructor(
    public readonly correct: boolean,
    public readonly reason: string,
    ){
        
    }

    static right(reason = "correct"): MarkingResult {
        return new MarkingResult(true, reason);
    }

    static wrong(reason: string): MarkingResult {
        return new MarkingResult(false, reason);
    }
}
