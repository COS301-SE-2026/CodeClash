import TournamentsWaiting from "../../../src/Views/TournamentsWaiting"
import {describe, it, expect, vi} from "vitest";
import { fireEvent, render, screen } from '@testing-library/react';
import { ReactNode } from "react";
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
