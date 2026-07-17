import {renderHook, act} from "@testing-library/react";
import {describe, expect, it, vi} from "vitest";
import { ConfirmationViewModelFunction } from "../ConfirmationViewModel";

describe("ConfirmationViewModel", () => {
    it("shows the popup when showConfirm is called", () => {
        const {result} = renderHook(() => 
            ConfirmationViewModelFunction({ 
                onConfirm: vi.fn(),
            })
        );
        act(() => {
            result.current.showConfirm();
        });

        expect(result.current.isVisible).toBe(true);
    });
})