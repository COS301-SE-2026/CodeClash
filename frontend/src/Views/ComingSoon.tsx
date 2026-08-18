//This will be a coming soon page to be used for our wow factors that arent implemented yet - its just so that when user clicks tournaments for example, its not blank

import { Rocket } from "lucide-react";
import React from "react";

type ComingSoonProps = {
    title?: string;
    description?: string;
    icon?: React.ComponentType<{size?: number; classname?: string}>;
};

const ComingSoon = ({
    title = "Coming Soon!",
    description = "This feature is still being built. Come back soon!",
    icon: Icon = Rocket,
}: ComingSoonProps) => {
    return (
        <div>

        </div>
    )
}

export default ComingSoon;