// Service dependencies for system modules

import { IUserRepository } from "src/application/interfaces/repositories/IUserRepository";
import { GameStore } from "src/application/usecases/services/match/match-store.service";
import { GameService } from "src/application/usecases/services/match/match.service";
import { MarkingService } from "src/application/usecases/services/marking/marking.service";
import { MatchedUsersService } from "src/application/usecases/services/matched-users.service";
import { MatchmakingService } from "src/application/usecases/services/matchmaking.service";
import { DeleteGame } from "src/application/usecases/systems/delete-game";
import { FinishGame } from "src/application/usecases/systems/finish-game";
import { SubmissionSystem } from "src/application/usecases/systems/submission.system";

export interface MatchDeps {
    math_marking_service: MarkingService;
    prog_marking_service: MarkingService;
    submission_system: SubmissionSystem;
    match_completion_system: FinishGame;
    match_deletion_system: DeleteGame;
    match_store: GameStore;
};

export interface MatchmakingDeps {
    matchmaking_service: MatchmakingService;
    matched_users_service: MatchedUsersService;
    match_service: GameService;
    match_store: GameStore;
    user_repo: IUserRepository
};

export interface FriendDeps { };

export interface SocketDeps {
    match: MatchDeps;
    matchmaking: MatchmakingDeps;
    friends: FriendDeps;
}