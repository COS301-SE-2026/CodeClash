import axios from 'axios';
import type {
    GameDomain,
    GameSample,
    MatchOutcome,
    QuestionSample
} from 'src/Models/SkillProgressModel';
import { leagueProfile } from 'src/Models/SkillProgressModel';
import { getComplexityProvider } from 'src/services/complexity.service';
import { seededRandom } from 'src/utils/seededRandom';

// skill progress requires question by question information, so this is to grab questions from match history and then 
// use that information for atleast some of the logic and code n stff