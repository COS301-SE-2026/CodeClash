import { type BadgeDTO } from "./BadgeDTO";

export interface DashUserDTO {
    id: string,
    level: number,
    avatar: string,
    elo: number,
    curr_streak: number,
    winning_streak: number,
    latest_badge: BadgeDTO,
    math_progress: [string, number],
    prog_progress: [string,number]
}