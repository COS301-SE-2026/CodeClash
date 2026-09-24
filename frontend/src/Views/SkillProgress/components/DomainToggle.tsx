import type React from 'react';
import type { SkillDomain } from 'src/Models/SkillProgressModel';

interface DomainToggleProps {
    domain: SkillDomain;
    onChange: (domain: SkillDomain) => void;
}

const OPTIONS: { key: SkillDomain; label: string }[] = [
    { key: 'overall', label: 'Overall' },
    { key: 'math', label: 'Math' },
    { key: 'programming', label: 'Code' }
];