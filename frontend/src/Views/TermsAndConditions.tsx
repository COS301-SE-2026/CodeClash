import React from "react";
import { Link } from "react-router";
import { TermsAndConditionsViewModelFunction } from "../ViewModels/TermsAndConditionsViewModel";

const TermsAndConditions: React.FC = () => {
    const {section} = TermsAndConditionsViewModelFunction();

    return (
        <div>
            
        </div>
    );
};

export default TermsAndConditions;