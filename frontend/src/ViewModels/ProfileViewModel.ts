import { useCallback, useState } from "react";
import { ProfileData } from "../Models/ProfileModel";
import type { ProfileDetails } from "../Models/ProfileModel";

export interface ProfileViewModelProps{
    onBack? : () => void;
}

interface ProfileViewModel{
    details: ProfileDetails;
    isLoading: boolean;
    displayError: string | null;
    
    handleBack: () => void; //takes user to dashboard

}


export function ProfileViewModelFunction(userId: string){

    const [details, setDetails] = useState<ProfileDetails>(ProfileData);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProfile = useCallback(async () =>{
        setIsLoading(true);
        setError(null); 
    })

}