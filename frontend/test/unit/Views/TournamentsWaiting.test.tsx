import TournamentsWaiting from "../../../src/Views/Tournaments/TournamentsWaiting"
import {describe, it, expect} from "vitest";
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";


describe("WaitingRoom", () => {
    describe("tournament header", () => {
        it("renders tournament title", () => {
            render(<MemoryRouter><TournamentsWaiting/></MemoryRouter>)

            expect(screen.getByRole("heading", {level: 1, name: "Tournament Title"})).toBeInTheDocument();
        });


        it("renders the Leave")
    })
})
