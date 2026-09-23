// Service dependencies for system modules

import { IUserRepository } from "src/application/interfaces/repositories/IUserRepository";
import { MatchStore } from "src/application/usecases/services/match/match-store.service";
import { MatchCreationService } from "src/application/usecases/services/match/match-creation.service";
import { MarkingService } from "src/application/usecases/services/marking/marking.service";
import { MatchConfirmationService } from "src/application/usecases/services/match/match-confirmation.service";
import { MatchmakingService } from "src/application/usecases/services/matchmaking.service";
import { DeleteGame } from "src/application/usecases/systems/delete-game";
import { SubmissionSystem } from "src/application/usecases/systems/submission.system";
import { MatchStart } from "src/application/usecases/services/match/match-start.service";
import { MatchCompletionService } from "src/application/usecases/services/match/match-completion.service";
import { TournamentService } from "src/application/usecases/services/tournament.service";

export interface MatchDeps {
    marking_service: MarkingService,
    submission_system: SubmissionSystem,
    match_completion_service: MatchCompletionService,
    match_deletion_system: DeleteGame,
    match_store: MatchStore,
}

export interface MatchmakingDeps {
    matchmaking_service: MatchmakingService,
    matched_users_service: MatchConfirmationService,
    match_service: MatchCreationService,
    match_store: MatchStore,
    user_repo: IUserRepository,
    match_start: MatchStart,
}

export interface FriendDeps { }

export interface TournamentDeps {
    tournament_service: TournamentService
}

export interface SocketDeps {
    match: MatchDeps,
    matchmaking: MatchmakingDeps,
    friends: FriendDeps,
    tournament: TournamentDeps
}

