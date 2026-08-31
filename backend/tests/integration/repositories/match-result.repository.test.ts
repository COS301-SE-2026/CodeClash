import { DataSource, Repository } from "typeorm";
import { describe, beforeAll, afterAll, it, expect, vi } from "vitest";

import { createTestDataSource } from "../repositories/test-data-source";
import { mock_users_array } from "../repositories/mocks/mock-user";
import { Users } from '../../../src/entities/db-entities/user.entities'
import { EloRatings } from '../../../src/entities/db-entities/elo.entities'
import { EloRepository } from '../../../src/interface-adapters/repositories/elo.repository'
import { MatchResultService } from '../../../src/application/usecases/services/match-result.service'
import { IEloRepository } from '../../../src/application/interfaces/repositories/IEloRepository'
import { IMatchResultRepository } from '../../../src/application/interfaces/repositories/IMatchResultRepository'
import { EloUpdateResultDTO } from '../../../src/interface-adapters/dtos/elo.dto'

let data_source: DataSource
let elo_entity: Repository<EloRatings>
let elo_repo: EloRepository
let mock_user: Users[]
let service: MatchResultService