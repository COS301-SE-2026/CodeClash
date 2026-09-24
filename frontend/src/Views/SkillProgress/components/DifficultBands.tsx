import type React from 'react';
import type { DifficultyBand } from 'src/Models/SkillProgressModel';

interface DifficultyBandsProps {
    bands: DifficultyBand[];
}

const TONE = ['badge-difficulty-easy', 'badge-difficulty-medium', 'badge-difficulty-hard'];

const DifficultyBands: React.FC<DifficultyBandsProps> = ({ bands }) => (
    <div className="flex flex-col gap-4">
        {bands.map((band, index) => {
            const percentage = Math.round(band.performance * 100);
            return (
                <div key={band.difficulty}>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={`badge ${TONE[index] ?? TONE[0]}`}>{band.label}</span>
                        <span className="text-xsm text-muted-text">
                            {band.questionCount === 0 ? 'No questions yet' : `${percentage}% of optimal · ${band.questionCount} questions`}
                        </span>
                    </div>
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${percentage}%` }} />
                    </div>
                </div>
            );
        })}
    </div>
);

export default DifficultyBands;