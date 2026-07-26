import { useState, useCallback } from "react";
import { mockedMatch } from "../Models/MatchHistoryModel";
import type { MatchRow } from "../Models/MatchHistoryModel";

interface MatchHistoryViewModel {
    matches: MatchRow[];
    selected: MatchRow | null;
    isDetails: boolean;
    handleRowCLick: (match: MatchRow) => void;
    handleCloseDetails: () => void;
}