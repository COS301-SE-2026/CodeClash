import * as React from "react"

export function SimpleButton({
  label,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      className={`rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:bg-blue-300 ${className}`}
      {...props}
    >
      {label}
    </button>
  )
}

export default function AITest() {
  return (
    <div className="m-6">
      <h1 className="mb-4 text-2xl font-semibold">AI Test Button</h1>
      <SimpleButton label="Click me" onClick={() => alert("Button clicked")}/>
    </div>
  )
}
