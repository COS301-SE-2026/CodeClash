import { useSocket } from "src/context/Socket/hooks/useSocket";

export function useSearch() {
    const { matched } = useSocket();

    return { matched };
}