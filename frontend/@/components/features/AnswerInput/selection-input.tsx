import type { InputProps } from "./answer-input"

export const SelectionInput = ({
    value,
    onChange
}: InputProps) => {

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >

        </select>
    )
}