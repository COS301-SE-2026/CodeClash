import {
    Component,
    MatchComponentTypes,
    PlayerComponentTypes,
    SubmissionComponent,
    RoundComponent,
} from "./components";

function addComponent(
    map: Map<number, Map<string, Component>>,
    entity_id: number,
    component_name: string,
    component: Component
) {

    let entity = map.get(entity_id);

    if (entity === undefined) {
        entity = new Map<string, Component>();
        map.set(entity_id, entity);
    }

    entity.set(component_name, component);
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

    let ID = 0;

    function createEntity() {
        return ID++;
    }


    // ADDERS

    function addPlayerComponent(
        entity_id: number,
        component_name: "Life" | "Info" | "Rank" | "Badge",
        component: PlayerComponentTypes
    ) {
        return addComponent(players, entity_id, component_name, component);
    }

    function addMatchComponent(
        entity_id: number,
        component_name: "Players" | "Match" | "Submission"| "Result",
        component: MatchComponentTypes
    ) {

        return addComponent(matches, entity_id, component_name, component)
    }


    function addRoundComponent(
        entity_id: number,
        component_name: "Round",
        component: RoundComponent
    ) {
        return addComponent(rounds, entity_id, component_name, component)
    }

    function addSubmissionComponent(
        entity_id: number,
        component_name: "Submission",
        component: SubmissionComponent
    ) {
        return addComponent(submissions, entity_id, component_name, component)
    }




    // GETTERS

    function getPlayerComponent<T extends PlayerComponentTypes>(entity_id: number, component_name: "Life" | "Info" | "Rank" | "Badge") {
        return getComponent<T>(players, entity_id, component_name);
    }

    function getMatchComponent<T extends MatchComponentTypes>(entity_id: number, component_name: "Players" | "Match" | "Submission"|"Result") {
        return getComponent<T>(matches, entity_id, component_name);
    }

    // NEED TO ADD  TEMPLATE TYPES
    function getRoundComponent<T extends RoundComponent>(entity_id: number, component_name: "Round") {
        return getComponent<T>(rounds, entity_id, component_name);
    }

    function getSubmissionComponent<T extends SubmissionComponent>(entity_id: number, component_name: "Submission") {
        return getComponent<T>(submissions, entity_id, component_name);
    }



    return {
        createEntity,
        addPlayerComponent,
        addMatchComponent,
        addRoundComponent,
        addSubmissionComponent,
        getPlayerComponent,
        getMatchComponent,
        getRoundComponent,
        getSubmissionComponent
    }
}