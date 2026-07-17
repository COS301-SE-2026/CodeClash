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

    it("calls onConfirm when confirmed", () => {
        const confirm = vi.fn();
        const {result} = renderHook(()=>
            ConfirmationViewModelFunction({
                onConfirm: confirm,
            })
        );
        act(() => {
            result.current.showConfirm();
            result.current. handleConfirm();
        });

        expect(confirm).toHaveBeenCalledOnce();
    });

    it("calls onCancel when cancelled", ()=> {
        const cancel = vi.fn();
        const {result} = renderHook(()=>
            ConfirmationViewModelFunction({
                onConfirm: vi.fn(),
                onCancel: cancel,
            })
        );
        act(()=> {
            result.current.showConfirm();
            result.current.handleCancel();
        });

        expect(cancel).toHaveBeenCalledOnce();
    });
})