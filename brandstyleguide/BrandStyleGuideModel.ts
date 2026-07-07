// This is the Model for the brand style guide - a pure data file with the BSG content

export interface ColorToken { //This will render the main color swatches including themes and dark/light modes
    name: string;
    hex: string;
    rgb: string;
    hsl: string;
    usage: string;
    wcag: string;
    on: 'dark' | 'light';
}

export interface TypographyToken { //This will show typography and scales as text samples
    name: string;
    cssVar: string;
    size: string;
    weight: string;
    sample: string;
    usage: string;
}

export interface DesignToken { //This defines the structure of the tokens, its name, value and description
    token: string;
    value: string;
    description: string;
}

export interface ComponentSpecs { //This will show variants and states of components
    name: string;
    vars: string[];
    states: string[];
    notes: string;
}

export interface ChangelogEntries { //This will show what changed from Demo 1 and why
    category: string;
    changes: string[];
    rationale: string;
}

export interface BrandStyleGuideContent {
    meta: {
        version: string;
        date: string;
        project: string;
        team: string;
    };

    colors: ColorToken[];
    typography: TypographyToken[];

    tokens: {
        color: DesignToken[];
        radius: DesignToken[];
        typography: DesignToken[];
        shadow: DesignToken[];
        breakpoints: DesignToken[];
    };

    components: ComponentSpecs[];
    chanelog: ChangelogEntries[];
    accessibilityRules: string[];

    logoRules: {
        permitted: string[];
        forbidden: string[];
    };
}

export const brandStyleGuideContent: BrandStyleGuideContent = {
    meta: {
        version: '2.0',
        date: 'July 2026',
        project: 'CodeClash',
        team: 'QuantDevs',
    },

    colors: [
    {
        name: 'Primary',
        hex: '#530A24',
        rgb: '83, 10, 36',
        hsl: '343deg, 79%, 18%',
        usage: 'Page background, primary surface, sidebar base',
        wcag: 'AAA on #FCEDD (12.4:1)',
        on: 'light',
    },

    {
        name: 'Button Primary',
        hex: '#C0395A',
        rgb: '192, 57, 90',
        hsl: '346deg, 54%, 49%',
        usage: 'Primary buttons, interactive actions',
        wcag: 'AA on #FFFFF (4.6:1)',
        on: 'light',
    },

    {
        name: 'Button Secondary',
        hex: '#FFEFE0',
        rgb: '255, 239, 224',
        hsl: '30deg, 100%, 94%',
        usage: 'Secondary buttons, soft card surfaces',
        wcag: 'AAA on #530A24 (10.2:1)',
        on: 'dark',
    },

    {
        name: 'Text Primary',
        hex: '#FCECDD',
        rgb: '252, 236, 221',
        hsl: '28deg, 86%, 93%',
        usage: 'Primary text on all dark backgrounds',
        wcag: 'AAA on #530A24 (12.4:1)',
        on: 'dark',
    },

    {
        name: 'Text Secondary',
        hex: '#530A24',
        rgb: '83, 10, 36',
        hsl: '343deg, 79%, 18%',
        usage: 'Text on light/secondary surfaces',
        wcag: 'AAA on #FFEFE0 (10.2:1)',
        on: 'light',
    },

    {
        
    }
    ]
}