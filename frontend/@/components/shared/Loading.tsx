
import type React from "react";
import { Spinner } from "../ui/spinner";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface LoadingProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
    children?: React.ReactNode;
}

const Loading = ({ isOpen, onClose, className, children }: LoadingProps) => {

    if (!isOpen) return null;
    return (
        <div className={cn('fixed inset-0 z-50  bg-black/50 flex items-center justify-center',className)}>
            <div className="primary-back-button"
            onClick={onClose}
            >
                 <X className="text-secondary" size={50} strokeWidth={3}/>
            </div>
            <Spinner className=" size-120 text-secondary"></Spinner>
        </div>
    )
}

export default Loading