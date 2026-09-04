import { terms } from "../Models/TermsAndConditionsModel";
import type { Terms } from "../Models/TermsAndConditionsModel";

export interface TermsAndConditionsViewModelProps {
    section: Terms[];
}

export const TermsAndConditionsViewModelFunction = (): TermsAndConditionsViewModelProps => {
    return {
        section: terms,
    }
}