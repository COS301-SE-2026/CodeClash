import { Sparkles } from 'lucide-react';
import type React from 'react';
import type { ComponentScore, GameDomain } from 'src/Models/SkillProgressModel';

interface ComponentBarsProps {
    components: ComponentScore[];
    /*When the page is on Overall, the two domains are shown as separate groups.*/
    grouped: boolean;
}

const DOMAIN_LABEL: Record<GameDomain, string> = {
    math: 'Math',
    programming: 'Programming'
};

const ComponentRow: React.FC<{ component: ComponentScore }> = ({ component }) => (
    <div>
        <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
                <span className="text-xsm text-primary-text font-semibold">{component.label}</span>
                {component.estimated && (
                    <span className="badge badge-status-pending" title="Estimated until the complexity analysis endpoint lands">
                        <Sparkles size={10} />
                        EST
                    </span>
                )}
            </div>
            <span className="text-xsm text-muted-text font-bold">
                {component.gamesCounted === 0 ? '—' : `${component.value}%`}
            </span>
        </div>
        <div className="progress-track">
            <div className="progress-fill" style={{ width: `${component.value}%` }} />
        </div>
        <p className="text-xsm text-muted-text mt-1.5 leading-snug opacity-80">{component.hint}</p>
    </div>
);

