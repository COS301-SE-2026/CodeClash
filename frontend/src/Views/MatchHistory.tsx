import { RotateCcw} from "lucide-react";
import React from "react";

//import {Link } from "react-router-dom";
import Stars from "../assets/Background/Stars.png";
import type { MatchDetails } from "../Models/MatchHistoryModel";
import { MatchHistoryViewModelFunction } from "../ViewModels/MatchHistoryViewModel";

const MatchHistory: React.FC = () => {
    const {
        matches, selected, isDetails,
        handleRowClick, handleCloseDetails,
    } = MatchHistoryViewModelFunction();

    return (
        <div className="relative min-h-screen w-full flex flex-col overflow-hidden bg-black">
            <img src = {Stars} alt = "" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-70"/>
            <div className="relative z-10 flex flex-col items-center w-full px-6 pt-16 pb-10">
                <div className="flex flex-col items-center gap-1 mb-6">
                        <div className="flex items-center gap-3">
                            <RotateCcw className="w-10 h-10 text-primary-text"/>
                            <h1 className="text-primary-text font-bold tracking-widest"
                                style = {{fontSize: 'var(--heading-size)'}}>MATCH HISTORY</h1>
                        </div>
                        <p className="text-primary-text opacity-80 tracking-widest"
                            style = {{fontSize: 'var(--font-size-xsm)'}}>CLICK ON A ROW FOR MORE INFORMATION</p>
                </div>

                <div className="flex items-start justify-center gap-8 w-full transition-all duration-100">
                    {/*Table LHS */}
                    <div className={`transition-all duration-100 w-full ${isDetails ? 'max-w-[700px]': 'max-w-[850px]'}`}>

                {/*Headers */}
                <div className="grid w-full px-6 mb-2 mx-auto"
                    style = {{gridTemplateColumns: '1fr 1fr 1fr 1fr'}}>
                    {['MODE', 'TYPE', 'TIMESTAMP', 'RESULT'].map(header => (
                        <p key = {header} className="text-primary-text font-semibold tracking-widest text-center mx-auto"
                            style={{fontSize: 'var(--font-size-sm)'}}>{header}</p>
                    ))}
                </div>

                {/*Table */}
                <div className="w-full bg-secondary rounded-2xl overflow-y-auto max-h-[420px] flex flex-col">
                    {matches.map((match,i) => (
                    <button key = {match.id} onClick={() => handleRowClick(match)} type="button"
                        className = {`grid w-full text-center px-6 py-5 cursor-pointer bg-transparent hover:bg-secondary-text/50 transition-colors duration-100 ${i < matches.length - 1 ? 'border-b border-secondary-text': ''}
                        ${selected?.id === match.id ? 'bg-secondary-text': ''}`}
                        style = {{gridTemplateColumns: '1fr 1fr 1fr 1fr', boxShadow: i<matches.length - 1? '0 4px 6px rgba(0,0,0,0.08)': 'none',}}>
                        <span className="text-secondary-text font-medium tracking-widest"
                            style={{fontSize: 'var(--font-size-xsm)'}}>
                            {match.mode}
                        </span>
                        {/*Copying the above <span> for the same ones below */}
                        <span className="text-secondary-text font-medium tracking-widest"
                            style={{fontSize: 'var(--font-size-xsm)'}}>
                            {match.type}
                        </span>
                        <span className="text-secondary-text font-medium tracking-widest"
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
            {selected && (
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
                <span className="text-secondary-text font-semibold" style={{fontSize: 'var(--font-size-xsm)'}}>{details.results}</span>
            </div>
            {/*Copied whole of above */}
            <div className="bg-secondary rounded-lg flex justify-between items-center px-3 py-2 mb-1">
                <span className="text-secondary-text font-semibold" style={{fontSize: 'var(--font-size-xsm)'}}>MATCH LENGTH</span>
                <span className="text-secondary-text font-semibold" style={{fontSize: 'var(--font-size-xsm)'}}>{details.matchLength}</span>
            </div>
        </div>

        {/*my match stats */}
        <div className="bg-primary rounded-xl p-2 flex flex-col gap-0">
            <p className="text-primary-text font-bold tracking-widest text-center py-2"
                style={{fontSize: 'var(--font-size-sm)'}}>MY STATS</p>
            {details.questions.map(q => (
                <div key = {q.label} className="flex flex-col gap-1">
                    <div className="bg-secondary rounded-lg flex items-center px-3 py-2">
                    <span className="text-secondary-text font-semibold" style={{fontSize: 'var(--font-size-xsm)'}}>{q.label}</span>
                    </div>
                    {/*copied from match info */}
                    <div className="bg-secondary rounded-lg flex  justify-between items-center px-3 py-1">
                        <span className="text-secondary-text font-semibold" style={{fontSize: 'var(--font-size-xsm)'}}>SPEED</span>
                        <span className="text-secondary-text font-semibold" style={{fontSize: 'var(--font-size-xsm)'}}>{q.speed}</span>
                    </div>
                    <div className="bg-secondary rounded-lg flex  justify-between items-center px-3 py-1">
                        <span className="text-secondary-text font-semibold" style={{fontSize: 'var(--font-size-xsm)'}}>ACCURACY</span>
                        <span className= {q.correctness ? 'text-success': 'text-danger'} style={{fontSize: 'var(--font-size-xsm)'}}>{q.correctness ? 'CORRECT': 'INCORRECT'}</span>
                    </div>
                </div>
            ))}
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