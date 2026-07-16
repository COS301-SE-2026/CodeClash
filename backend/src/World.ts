import {
    Badge_Component,
    Component,
    Life_Component,
    Match_Component,
    MatchComponentTypes,
    PlayerComponentTypes,
    Players_Component,
    Rank_Component,
    Submission_Component,
    Round_Component
} from "./ECS/components";

function addComponent(
    map: Map<number, Map<string, Component>>,
    entity_id: number,
    component_name: string,
    component: Component
): boolean {

    const entity = map.get(entity_id);

    if (entity === undefined) return false;

    entity.set(component_name, component);
    return true;
}

function getComponent<T extends Component>(
    map: Map<number, Map<string, Component>>,
    entity_id: number,
    component_name: string
): T | null {

    const entity = map.get(entity_id);

    if (entity === undefined) return null;

    const component = entity.get(component_name);

    if (component === undefined) return null;

    return component as T;
}

export const World = () => {
    // Map<id, Map<component_name, Component>>

    const players = new Map<number, Map<string, Component>>();
    const matches = new Map<number, Map<string, Component>>();
    const rounds = new Map<number, Map<string, Component>>();
    const submissions = new Map<number, Map<string, Component>>();
    const results = new Map<number, Map<string, Component>>();

    let ID = 0;

    function createEntity() {
        return ID++;
    }


    // ADDERS
    function addPlayerComponent(
        entity_id: number,
        component_name: string,
        component: Life_Component | Rank_Component | Badge_Component
    ): boolean {
        return addComponent(players, entity_id, component_name, component);
    }

    function addMatchComponent(
        entity_id: number,
        component_name: string,
        component: Players_Component | Match_Component
    ): boolean {
        return addComponent(matches, entity_id, component_name, component)
    }


    function addRoundComponent(
        entity_id: number,
        component_name: string,
        component: Players_Component | Match_Component
    ): boolean {
        return addComponent(rounds, entity_id, component_name, component)
    }

    function addSubmissionComponent(
        entity_id: number,
        component_name: string,
        component: Players_Component | Match_Component
    ): boolean {
        return addComponent(submissions, entity_id, component_name, component)
    }


    function addResultComponent(
        entity_id: number,
        component_name: string,
        component: Players_Component | Match_Component
    ): boolean {
        return addComponent(results, entity_id, component_name, component)
    }


    // GETTERS

    function getPlayerComponent<T extends PlayerComponentTypes>(entity_id: number, component_name: string) {
        return getComponent<T>(players, entity_id, component_name);
    }

    function getMatchComponent<T extends MatchComponentTypes>(entity_id: number, component_name: string) {
        return getComponent<T>(matches, entity_id, component_name);
    }

    // NEED TO ADD  TEMPLATE TYPES
    function getRoundComponent<T extends Round_Component>(entity_id: number, component_name: string) {
        return getComponent<T>(rounds, entity_id, component_name);
    }

    function getSubmissionsComponent<T extends Submission_Component>(entity_id: number, component_name: string) {
        return getComponent<T>(submissions, entity_id, component_name);
    }
}