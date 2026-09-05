/*This file is a tool that any page can use to put specific things in the layout header. This is done to allow special cases 
such as Friends system to use its own search bar specific to usernames/friends rather than having double search bar (header and specific)
or than adding username/friend searches to the 'global' search bar. Its just a matter of separation of concerns.*/

import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

// eslint-disable-next-line react-refresh/omly-export-components
export type OutletContext = {
    setExtra: (node: React.ReactNode) => void;
}

export function useExtraLayout(node: React.ReactNode) {
    const {setExtra} = useOutletContext<OutletContext>();
    useEffect(() => {
        setExtra(node);
        return () => setExtra(null);
    })
}