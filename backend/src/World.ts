import { Badge_Component, Component, Life_Component, Rank_Component } from "./ECS/components";

export const World = () => {
    // Map<id, Map<component_name, Component>>

    const players = new Map<number, Map<string, Component>>();
    const matches = new Map<number, Map<string, Component>>();
    const rounds = new Map<number, Map<string, Component>>();
    const submissons = new Map<number, Map<string, Component>>();
    const results = new Map<number, Map<string, Component>>();

    let ID = 0;

    function createEntity() {
        return ID++;
    }

    function addPlayerComponent(
        entity_id: number,
        component_name: string,
        component: Life_Component | Rank_Component | Badge_Component
    ): boolean {
        const player = players.get(entity_id);

        if (player === undefined)    //entity doesn't exist
            return false;


        player.set(component_name, component);
        return true;
    }


    function addComponent(map: Map<number, Map<string, Component>>, component: Component, enitity: number): boolean {

    }

}