//country codes for sign in drop down - more can be added

import {ZA, GB, US, AU, NZ, IN, FR, DE, JP, CN, AE, NG, KE, EG} from 'country-flag-icons/react/3x2';
import type React from 'react';

export interface CountryCode {
    code: string;
    flagIcon: React.ComponentType<{className?: string}>;
}

export const CountryCodes: CountryCode[] = [
    {
        code: '+27',
        flagIcon: ZA
    },
    {
        code: '+44',
        flagIcon: GB
    },
    {
        code: '+1',
        flagIcon: US
    },
    {
        code: '+61',
        flagIcon: AU
    },
    {
        code: '+64',
        flagIcon: NZ
    },
    {
        code: '+91',
        flagIcon: IN
    },
    {
        code: '+33',
        flagIcon: FR
    },
    {
        code: '+49',
        flagIcon: DE
    },
    {
        code: '+81',
        flagIcon: JP
    },
    {
        code: '+86',
        flagIcon: CN
    },
    {
        code: '+971',
        flagIcon: AE
    },
    {
        code: '+234',
        flagIcon: NG
    },
    {
        code: '+254',
        flagIcon: KE
    },
    {
        code: '+20',
        flagIcon: EG
    }
]