import { DataSource, Repository } from "typeorm";
import { Match } from "../../../src/entities/db-entities/match.entities";



let data_source: DataSource
let match_entity: Repository<Match>
