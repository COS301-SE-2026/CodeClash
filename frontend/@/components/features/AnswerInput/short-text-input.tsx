import type { InputProps } from "./answer-input"

export const ShortTextInput = ({
    value,
    onChange
}: InputProps) => {
    return (
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    )
}