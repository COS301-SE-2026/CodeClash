import { RotateCcw} from "lucide-react";
import React from "react";

import type { MatchDetails } from "../Models/MatchHistoryModel";
import { MatchHistoryViewModelFunction } from "../ViewModels/MatchHistoryViewModel";
import Starfield from "@/components/ui/animations/Starfield";

const MatchHistory: React.FC = () => {
    const {
        matches, selected, isDetails,
        handleRowClick, handleCloseDetails,
    } = MatchHistoryViewModelFunction();

    return (
        <div className="bg-background min-h-screen w-full flex flex-col overflow-hidden">
            <Starfield count={30}/>
            <div className="relative z-10 flex flex-col items-center w-full px-6 pt-16 pb-10">
                <div className="flex flex-col items-center gap-1 mb-6">
                        <div className="flex items-center gap-3">
                            <h1 className="text-primary-text font-black text-center text-xl">Match History</h1>
                        </div>
                        <p className="text-primary opacity-80 tracking-widest uppercase"
                            style = {{fontSize: 'var(--font-size-xsm)'}}>Click on a row for more information</p>
                </div>

                <div className="flex items-start justify-center gap-8 w-full transition-all duration-100">
                    {/*Table LHS */}
                    <div className={`transition-all duration-100 w-full ${isDetails ? 'max-w-[700px]': 'max-w-[850px]'}`}>

                {/*Headers */}
                <div className="grid w-full px-6 mb-2 mx-auto"
                    style = {{gridTemplateColumns: '1fr 1fr 1fr 1fr'}}>
                    {['Mode', 'Type', 'Timestamp', 'Result'].map(header => (
                        <p key = {header} className="text-primary-text font-semibold text-center mx-auto"
                            style={{fontSize: 'var(--font-size-md)'}}>{header}</p>
                    ))}
                </div>

                {/*Table */}
                <div className="w-full bg-card card-glow rounded-2xl overflow-y-auto max-h-[420px] flex flex-col">
                    {matches.map((match,i) => (
                    <button key = {match.id} onClick={() => handleRowClick(match)} type="button"
                        className = {`grid w-full text-center px-6 py-5 cursor-pointer bg-transparent hover:bg-secondary-text/50 transition-colors duration-100 ${i < matches.length - 1 ? 'border-b border-border': ''}
                        ${selected?.id === match.id ? 'bg-secondary-text': ''}`}
                        style = {{gridTemplateColumns: '1fr 1fr 1fr 1fr', boxShadow: i<matches.length - 1? '0 4px 6px rgba(0,0,0,0.08)': 'none',}}>
                        <span className="text-primary-text font-medium tracking-widest"
                            style={{fontSize: 'var(--font-size-xsm)'}}>
                            {match.mode}
                        </span>
                        {/*Copying the above <span> for the same ones below */}
                        <span className="text-primary-text font-medium tracking-widest"
                            style={{fontSize: 'var(--font-size-xsm)'}}>
                            {match.type}
                        </span>
                        <span className="text-primary-text font-medium tracking-widest"
                            style={{fontSize: 'var(--font-size-xsm)'}}>
                            {match.timestamp}
                        </span>
                        <span className= {`font-bold tracking-widest ${match.result === 'WIN' ? 'text-success':
                            match.result === 'LOSS' ? 'text-danger' : 'text-secondary-text'}`}
                            style = {{fontSize: 'var(--font-size-xsm)'}}>
                            {match.result}
                        </span>
                    </button>
                ))}
                </div>
            </div>

            {/*The toggable details panel */}
            <div className= {`transition-all duration-100 ${isDetails ? 'w-[340px] opacity-100 translate-x-0': 'w-0 opacity-o translate-x-10'}`}>
            {selected && selected.details && (
                    <div className="relative bg-primary rounded-3xl p-6">
                        {/*X button to exit the details panel */}
                        <button onClick={handleCloseDetails} type="button" 
                            className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-primary text-primary-text font-black flex items-center justify-center cursor-pointer border-none hover:opacity-80 transition-opacity shadow-badge"
                            style={{fontSize: 'var(--font-size-sm)'}}>
                            X
                        </button>
                        <MatchDetailsPanel details = {selected.details}/>
                    </div>
            )}
        </div>
        </div>
        </div>
        </div>
    );
};

const MatchDetailsPanel: React.FC<{details: MatchDetails}> = ({details}) => (
    <div className="flex flex-col gap-4 w-full">
        {/*match info */}
        <div className="bg-primary rounded-xl p-2 flex flex-col gap-0">
            <p className="text-primary-text font-bold tracking-widest text-center py-2"
            style={{fontSize: 'var(--font-size-sm)'}}>MATCH INFO</p>
            <div className="bg-secondary rounded-lg flex justify-between items-center px-3 py-2 mb-1">
                <span className="text-secondary-text font-semibold" style={{fontSize: 'var(--font-size-xsm)'}}>RESULTS</span>
                <span className="text-secondary-text font-semibold" style={{fontSize: 'var(--font-size-xsm)'}}>{details.score}</span>
            </div>
            {/*Copied whole of above */}
            <div className="bg-secondary rounded-lg flex justify-between items-center px-3 py-2 mb-1">
                <span className="text-secondary-text font-semibold" style={{fontSize: 'var(--font-size-xsm)'}}>MATCH LENGTH</span>
                <span className="text-secondary-text font-semibold" style={{fontSize: 'var(--font-size-xsm)'}}>{details.totalTime}</span>
            </div>
        </div>

        {/*my match stats */}
        <div className="bg-primary rounded-xl p-2 flex flex-col gap-0">
            <p className="text-primary-text font-bold tracking-widest text-center py-2"
                style={{fontSize: 'var(--font-size-sm)'}}>MY STATS</p>
                    {/*copied from match info */}
                    <div className="bg-secondary rounded-lg flex  justify-between items-center px-3 py-1">
                        <span className="text-secondary-text font-semibold" style={{fontSize: 'var(--font-size-xsm)'}}>CORRECT ANSWERS</span>
                        <span className="text-secondary-text font-semibold" style={{fontSize: 'var(--font-size-xsm)'}}>{details.numCorrect}</span>
                    </div>                 
        </div>

        {/*Date */}
        <div className="bg-primary rounded-xl py-3 text-center">
            <p className="text-primary-text font-bold"
                style = {{fontSize: 'var(--font-size-sm)'}}>{details.date}</p>
            {/*COpied from above */}
            <p className="text-primary-text font-bold"
                style = {{fontSize: 'var(--font-size-xsm)'}}>{details.time}</p>
        </div>
    </div>
)

export default MatchHistory;