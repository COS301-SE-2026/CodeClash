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
    weight: number;
    sample: string;
    usage: string;
}

export interface DesignToken { //This defines the structure of the tokens, its name, value and description
    token: string;
    value: string;
    description: string;
}

export interface ComponentSpecs { //This will show variants and classes of components
    name: string;
    vars: string[];
    classes: string[];
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
    pinkColors: Record<string,string>;
    typography: TypographyToken[];

    tokens: {
        color: DesignToken[];
        radius: DesignToken[];
        typography: DesignToken[];
        shadow: DesignToken[];
        //breakpoints: DesignToken[]; <- are we catering for other sized devices - desktop, tablet?
    };

    components: ComponentSpecs[];
    changelog: ChangelogEntries[];
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
        name: 'Secondary',
        hex: '#FFEFE0',
        rgb: '255, 239, 224',
        hsl: '30deg, 100%, 94%',
        usage: 'Soft card surfaces, light backgrounds',
        wcag: 'AAA on #530A24 (10.2:1)',
        on: 'dark',
    },

    {
        name: 'Button Primary',
        hex: '#C0395A',
        rgb: '192, 57, 90',
        hsl: '346deg, 54%, 49%',
        usage: 'Primary buttons',
        wcag: 'AA on #FFFFF (4.6:1)',
        on: 'light',
    },

    {
        name: 'Button Secondary',
        hex: '#FFEFE0',
        rgb: '255, 239, 224',
        hsl: '30deg, 100%, 94%',
        usage: 'Secondary buttons',
        wcag: 'AAA on #530A24 (10.2:1)',
        on: 'dark',
    },

    {
        name: 'Button Primary Text',
        hex: '#FFFFFF',
        rgb: '255, 255, 255',
        hsl: '0deg, 0%, 100%',
        usage: 'Primary button labels',
        wcag: 'AA on #C0395A (4.6:1)',
        on: 'dark',
    },

    {
        name: 'Button Secondary Text',
        hex: '#9D2644',
        rgb: '157, 38, 68',
        hsl: '345deg, 61%, 38%',
        usage: 'Secondary button labels, link accents',
        wcag: 'AA on #FFEFE0 (4.8:1)',
        on: 'light'
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
        name: 'Success',
        hex: '#4CAF50',
        rgb: '76, 175, 80',
        hsl: '122deg, 39%, 49%',
        usage: 'Success states, confirmations, positive feedback',
        wcag: 'AA on dark (4.5:1)',
        on: 'light',
    },

    {
        name: 'Danger',
        hex: '#E53935',
        rgb: '229, 57, 53',
        hsl: '1deg, 77%, 55%',
        usage: 'Destructive actions, errors, validation fails',
        wcag: 'AA on white (4.5:1)',
        on: 'light',
    },
    ],

    pinkColors: {
        '100': '#ED5A90',
        '200': '#E93577',
        '300': '#DC1860',
        '400': '#B91551',
        '500': '#931040',
        '600': '#6E0C30',
        '700': '#530A24',
        '800': '#490820',
        '900': '#250410',
    },

    typography: [
    {
        name: 'Heading Big',
        cssVar: '--heading-big-size',
        size: '5rem',
        weight: 700,
        sample: 'CodeClash Gaming',
        usage: 'Display titles - .heading-big class',
    },

    {
        name: 'Heading',
        cssVar: '--heading-size',
        size: '3rem',
        weight: 700,
        sample: 'Welcome Back, Challenger',
        usage: 'Page headings, section titles - .heading class',
    },

    {
        name: 'Heading Sub',
        cssVar: '--font-size-md',
        size: '1.9rem',
        weight: 400,
        sample: 'Build your skills. Earn your rank.',
        usage: 'Subheadings, taglines, back buttons - .heading-sub class',
    },

    {
        name: 'Body-Large',
        cssVar: '--font-size-l',
        size: '2.3rem',
        weight: 500,
        sample: '',
        usage: 'Large body text, prominent labels', 
    },

    {
        name: 'Body-Medium',
        cssVar: '--font-size-md',
        size: '1.9rem',
        weight: 500,
        sample: '',
        usage: 'General body text, paragraphs',
    },

    {
        name: 'Small',
        cssVar: '--font-size-sm',
        size: '1.3rem',
        weight: 400,
        sample: 'Already have an account?',
        usage: 'Captions, helper texts, form labels - .fields class',
    },

    {
        name: 'Extra Small',
        cssVar: '--font-size-xsm',
        size: '1rem',
        weight: 400,
        sample: 'Select a game mode and start competing',
        usage: 'Statistics, small UI labels - text-xsm',
    },
    ],

    tokens: {
        color: [ //ColorTokens shows the design view for designers to see visual identity, this will be used by developers as the code view. So its "how to use this color" rather than "what does the color look like"
        {
            token: '--primary',
            value: '#530A24',
            description: 'Page background, primary surfaces',
        },

        {
            token: '--secondary',
            value: '#FFEFE0',
            description: 'Secondary buttons, soft card surfaces',
        },

        {
            token: '--primary-text',
            value: '#FCECDD',
            description: 'Primary text on all dark backgrounds',
        },

        {
            token: '--secondary-text',
            value: '#530A24',
            description: 'Text on light/secondary surfaces',
        },

        {
            token: '--button-primary',
            value: '#C0395A',
            description: 'Primary buttons'
        },

        {
            token: '--button-secondary',
            value: '#FFEFE0',
            description: 'Secondary buttons',
        },

        {
            token: '--button-text-primary',
            value: '#FFFFFF',
            description: 'Text on primary buttons',
        },

        {
            token: '--button-text-secondary',
            value: '#9D2644',
            description: 'Text on secondary buttons',
        },

        {
            token: '--success',
            value: '#4CAF50',
            description: 'Success states, confirmations, positive feedback',
        },

        {
            token: '--danger',
            value: '#E53935',
            description: 'Destructive actions, errors, validation fails',
        },

        {
            token: '--text',
            value: '#FFFFFF',
            description: 'White text fallback',
        },

        {
            token: '--muted',
            value: 'rgba(252, 236, 221, 0.5)',
            description: 'Muted surface overlay',
        },

        {
            token: '--muted-text',
            value: 'rgba(252, 236, 221, 0.5)',
            description: 'Muted text on dark backgrounds',
        },
        ],

        radius: [
        {
            token: '--radius-sm',
            value: 'calc(var(--radius) - 4px)',
            description: '16px - small elements',
        },

        {
            token: '--radius-md',
            value: 'calc(var(--radius) - 2px)',
            description: '18px - medium elements',
        },

        {
            token: '--radius-lg',
            value: 'var(--radius)',
            description: '20px - standard inputs and buttons',
        },

        {
            token: '--radius-xl',
            value: 'calc(var(--radius) + 4px)',
            description: '24px - large elements',
        },
        ],

        typography: [
        {
            token: '--font',
            value: "'Roboto', sans-serif",
            description: 'Primary font - body, headings',
        },

        {
            token: '--font-logo',
            value: "'Baloo Bhai 2', sans-serif",
            description: 'Logo display',
        },

        {
            token: '--heading',
            value: "'Roboto', sans-serif",
            description: 'Heading font',
        },

        {
            token: '--heading-weight',
            value: '700',
            description: 'Bold - .heading and .heading-big',
        },

        {
            token: '--font-weight',
            value: '500',
            description: 'Medium - default body font'
        },

        {
            token: '--heading-sub-weight',
            value: '400',
            description: 'Regular - .heading-sub',
        },

        {
            token: '--heading-size',
            value: '3rem',
            description: 'Standard heading - .heading',
        },

        {
            token: '--heading-big-size',
            value: '5rem',
            description: 'Display heading - .heading-big',
        },

        {
            token: '--font-size-xsm',
            value: '1rem',
            description: 'Extra small - text-xsm',
        },

        {
            token: '--font-size-sm',
            value: '1.3rem',
            description: 'Small - .fields, captions',
        },

        {
            token: '--font-size-md',
            value: '1.9rem',
            description: 'Medium - .heading-sub, body text',
        },

        {
            token: '--font-size-l',
            value: '2.3rem',
            description: 'Large - prominent body text',
        },

        {
            token: '--font-size-xl',
            value: '3rem',
            description: 'Extra large',
        },

        {
            token: '--font-size-2xl',
            value: '3.3rem',
            description: '2X large',
        },

        {
            token: '--font-size-3xl',
            value: '3.6rem',
            description: '3X large',
        },
        ],

        shadow: [
        {
            token: '--badge-shadow',
            value: '0 4px 6px rgba(0, 0, 0, 0.3)',
            description: 'Buttons, badges - .badge-shadow',
        },

        {
            token: '--card-shadow',
            value: '0rem 0.2rem 0.5rem rgba(0, 0, 0, 0.25)',
            description: 'Cards and elevated surfaces - .card-shadow',
        },
        ],
    },

    components: [
    {
        name: 'Button Primary',
        vars: ['Default', 'Hover', 'Active', 'Disabled', 'Loading'],
        classes: ['bg-button-primary', 'text-button-text-primary', 'rounded-lg', 'shadow-badge', 'font-bold'],
        notes: 'w-[100%] on auth pages, fixed width on dashboard. h-[3rem], font-size 1.5rem, hover: -translate-y-px',
    },

    {
        name: 'Button Secondary',
        vars: ['Default', 'Hover', 'Underline'],
        classes: ['text-primary-text', 'underline', 'font-semibold', 'bg-transparent'],
        notes: 'Used for inline links',
    },

    {
        name: 'Back Button',
        vars: ['Primary', 'Secondary'],
        classes: ['.primary-back-button', '.secondary-back-button', 'absolute top-[15px] left-[40px]'],
        notes: 'Primary uses primary-text color, secondary uses secondary-text color',
    },

    {
        name: 'Input Field',
        vars: ['Default', 'Focus', 'Disbaled', 'Error'],
        classes: ['.fields', 'bg-white', 'rounded-lg', 'border-primary', 'h-[3rem]'],
        notes: 'font-size var(--font-size-sm) via .fields',
    },

    {
        name: 'Checkbox',
        vars: ['Unchecked', 'Checked', 'Disabled'],
        classes: ['accent-button-primary', 'w-8 h-8', 'rounded-sm'],
        notes: 'Paired with Terms & Conditions label using font-size-sm',
    },

    {
        name: 'Glass Card',
        vars: ['Default', 'Bordered'],
        classes: ['ClassCard component', 'bg-black/80', 'border', 'rounded'],
        notes: 'Custom shadcn component at @/components/shared/GlassCard',
    },

    {
        name: 'Progress Bar',
        vars: ['Default', 'Colored'],
        classes: ['Progress component', 'bg-[#E4BBCA]', 'shadow-badge', 'h-[60%]'],
        notes: 'shadcn Progress component with custom progress_colour prop for fill',
    },
    ],

    changelog: [
    {
        category: 'Colors',
        changes: [
            'New color palette - pinkColors documented as named Tailwind tokens',
            'Fixed --button-text-primary from #FFFF to #FFFFFF',
            'Defined --success #4CAF50 and --danger #E53935',
            'Added --muted and --muted-text for overlays and faded text usage',
            'Removed grey fallback, now --background will always resolve to maroon',
        ],
        rationale: 'Several color tokens were invalid or undefined, causing inconsistencies and unwanted fallbacks. The entire color palette was also changed.',
    },

    {
        category: 'Typography',
        changes: [
            '--heading corrected from Baloo Bhai 2 to Roboto',
            '--font-logo kept as Baloo Bhai 2 for logo display only',
            '--heading-big-size added and defined as 5rem',
            '--font-size-xsm added as 1rem',
            '--badge-font-size corrected from 0.1rem (invisible) to 0.75rem',
        ],
        rationale: 'Demo 1 had undefined variables and mismatches. All the tokens now match what the actual component uses.',
    },

    {
        category: 'Styling Architecture',
        changes: [
            'Migrated from per-file CSS to a single global.css with Tailwind v4',
            'All styling now done via Tailwind utility classes directly in TSX components',
            'global.css serves as the single source of truth for all design tokens via CSS custom properties',
            '@theme inline block maps all CSS variables to Tailwind utilities',
            '@layer base defines shared utility classes eg .heading, .heading-big, .heading-sub',
        ],
        rationale: 'Per-file CSS caused token drift where the same color or spacing value would be hardcoded differently. Centralizing into global.css with Tailwind v4 ensures every component pulls from the same source and makes global changes easier.'
    },

    {
        category: 'Architecture',
        changes: [
            'Adopted MVVM - Model, View Model and View seperation',
            'Validation logic extracted to pure functions in Models',
            'Auth state managed via AuthContext, and navigation via react-router-dom',
            'Dashboard uses Layout wrapper with AppSidebar via SidebarProvider',
        ],
        rationale: 'Clean seperation of concerns improves testability and makes changes easier, and safer.',
    },

    {
        category: 'Pages and Visual Design',
        changes: [
            'Complete visual redesign from Demo 1',
            'New Robots in Space theme implemented across the App',
            'Dark maroon radial gradient established as the core, default background identity',
            'Theme related assets introduced such as UFO, planets, new robot mascot, symbol background texture, light beam effects',
        ],
        rationale: 'Demo 1 screens had no visual identity, Demo 2 now fully establishes a cosmos theme that runs consistently across the App.',
    },
    ],

    accessibilityRules: [ //Need to add more here
        'Conformance target: WCAG 2.2 AA minimum, AAA achieved for all body text pairings',
        'All form inputs have visible labels or aria-label attributes',
        'Buttons use type="button" explicitly to prevent unintended form submissions',
        'Logical reading order top-to-bottom, left-to-right',
    ],

    logoRules: {
        permitted: [
            'Scale proportionally maintaining aspect ratio',
            'Use on approved dark #530A24 or light #FFEFE0 backgrounds',
        ],

        forbidden: [
            'Stretch or distort the logo in any dimension',
            'Visual effects such as shadowns, glows or outlines',
            'Color outside of the approved palette',
            'Place on clashing background',
            'Rotate, skew or transform',
        ],
    },
};