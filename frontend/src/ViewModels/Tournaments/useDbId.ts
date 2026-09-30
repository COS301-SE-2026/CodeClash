import { useEffect } from "react";
import { useSocket } from "src/context/Socket/hooks/useSocket";
import { create } from "zustand";


const useIdentity = create<{
    db_id: string | null,
    set_db_id: (id: string) => void
}>((set) => ({
    db_id: null,
    set_db_id: (id) => set({ db_id: id }),
}));


export const useDbId = () => {
    const { tournamentSocket } = useSocket();
    const db_id = useIdentity((s) => s.db_id);
    const set_db_id = useIdentity((s) => s.set_db_id);

    useEffect(() => {
        if (db_id || !tournamentSocket) return;

        tournamentSocket.identity().then((res) => {
            if (res.ok && res.data) set_db_id(res.data.user_id);
        });
    }, [tournamentSocket, db_id]);

    return db_id;
}