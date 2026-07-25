//These handlers should handle the submission of answers and sending results of the game to both players
import { Socket, Server } from "socket.io";
import { gameService } from 'src/application/usecases/services/game.service';
import { IQuestionRepository } from "src/application/interfaces/IQuestionRepository";
import { IEloRepository} from "src/application/interfaces/IEloRepository";
import { ISubmissionRepository } from "src/application/interfaces/ISubmissionRepository";