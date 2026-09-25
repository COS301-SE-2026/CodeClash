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

const DomainToggle: React.FC<DomainToggleProps> = ({ domain, onChange }) => (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1">
        {OPTIONS.map(option => {
            const isActive = option.key === domain;
            return (
                <button
                    key={option.key}
                    type="button"
                    onClick={() => onChange(option.key)}
                    aria-pressed={isActive}
                    className={`px-4 py-1.5 rounded-full text-xsm font-bold uppercase tracking-wide transition-all duration-200 cursor-pointer ${
                        isActive
                            ? 'bg-primary text-button-text-primary shadow-badge'
                            : 'text-muted-text hover:text-primary-text'
                    }`}
                >
                    {option.label}
                </button>
            );
        })}
    </div>
);

export default DomainToggle;