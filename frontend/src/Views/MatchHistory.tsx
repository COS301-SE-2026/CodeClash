import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { MatchHistoryViewModelFunction } from "../ViewModels/MatchHistoryViewModel";
import type { MatchDetails } from "../Models/MatchHistoryModel";
import { RotateCcw} from "lucide-react";
import Stars from "../assets/Background/Stars.png";

const MatchHistory: React.FC = () => {
    const navigate = useNavigate();
    const {
        matches, selected, isDetails,
        handleRowClick, handleCloseDetails,
    } = MatchHistoryViewModelFunction();

    return (
        <div className="relative min-h-screen w-full flex flex-col overflow-hidden bg-black">
            <img src = {Stars} alt = "" className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-70"/>
            {/*Back button copied from Sign up */}
            <Link className="absolute top-10 left-10 rounded-lg px-4 py-2 heading-sub hover:opacity-80"
                    to='/dashboard'
                >
                    ← Back
            </Link>
            <div className="relative z-10 flex flex-col items-center w-full px-6 pt-16 pb-10">
                <div className="flex flex-col items-center gap-1 mb-6">
                        <div className="flex items-center gap-3">
                            <RotateCcw className="w-10 h-10 text-primary-text"/>
                            <h1 className="text-primary-text font-bold tracking-widest"
                                style = {{fontSize: 'var(--heading-size)'}}>MATCH HISTORY</h1>
                        </div>
                        <p className="text-primary-text opacity-80 tracking-widest"
                            style = {{fontSize: 'var(--font-size-xsm)'}}>CLICK ON ROW FOR MORE INFORMATION</p>
                </div>

                {/*Headers */}
                <div className="grid w-full max-w-[860px] px-6 mb-2 mx-auto"
                    style = {{gridTemplateColumns: '1fr 1fr 1fr 1fr'}}>
                    {['MODE', 'TYPE', 'TIMESTAMP', 'RESULT'].map(header => (
                        <p key = {header} className="text-primary-text opacity-60 font-semibold tracking-widest mx-auto"
                            style={{fontSize: 'var(--font-size-sm)'}}>{header}</p>
                    ))}
                </div>

                {/*Table */}
                <div className="w-full max-w-[860px] bg-secondary rounded-2xl overflow-y-auto max-h-[420px] flex flex-col">
                    {matches.map((match,i) => (
                    <button key = {match.id} onClick={() => handleRowClick(match)} type="button"
                        className = {`grid w-full text-center px-6 py-5 cursor-pointer bg-transparent hover:bg-secondary-text transition-colors duration-150 ${i < matches.length - 1 ? 'border-b border-secondary-text': ''}
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

                {/*Scroll Bar */}
                <div className="absolute right-[calc(50%-430px+4px)] top-[calc(50%+20px)] w-5 h-30 bg-primary rounded-full opacity-80"/> {/*Needs an update here */}
            </div>

            {/*The toggable details panel */}
            {isDetails && selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary" onClick={handleCloseDetails}>
                    <div className="relative bg-primary rounded-3xl p-6 w-[90%] max-w-[380px] flex flex-col gap-4" onClick={e => e.stopPropagation()}>
                        {/*X button to exit the details panel */}
                        <button onClick={handleCloseDetails} type="button" 
                            className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-secondary text-secondary-text font-black flex items-center justify-center cursor-pointer border-none hover:opacity-80 transition-opacity shadow-badge"
                            style={{fontSize: 'var(--font-size-sm)'}}>
                            X
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MatchHistory;