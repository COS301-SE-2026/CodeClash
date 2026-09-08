//This is a wow factor - i am just calling the coming soon component so the page isnt blank when clicked from dashboard

import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

import ComingSoon from "@/components/ui/ComingSoon";

const Agent = () => {
    return (
        <div className="relative min-h-screen w-full bg-background overflow-hidden">
            <Link to="/dashboard" className="btn btn-ghost primary-back-button">
            <ArrowLeft size={18}/>Back
            </Link>
            <ComingSoon/>
        </div>
    )
}

export default Agent;