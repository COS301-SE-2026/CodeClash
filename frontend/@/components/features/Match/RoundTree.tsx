import { cn } from "@/lib/utils"
import { Target, Check, X, LockKeyhole } from "lucide-react"
import type { QuestionDTO } from "src/dtos/match/match.dto"

interface RoundTreeProps {
    rounds: QuestionDTO[][],
    results: (boolean | null)[][],
    current_round: number,
    current_question: number,
    className?: string
}

export const RoundTree = ({
    rounds,
    results,
    current_round,
    current_question,
    className

}: RoundTreeProps) => {
    return (
        <div className={cn("flex flex-col h-full gap-5", className)}>
            {rounds.map((round_question, round_idx) => {
                const round_key = round_question.map(q => q.id).join('-');
                const past_round = round_idx < current_round;
                const current = round_idx === current_round;
                const next_round = round_idx > current_round;

                return (
                    <div key={round_key} className="flex flex-col gap-2" >
                        <span
                            className={cn("text-sm font-bold uppercase tracking-widest", current && "text-button-tournament", next_round && "text-muted-text/50", past_round && "text-button-tournament-secondary")}
                        >
                            Round {round_idx + 1}
                        </span>

                        <div className="flex flex-col ml-2 border-l-2 border-match-card gap-2">
                            {round_question.map((question, q_idx) => {
                                const result = results[round_idx]?.[q_idx];
                                const is_current = current && q_idx === current_question;
                                const next = next_round || (current && q_idx > current_question);

                                const Symbol = () => {
                                    if (is_current) return <Target size={26} className="font-black shrink-0:" />
                                    if (result === true) return <Check size={26} className="text-green-300 font-semibold shrink-0" />
                                    if (result === false) return <X size={26} className="text-red-300 font-semibold shrink-0" />
                                    return <LockKeyhole className="shrink-0"/>
                                }

                                return(
                                    <div key={question.id} className={cn("flex items-center gap-3 pl-4 py-1.5 text-xs rounded-r-lg trasnition-colors", 
                                    is_current && "text-button-tournament font-semibold bg-button-tournament/10",
                                    next && "text-muted-text/50"
                                    )}>

                                        <span className="-ml-[9px] text-muted-text/60">-</span>
                                        {Symbol()}

                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}

        </div>
    )
}