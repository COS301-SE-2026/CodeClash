import { vi, Mock, describe, beforeEach, it, expect} from 'vitest';
import { MatchResultService } from '../../../../src/application/usecases/services/match-result.service';
import { IEloRepository } from '../../../../src/application/interfaces/repositories/IEloRepository';
import { IMatchResultRepository } from '../../../../src/application/interfaces/repositories/IMatchResultRepository';
import { getMatchResults } from '../../../../src/interface-adapters/controllers/match-results.controllers';
import { Response, Request } from 'express';