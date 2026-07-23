import ConfirmationPopup from "./Confirmation";
import { ConfirmationViewModelFunction } from "../ViewModels/ConfirmationViewModel";

export default function Question() {
    const confirmation = ConfirmationViewModelFunction({
        onConfirm: () => {
            console.log("Answer Submitted!")
        },
        onCancel: () => {
            console.log("Cancelled");
        },
    });

    return (
        <>
            <button onClick={confirmation.showConfirm}>
                Submit
            </button>
            <ConfirmationPopup confirmation={confirmation}/>
        </>
    );
}