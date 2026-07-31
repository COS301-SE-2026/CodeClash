import { useState, useCallback} from "react";

import { mockedMatch } from "../Models/MatchHistoryModel";
import type { MatchRow } from "../Models/MatchHistoryModel";

interface MatchHistoryViewModel {
    matches: MatchRow[];
    selected: MatchRow | null;
    isDetails: boolean;
    handleRowClick: (match: MatchRow) => void;
    handleCloseDetails: () => void;
}

export function MatchHistoryViewModelFunction(): MatchHistoryViewModel {
    const [selected, setSelected] = useState<MatchRow | null>(null);
    const [isDetails, setIsDetails] = useState(false);
    const matches = mockedMatch; //MOCKED TO TEST

    const handleRowClick = useCallback((match: MatchRow) => {
        setSelected(match);
        setIsDetails(true);
    }, []);

    const handleCloseDetails = useCallback(() => {
        setIsDetails(false);
        setTimeout(() => setSelected(null), 100);
    }, []);

    return {
        matches,
        selected,
        isDetails,
        handleRowClick,
        handleCloseDetails,
    };
}