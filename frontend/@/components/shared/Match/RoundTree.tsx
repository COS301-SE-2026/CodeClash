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
        <div className={cn("flex flex-col gap 4", className)}>
            {rounds.map((round_question, round_idx) => {
                const past_round = round_idx < current_round;
                const current = round_idx === current_round;
                const next_round = round_idx > current_round;

                return (
                    <div key={round_idx} className="flex flex-col" >
                        <span
                            className={cn("text-sm font-bol mb-1", current && "text-button-tournament", next_round && "text-muted-text/50", past_round && "text-button-tournament-secondary")}
                        >
                            Round {round_idx + 1}
                        </span>

                        <div className="flex flex-col ml-2 border-1 border-match-card">
                            {round_question.map((_, q_idx) => {
                                const result = results[round_idx]?.[q_idx];
                                const is_current = current && q_idx === current_question;
                                const next = next_round || (current && q_idx > current_question);

                                const Symbol = () => {
                                    if (is_current) return <Target size={30} className="font-black" />
                                    if (result === true) return <Check size={40} className="text-green-300 font-semibold" />
                                    if (result === false) return <X size={40} className="text-[var(--progress-bar-symbol)] font-semibold" />
                                    return <LockKeyhole />
                                }

                                return(
                                    <div key={q_idx} className={cn("flex items-center gap-2 pl-3 py-1 text-xs", 
                                    is_current && "text-button-tournament font-semibold",
                                    next && "text-muted-text/50"
                                    )}>

                                        <span className="-ml-[9px]">-</span>
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