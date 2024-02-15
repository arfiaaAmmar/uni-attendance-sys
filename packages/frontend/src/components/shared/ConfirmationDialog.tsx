import { HandleDeleteType } from "shared-library";

interface ConfirmationDialogProps {
    type: HandleDeleteType
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function ConfirmationDialog({ type, isOpen, onClose, onConfirm }: ConfirmationDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="confirmation-dialog">
            <div className="overlay" onClick={onClose}></div>
            <div className="dialog">
                <p>Are you sure you want to delete this {type}?</p>
                <div>
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={onConfirm}>Confirm</button>
                </div>
            </div>
        </div>
    );
};