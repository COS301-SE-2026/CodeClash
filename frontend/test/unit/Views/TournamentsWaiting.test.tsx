import TournamentsWaiting from "../../../src/Views/Tournaments/TournamentsWaiting"
import { describe, it, expect, vi } from "vitest";
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "src/context/Auth/AuthContext";
import { SocketProvider } from "src/context/Socket/SocketContext";
import { UserProvider } from "src/context/User/UserContext";
import { InventoryProvider } from "src/context/Shop/InventoryContext";

vi.mock('../../../src/ViewModels/Tournaments/TournamentLobby', () => ({
    useTournamentLobby: () => ({
        tournament: {
            tournament_id: 't1',
            title: 'Tournament Title',
            tournament_mode: 'math',
            min_players: 3,
            host: { id: 'db-1', username: "host", elo: 600 },
            players: [{ id: 'db-1', username: "host", elo: 600 }]
        },
        players: [{ id: 'db-1', username: "host", elo: 600 }],
        error: null,
        leave: vi.fn(),
        cancel: vi.fn(),
        start: vi.fn(),
        is_host: () => false,
        min_players: 3
    })
}))

describe("WaitingRoom", () => {
    describe("tournament header", () => {
        it("renders tournament title", () => {
            render(
                <MemoryRouter>
                    <AuthProvider>
                        <SocketProvider>
                            <InventoryProvider>
                                <UserProvider>

                                    <TournamentsWaiting />

                                </UserProvider>
                            </InventoryProvider>
                        </SocketProvider>
                    </AuthProvider>
                </MemoryRouter>
            )

            expect(screen.getByRole("heading", { level: 1, name: "Tournament Title" })).toBeInTheDocument();
        });


        it("renders the Leave")
    })
})
