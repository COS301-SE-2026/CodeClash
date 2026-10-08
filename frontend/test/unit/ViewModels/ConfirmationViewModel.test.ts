import {renderHook, act} from "@testing-library/react";
import {describe, expect, it, vi} from "vitest";

import { ConfirmationViewModelFunction } from "../../../src/ViewModels/ConfirmationViewModel";

describe("ConfirmationViewModel", () => {

    it("calls onConfirm when confirmed", () => {
        const confirm = vi.fn();
        const {result} = renderHook(()=>
            ConfirmationViewModelFunction({
                onConfirm: confirm,
            })
        );
        act(() => {
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
            result.current.handleCancel();
        });

        expect(cancel).toHaveBeenCalledOnce();
    });
})