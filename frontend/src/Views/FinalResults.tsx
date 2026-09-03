import { TrendingUp, TrendingDown, Minus, Clock } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import ResultsBackground from '../assets/Background/FinalResults.jpg';
import { FinalResultsViewModelFunction } from "../ViewModels/FinalResultsViewModel";
import { robot_map } from "src/assets/Robots";
import Loading from "@/components/shared/Loading";


const FinalResults: React.FC = () => {
    const navigate = useNavigate();

    const {
        content, state, loadingProgress,
        winner, loser
    } = FinalResultsViewModelFunction();

    const formatTime = (ms: number|undefined) => {

        if(ms === undefined) return 'Error getting time'
        const total_sec = Math.floor(ms / 1000);
        const min = Math.floor(total_sec / 60);
        const sec = total_sec % 60

        return `${min}:${sec.toString().padStart(2,'0')}`;
    }

    if(!winner || !loser){
        return(
            <Loading></Loading>
        )
    }

    return (
        <div className="bg-secondary min-h-screen w-full flex items-center justify-center">

            {state === 'loading' && (
                <div className="bg-secondary rounded-3xl p-12 w-[90%] max-w-[550px] flex flex-col gap-6">
                    <h1 className="text-secondary-text font-bold"
                        style={{ fontSize: 'var(--heading-size)' }}>{content.titleLoading}</h1>

                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <span className="text-secondary-text font-medium"
                                style={{ fontSize: 'var(--font-size-sm)' }}>
                                {content.labelLoading}
                            </span>
                            <span className="text-secondary-text font-bold"
                                style={{ fontSize: 'var(--font-size-sm)' }}>
                                {Math.min(Math.round(loadingProgress), 100)}%
                            </span>
                        </div>

                        <div className="w-full h-8 border-2 border-secondary-text rounded-sm overflow-hidden">
                            <div className="h-full bg-secondary-text transition-all duration-500 ease-out"
                                style={{ width: `${Math.min(loadingProgress, 100)}%` }} />
                        </div>
                    </div>
                </div>
            )}

            {/*Error state */}
            {state === 'error' && (
                <div className="bg-secondary rounded-3xl p-12 w-[90%] max-w-[550px] flex flex-col items-center gap-6 text-center">
                    <Clock className="w-16 h-16 text-black opacity-60" />
                    <h1 className="text-secondary-text font-extrabold"
                        style={{ fontSize: 'var(--heading-size)' }}>{content.titleError}</h1>
                    <p className="text-secondary-text iopacity-70 leading-relaxed"
                        style={{ fontSize: 'var(--font-size-sm)' }}>{content.messageError}</p>
                    <button className="w-full py-3 rounded-2xl bg-button-primary text-button-text-primary font-bold hover:opacity-90 transition-opacity shadow-badge flex items-center justify-center gap-2"
                        style={{ fontSize: 'var(--font-size-sm)' }} onClick={() => navigate('/dashboard')} type="button">
                        {content.labelReturn}
                    </button>
                </div>
            )}

            {state === 'results' && (
                <div className="min-h-screen w-full flex items-center justify-center"
                    style={{ backgroundImage: `url(${ResultsBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', }}>
                    <div className="w-[90%] max-w-6xl flex flex-col gap-6 p-10">
                        <h1 className="text-primary-text font-bold text-center"
                            style={{ fontSize: 'var(--heading-size)' }}>{content.titleResults}</h1>

                        {/*Table of results */}
                        <div className="flex flex-col gap-4">
                            {/*Header */}
                            <div className="grid rounded-lg border border-secondary-text bg-secondary"
                                style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr' }}>
                                {content.tableHeaders.map(header => (
                                    <div key={header} className="px-3 py-3 text-center border-r border-secondary-text last:border-r-0">
                                        <span className="text-secondary-text font-bold"
                                            style={{ fontSize: 'var(--font-size-xsm)' }}>{header}</span>
                                    </div>
                                ))}
                            </div>

                            {/*Rows */}

                            {/* winner */}

                            <div className="grid rounded-lg border border-secondary-text bg-secondary"
                                style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr' }}>

                                {/*The user name + user robot/icon */}
                                <div className="px-3 py-4 flex flex-col items-center justify-center gap-1 border-r border-secondary-text h-full">
                                    <div className="w-15 h-[6rem] rounded-full overflow-hidden flex-shrink-0">
                                        {winner ? (
                                            <img src={robot_map[winner.avatar]} alt={winner.username} className="w-full h-[5.5rem]  object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-secondary-text" />
                                        )}
                                    </div>
                                    <span className="text-secondary-text font-medium text-center truncate w-full"
                                        style={{ fontSize: 'var(--font-size-xsm)' }}>{winner.username}</span>
                                    <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-yellow-900 font-black uppercase tracking-wide" style={{ fontSize: 'var(--font-size-xsm)' }}> 
                                      {content.labelWinner}
                                    </span>
                  </div>

                                {/*The column for correctness */}
                                <div className="px-3 py-4 flex items-center justify-center border-r border-secondary-text h-full">
                                    <span className="text-secondary-text font-semibold"
                                        style={{ fontSize: 'var(--font-size-sm)' }}>{winner.correctness} questions</span>
                                </div>

                                {/*The column for speed - copied from above*/}
                                <div className="px-3 py-4 flex items-center justify-center border-r border-secondary-text h-full">
                                    <span className="text-secondary-text font-semibold"
                                        style={{ fontSize: 'var(--font-size-sm)' }}>{formatTime(winner.speed)}</span>
                                </div>

                                {/*Column for elo effect */}
                                <div className="px-3 py-4 flex  flex-col items-center justify-center border-r border-secondary-text h-full">
                                    {winner.eloEffect >= 0 ? (
                                        <TrendingUp className="w-9 h-9 text-success" />
                                    ) : (
                                        <TrendingDown className="w-9 h-9 text-danger" />
                                    )}
                                    <span className={`font-bold ${winner.eloEffect >= 0 ? 'text-success' : 'text-danger'}`}
                                        style={{ fontSize: 'var(--font-size-sm)' }}>{winner.eloEffect}</span>
                                </div>

                                {/*Column for the users position (1st or 2nd) */}
                                <div className="px-3 py-4 mt-2">
                                  <Badge rankBefore={winner.rank_before} rank={winner.rank}/>
                                </div>
                            </div>

                        </div>

                        {/* loser */}

                        <div className="grid rounded-lg border border-secondary-text bg-secondary"
                            style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr' }}>

                            {/*The user name + user robot/icon */}
                            <div className="px-3 py-4 flex flex-col items-center justify-center gap-1 border-r border-secondary-text h-full">
                                <div className="w-15 h-25 rounded-full overflow-hidden flex-shrink-0">
                                    {loser ? (
                                            <img src={robot_map[loser.avatar]} alt={loser.username} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-secondary-text" />
                                        )}
                                </div>
                                <span className="text-secondary-text font-medium text-center truncate w-full"
                                    style={{ fontSize: 'var(--font-size-xsm)' }}>{loser.username}</span>
                            </div>

                            {/*The column for correctness */}
                            <div className="px-3 py-4 flex items-center justify-center border-r border-secondary-text h-full">
                                <span className="text-secondary-text font-semibold"
                                    style={{ fontSize: 'var(--font-size-sm)' }}>{loser.correctness} questions</span>
                            </div>

                            {/*The column for speed - copied from above*/}
                            <div className="px-3 py-4 flex items-center justify-center border-r border-secondary-text h-full">
                                <span className="text-secondary-text font-semibold"
                                    style={{ fontSize: 'var(--font-size-sm)' }}>{formatTime(loser.speed)}</span>
                            </div>

                            {/*Column for elo effect */}
                            <div className="px-3 py-4 flex  flex-col items-center justify-center border-r border-secondary-text h-full">
                                {loser.eloEffect >= 0 ? (
                                    <TrendingUp className="w-9 h-9 text-success" />
                                ) : (
                                    <TrendingDown className="w-9 h-9 text-danger" />
                                )}
                                <span className={`font-bold ${loser.eloEffect >= 0 ? 'text-success' : 'text-danger'}`}
                                    style={{ fontSize: 'var(--font-size-sm)' }}>{loser.eloEffect}</span>
                            </div>

                            {/*Column for the users position (1st or 2nd) */}
                            <div className="px-3 py-4 mt-2">
                                <Badge rankBefore={loser.rank_before} rank={loser.rank} />
                            </div>
                        </div>


                        {/*Buttons for return and try again*/}
                        <div className="flex gap-4 mt-2">
                            <button className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-secondary text-secondary-text font-bold hover:opacity-80 transition-opacity"
                                style={{ fontSize: 'var(--font-size-sm)' }} onClick={() => navigate('/dashboard')} type="button">
                                {content.labelReturn}
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-button-primary text-button-text-primary font-bold hover:opacity-90 transition-opacity"
                                style={{ fontSize: 'var(--font-size-sm)' }} onClick={() => navigate('/dashboard')} type="button"> {/*Need to fix this navigation cause not sure where this will take the user?? */}
                                {content.labelPlayAgain}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};



const ordinal = (rank: number) => {
  const tens = rank % 100;
  if (tens >= 11 && tens <= 13) return `${rank}th`;

  switch (rank % 10) {
    case 1: return `${rank}st`;
    case 2: return `${rank}nd`;
    case 3: return `${rank}rd`;
    default: return `${rank}th`; 
  }
}

const RankChange: React.FC<{ before: number, after: number }> = ({ before, after }) => {
  const moved = before - after;

  if (moved === 0) return (
    <span className="text-secondary-text font-semibold opacity-60" style={{ fontSize: 'var(--font-size-xsm)' }}>
      <Minus className="w-4 h-4" />
      No change
    </span>
  );

  return (
    <span className={`flex items-center gap-1 font-bold ${moved > 0 ? 'text-success' : 'text-danger'}`} style={{ fontSize: 'var(--font-size-xsm)' }}>
      {moved > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
      {Math.abs(moved)}
    </span>
  );
};

const Badge: React.FC<{ rankBefore?: number | null, rank?: number | null }> = ({ rankBefore, rank }) => {
  const changed = !!rankBefore && rankBefore !== rank;
  return (
    <div className="flex flex-col items-center gap-1">
      {rank ? (
        <span className="text-secondary-text font-semibold flex items-center opacity-70 text-center justify-center"
              style={{ fontSize: 'var(--font-size-xsm)' }}>
                  {changed ? `${ordinal(rankBefore)} → ${ordinal(rank)}` : ordinal(rank)}
        </span>
      ) : null}

      {rank && rankBefore ? <RankChange before={rankBefore} after={rank} /> : null}
    </div>
  );
};

export default FinalResults;