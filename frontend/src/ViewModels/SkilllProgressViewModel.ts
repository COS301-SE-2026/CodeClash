import { useEffect, useMemo, useState } from 'react';
import { useAuth } from 'src/context/Auth/hooks/useAuth';
import { useUser } from 'src/context/User/hooks/useUser';
import type {
    ComponentScore,
    DifficultyBand,
    GameDomain,
    GameMastery,
    GrowthResult,
    Insight,
    SkillDomain,
    SkillProgressContent
} from 'src/Models/SkillProgressModel';
import {
    MASTERY_WINDOW,
    averageMastery,
    buildInsights,
    componentScores,
    difficultyBands,
    gameMastery,
    growthFromReadings,
    growthReadings,
    masteryCeiling,
    skillProgressContent
} from 'src/Models/SkillProgressModel';
import type { SkillTelemetry } from 'src/services/skill-progress.service';
import { loadSkillTelemetry } from 'src/services/skill-progress.service';

