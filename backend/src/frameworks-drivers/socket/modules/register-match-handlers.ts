import { Server, Socket } from "socket.io";
import { MatchDeps } from "../dependencies";
import { registerHandler } from "../dispatch";
import { PlayerSubmissionDTO } from "src/entities/dtos/submissions/submission.dto";
import { cleanUp, matchDone, sendResults, submitQuestion } from "src/interface-adapters/socket-handlers/match-handlers";
import { MatchType } from "src/entities/dtos/matches/match.dto";

const ecsId = (deps: MatchDeps, match_id: string | number) => {
  const id = typeof match_id === 'number' ? match_id : deps.match_store.getEcsId(match_id);
  if (id === undefined) throw new Error('Match not found');
  return id;
}

// register handlers 
export function registerMatchHandlers(io: Server, socket: Socket, deps: MatchDeps) {
  registerHandler(socket, 'submit_question', (socket, data: Omit<PlayerSubmissionDTO, 'match_id'> & { match_id: string | number }) =>
    submitQuestion(socket, { ...data, match_id: ecsId(deps, data.match_id) }, deps.marking_service));

  registerHandler(socket, 'match_done',
    (socket, payload: { match_id: string | number, match_type: MatchType }) =>
      matchDone(io, socket, ecsId(deps, payload.match_id), payload.match_type, deps.match_completion_service, deps.match_store)
  );
  registerHandler(socket, 'send_results', async (socket, payload: { match_id: string | number }) => sendResults(io, ecsId(deps, payload.match_id), deps.match_store));
  registerHandler(socket, 'clean_up', async (socket, payload: { match_id: string | number, pair_id: string }) => cleanUp(ecsId(deps, payload.match_id), payload.pair_id, deps.match_deletion_system, deps.match_store));
}