import { ResultComponent } from "src/entities/components";
import { World } from "src/entities/World";



export class ResultSystem{
   private readonly getMatchComponent;

    constructor(
        private readonly world: ReturnType<typeof World>
    ){
        const {getMatchComponent} = this.world

        this.getMatchComponent = getMatchComponent
    }


    get(match_id: number){
        const result = this.getMatchComponent<ResultComponent>(match_id, 'Result');

        if(!result) throw new Error("Result not Found");

        return result
    }
}