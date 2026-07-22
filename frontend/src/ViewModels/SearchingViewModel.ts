import { useSocket } from "src/context/hooks/useSocket";

export function useSearch() {
    const { matched } = useSocket();

    return { matched };
}