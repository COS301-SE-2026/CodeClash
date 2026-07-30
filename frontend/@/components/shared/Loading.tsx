
import type React from "react";
import { Spinner } from "../ui/spinner";
import { cn } from "@/lib/utils";

interface LoadingProps {
    isOpen?: boolean;
    _onClose?: () => void;
    className?: string;
    _children?: React.ReactNode;
}

const Loading = ({ isOpen, _onClose, className, _children }: LoadingProps) => {

    if (!isOpen) return null;
    return (
        <div className={cn('fixed inset-0 z-50  bg-black/50 flex items-center justify-center',className)}>
            <Spinner className=" size-120 text-secondary"></Spinner>
        </div>
    )
}

export default Loading