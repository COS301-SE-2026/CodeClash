import {ChevronRight} from 'lucide-react';
import { Link } from 'react-router-dom';

type SkillMetric = {
    label: string;
    value: number;
}


export const SkillProgressCard = ({
    items, seeAll,
}: {
    items: SkillMetric[];
    seeAll: string;
}) => (
    <div className='card-elevated p-5'>
        <div className='blur-[1px] pointer-events-none select-none opacity-60'>
            <div className='flex items-center justify-between mb-3'>
                <div>
                    <p className='text-sm font-bold text-primary-text'>Skills Progress</p>
                </div>
                <Link to={seeAll} className='badge badge-status-pending'>
                    See all
                    <ChevronRight size={12} />
                </Link>
            </div>
            <div className='flex flex-col gap-4 rounded-2xl bg-background-elevated border border-border p-4'>
                {items.map((item) => (
                    <div key={item.label}>
                        <div className='flex justify-between text-xsm text-muted mb-1.5'>
                            <span>{item.label}</span>
                            <span>{item.value}%</span>
                        </div>
                        <div className='progress-track'>
                            <div className='progress-fill'
                                style={{ width: `${item.value}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
)
