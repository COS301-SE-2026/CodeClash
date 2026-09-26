import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CodeXml, Sigma, Sparkles } from "lucide-react"
import { useState } from "react"
import { type MatchMode } from "src/dtos/match/match.dto"
import { Button } from "@/components/ui/button"
import type { TournamentDTO } from "src/dtos/tournaments/tournament.dto"

interface HostProps {
    Cancel: () => void,
    Create: (data: {
        title: string,
        match_mode: MatchMode,
        start_date: Date,
        players: number
    }) => Promise<{ ok: boolean, data?: TournamentDTO, error?: string }>
}

export const HostTournament = ({ Cancel, Create }: HostProps) => {

    const [title, setTitle] = useState("");
    const [mode, setMode] = useState<MatchMode>('math');
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [players, setPlayers] = useState(8);
    const [error, setError] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const handleCreate = async () => {
        console.log("handle create")
        if (!title.trim() || !date || !time) {
            setError("Please fill in required fields.Required fields are indicated with a *")
            return;
        }

        setError("");
        setStatus("loading");

        const start_date = new Date(`${date}T${time}`);
        const result = await Create({
            title,
            match_mode: mode,
            start_date,
            players
        });

        if (result.ok) {
            setStatus("success");
            setTimeout(() => {
                Cancel();   //close host form
            }, 1200);
        } else {
            setStatus("idle");
            setError("Failed to create tournament");
        }
    }

    return (
        <Card className="bg-background rounded-3xl h-[50rem] border-[0.01rem] border-muted-text/30 shadow-[0_0_20px_color-mix(in_srgb,var(--button-tournament)_10%,transparent)]">
            <CardHeader className="flex items-center">
                <div className="bg-primary/30 rounded-[1rem] p-[2%] mr-[3%] bg-green-300 border border-primary border-2">
                    <Sparkles className="text-button-tournament" />
                </div>
                <CardTitle className="text-l font-white ">
                    Host Tournament
                    <CardDescription className="text-xsm">
                        <p className="text-muted-text">Configure your tournament</p>
                    </CardDescription>
                </CardTitle>

            </CardHeader>

            <hr className="w-[95%] self-center border-muted-text"></hr>

            {error.length > 0 &&
                <div className="">
                    {error}
                </div>
            }

            {status === "success" &&
                <div>
                    Tournament created successfully!
                </div>
            }

            <CardContent className="flex flex-col">
                {/* Title */}
                <div className="flex flex-col">
                    <p className="text-xs font-bold text-white uppercase pb-[1%]">
                        Tournament Title*
                    </p>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Algorithmic Showdown"
                        className="bg-match-box border-[0.01rem] border-muted-text/30 rounded-md h-[4rem] bg-primary/5 text-white"
                    />
                </div>

                {/* Mode */}
                <div className="flex flex-col">
                    <p className="text-xs font-bold text-white uppercase pb-[1%] pt-[3%]">
                        Tournament Mode*
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <label
                            className={`flex items-center justify-evenly rounded-xl cursor-pointer border-[0.01rem] border-muted-text/30
                                h-[5rem] p-[4%] w-[15rem]
                            ${mode === "math" ? "border-button-tournament bg-button-tournament/10"
                                    : "border-match-card bg-match-box"}`}
                        >
                            <Sigma className="text-primary mr-[3%]"></Sigma>
                            <p className="font-bold  w-[80%]" >Math & Logic</p>
                            <Input
                                type="radio"
                                name="tournament-mode"
                                value="math"
                                checked={mode === "math"}
                                onClick={() => setMode('math')}
                                className="accent-primary w-[1.5rem]"
                            />
                        </label>

                        <label
                            className={`flex items-center justify-evenly rounded-xl cursor-pointer border-[0.01rem] border-muted-text/30
                                h-[5rem] p-[4%] w-[15rem]
                            ${mode === "programming" ? "border-button-tournament bg-button-tournament/10"
                                    : "border-match-card bg-match-box"}`}
                        >
                            <CodeXml className="text-primary w-[2rem] mr-[3%]"></CodeXml>
                            <p className="font-bold w-[80%]" >Programming</p>
                            <Input
                                type="radio"
                                name="tournament-mode"
                                value="programming"
                                checked={mode === "programming"}
                                onClick={() => setMode('programming')}
                                className="accent-primary w-[1.5rem]"

                            />
                        </label>
                    </div>
                </div>
                <div className="grid grid-cols-2">
                    <div>
                        <p className="text-xs font-bold text-white uppercase pb-[1%] pt-[3%]">
                            Schedule Date*
                        </p>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div >

                    <div>
                        <p className="text-xs font-bold text-white uppercase pb-[1%] pt-[3%]">
                            Start Time*
                        </p>
                        <Input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                    </div>

                </div>

                <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white uppercase pb-[1%] pt-[3%]">
                        Required minimum 8 players to start tournament*
                    </p>

                    <div className="flex items-center  bg-match-box border border-match-card rounded-xl">
                        <Button
                            type="button"
                            onClick={() => setPlayers(Math.max(8, players - 1))}
                            className="rounded-lg bg-match-card"
                        >
                            -
                        </Button>

                        <span className="font-mono font-bold text-center">
                            {players}
                        </span>

                        <Button
                            type="button"
                            onClick={() => setPlayers(Math.min(32, players + 1))}
                            className="rounded-lg bg-match-card"
                        >
                            +
                        </Button>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between">
                <Button
                    type="button"
                    onClick={Cancel}
                    className="rounded-3xl"
                    variant={"outline"}
                    disabled={status === "loading"}
                >
                    Cancel
                </Button>

                <Button
                    type="button"
                    onClick={handleCreate}
                    variant={"default"}
                    disabled={status === "loading" || status === "success"}
                >
                    {status === "loading" ?
                        "Creating..." : status === "success" ?
                            "Created" : "Create"}

                </Button>
            </CardFooter>
        </Card>
    )
}