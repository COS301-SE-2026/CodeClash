

let next_id = 1;
const active_entities = new Set<number>();


export function create_entity(): number {
    const id = next_id++;
    active_entities.add(id);
    return id;
}

export function destroy_entity(id: number) {
    active_entities.delete(id);
}