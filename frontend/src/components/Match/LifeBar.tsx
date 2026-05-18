import type React from "react";

interface LifeBarProps {
    life: number;
    user_name: number
}

const LifeBar: React.FC<LifeBarProps> = ({ life, user_name }) => {
    return (
        <div>
            <div className="bar">
                <progress value={life} />
            </div>
            <div className="user">

            </div>
        </div>
    )
}

export default LifeBar;