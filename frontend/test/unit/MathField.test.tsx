// import { fireEvent, render } from "@testing-library/react";
// import { describe, expect, it, vi } from "vitest";

// import MathField from "../../@/components/features/MathField";

// window.mathVirtualKeyboard = {
//   container: null,
//   show: vi.fn();
//   hide: vi.fn();
// }
//

// describe("MathField", () => {
//   it("calls onValueChange when the math field input changes", () => {
//     (globalThis as any).mathVirtualKeyboard = {
//       container: null,
//       show: vi.fn(),
//       hide: vi.fn(),
//     };

//     const onValueChange = vi.fn();
//     const { container } = render(<MathField onValueChange={onValueChange} />);
//     const mathField = container.querySelector("math-field") as HTMLElement | null;

//     expect(mathField).not.toBeNull();

//     // fireEvent.input(mathField!, {
//     //   target: { value: "x+1" },
//     // });
//     //

//     Object.defineProperty(mathField, "value", {
//       value: "x+1",
//       configurable: true,
//     });

//     fireEvent.input(mathField!);

//     expect(onValueChange).toHaveBeenCalledWith("x+1");
//   });
// });
