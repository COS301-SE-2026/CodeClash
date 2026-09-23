import TournamentsWaiting from "../../../src/Views/TournamentsWaiting"
import {describe, it, expect, vi} from "vitest";
import { fireEvent, render, screen } from '@testing-library/react';
import { ReactNode } from "react";

vi.mock("@/components/ui/MatchCard", () => ({
    MatchCard: ({
        children,
        className,
    }: {
        children?: ReactNode;
        className?: string;
    }) => (
        <div data-testid="match-card" className={className}>
            {children}
        </div>
    ),
}))

describe("WaitingRoom", () => {
    it('Checks that waiting room opens', () => {
        
    })
})
