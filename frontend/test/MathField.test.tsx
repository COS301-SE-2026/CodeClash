import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import MathField from "../@/components/features/MathField";

describe("MathField", () => {
  it("calls onValueChange when the math field input changes", () => {
    const onValueChange = vi.fn();
    const { container } = render(<MathField onValueChange={onValueChange} />);
    const mathField = container.querySelector("math-field");

    expect(mathField).toBeNull();

    fireEvent.input(mathField!, {
      target: { value: "x+1" },
    });

    expect(onValueChange).toHaveBeenCalledWith("x+1");
  });
});
