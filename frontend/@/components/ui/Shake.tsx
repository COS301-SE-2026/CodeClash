import React, {useEffect, useRef, useState} from "react"


type ShakeProps = {
    value: number;
    children?: React.ReactNode;
    className?: string;
}


const Shake = ({ value, children, className= ''}: ShakeProps) => {
    const prev = useRef(value);
    const [shaking, setShaking] = useState(false);


    useEffect(() => {
        if(value < prev.current) 
            setShaking(true);
            prev.current = value;

    }, [value]);

    return(
        <div
            className={`${className} ${shaking ? 'life-shake' : ''}`}
            onAnimationEnd={() => setShaking(false)}
        >
        {children}
        </div>
    )
}

export default Shake;