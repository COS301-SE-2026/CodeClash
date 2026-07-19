import { useRef } from "react"
import { MathfieldElement } from "mathlive"


export const useMathsMatch = ()=>{
     const math_ref = useRef<MathfieldElement | null>(null)


     return {math_ref}
}