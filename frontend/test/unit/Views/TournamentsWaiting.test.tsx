import TournamentsWaiting from "../../../src/Views/Tournaments/TournamentsWaiting"
import {describe, it, expect, vi} from "vitest";
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";

vi.mock("src/ViewModels/Tournaments/TournamentLobby", () => ({
  useTournamentLobby: () => ({
    tournament: { title: "Tournament Title", min_players: 8, start_date: new Date().toISOString(), players: [] },
    is_host: () => false,
    players: [],
    start: vi.fn()
  })
}));

vi.mock("src/ViewModels/Tournaments/TournamentViewModel", () => ({ useTournament: () => ({ starts_in: () => "00:00" }) }));

describe("WaitingRoom", () => {
    describe("tournament header", () => {
        it("renders tournament title", () => {
            render(<MemoryRouter><TournamentsWaiting/></MemoryRouter>)

            expect(screen.getByRole("heading", {level: 1, name: "Tournament Title"})).toBeInTheDocument();
        });


        it("renders the Leave")
    })
})
