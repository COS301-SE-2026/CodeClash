import type React from 'react';
import type { DifficultyBand } from 'src/Models/SkillProgressModel';

interface DifficultyBandsProps {
    bands: DifficultyBand[];
}

const TONE = ['badge-difficulty-easy', 'badge-difficulty-medium', 'badge-difficulty-hard'];

