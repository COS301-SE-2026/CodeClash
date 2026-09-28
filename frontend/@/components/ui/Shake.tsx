import React, {useEffect, useRef, useState} from "react"


type ShakeProps = {
    value: number;
    children?: React.ReactNode;
    className?: string;
}