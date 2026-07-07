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