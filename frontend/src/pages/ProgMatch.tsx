import React, { useState, useEffect, useRef } from "react";
import { Editor } from "@monaco-editor/react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useTimer } from "react-timer-hook";
import { Question } from "@/components/features/question";
import blue_avatar from "../assets/blue_avatar.jpeg";
import puprle_avatar from "../assets/purple_avatar.jpeg";
import type { QuestionDTO, MatchDTO } from "src/types/question.dto";
import { mock_questions } from "../mocks/prog-questions.mock";
import { MatchProgress } from "@/components/features/match-progress";
import { Button } from "@/components/ui/button";

interface ProgMatchProps {
  language: string;
  match: MatchDTO;
  back: () => void;
}

const ProgMatch: React.FC<ProgMatchProps> = ({ language, back }) => {
  const [player_1_life, set_player_1_life] = useState(90);
  const [player_2_life, set_player_2_life] = useState(100);

  function handleChange(value: any) {
    const answered = [...input];
    answered[q_index] = value;

    set_input(answered);
  }

  // Countdown
  const [duration, set_duration] = useState<number>(5);

  const expiryTime = () => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + duration * 60);
    return time;
  };

  const { seconds, minutes } = useTimer({ expiryTimestamp: expiryTime() });

  //code editor
  const editorRef = useRef<any>(null);
  const default_value = "// Your code here";

  // questions
  const [questions, set_questions] = useState<QuestionDTO[]>();
  const [q_index, set_q_index] = useState(0);
  const [difficulty, set_difficulty] = useState<"easy" | "medium" | "hard">(
    "easy",
  );
  const [title, set_title] = useState("");
  const [question, set_question] = useState("");
  const [description, set_description] = useState("");

  // initialise questions
  useEffect(() => {
    set_questions(mock_questions);

    const q_1 = mock_questions[0];
    set_q_index(0);
    set_difficulty(q_1.difficulty);
    set_title(q_1.title);
    set_question(q_1.question);
    set_description(q_1.description ?? "");
  }, []);

  function updateQuestion(q_idx: number) {
    if (typeof questions !== "undefined") {
      if (q_idx >= question.length) set_player_1_done(true);
      else if (q_idx < 0) return;
      else {
        const q = questions[q_idx];
        set_q_index(q_idx);
        set_difficulty(q.difficulty);
        set_title(q.title);
        set_question(q.question);
        set_description(q.description ?? "");

        // clear editor
        editorRef.current?.setValue(input[q_idx] ?? default_value);
      }
    }
  }

  // match progress
  const [player_1_progress, set_player_1_progress] = useState(0);
  const [player_2_progress, set_player_2_progress] = useState(0);
  const [player_1_done, set_player_1_done] = useState(false);
  const [player_2_done, set_player_2_done] = useState(false);

  useEffect(() => {
    set_player_1_progress((q_index / (questions?.length ?? 1)) * 100);
  }, [q_index]);

  // Data sent to backend - NOT CONNECTED RIGHT NOW
  function submit() {
    // answered all questions
  }

  // user input
  const [input, set_input] = useState<string[]>(Array(questions?.length ?? 0));

  return (
    <div className="fixed inset-0 flex flex-rowjustify-evenly">
      <div className="flex flex-col w-[80%] m-2 justify-between">
        <Button
          active={true}
          onClick={back}
          className="w-[15%] absolute left-5"
          variant={"outline"}
        >
          Exit
        </Button>
        {/* header */}
        <div className="flex w-full h-[20%] justify-between items-center m-1 p-2">
          {/* Player 1 Progress */}
          <div className="w-[40%] flex flex-col items-start h-[60%] justify-center self-end ">
            <Progress
              className=" w-full h-7 shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
              value={player_1_life}
              progress_colour="#5f5980"
            ></Progress>
            <div className="flex w-[50%] h-[60%] items-center m-2">
              <img
                src={blue_avatar}
                alt="user one avatar"
                className="h-[120%] flex items-center"
              ></img>
              <Badge className="bg-white badge-font">User 1</Badge>
            </div>
          </div>

          {/* Clock */}
          <div className="w-[15%] h-20 flex items-center justify-center text-4xl font-semibold border-b-1 border-t-1 rounded-2xl">
            <span>
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </span>
          </div>

          {/* Player 2 Progress */}
          <div className="w-[40%] flex flex-col items-end h-[60%] justify-center self-end ">
            <Progress
              className=" w-full h-7 scale-x-[-1] shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
              value={player_2_life}
              progress_colour="#5f5980"
            ></Progress>
            <div className="flex w-[50%] h-[60%] items-center justify-end m-2">
              <Badge className="bg-white badge-font">User 2</Badge>
              <img
                src={puprle_avatar}
                alt="user one avatar"
                className="h-[120%] flex items-center "
              ></img>
            </div>
          </div>
        </div>

        {/* Question */}
        <Question
          className="relative z-0 "
          difficulty={difficulty}
          title={title}
          question={question}
          description={description}
          number={q_index + 1}
        >
          <div className="flex justify-center w-[95%]">
            <Editor
              height="40vh"
              width="100%"
              defaultLanguage={language}
              defaultValue={default_value}
              onChange={handleChange}
              onMount={(editor: any, monaco: any) => {
                editorRef.current = editor;
                monaco.editor.defineTheme("default", {
                  base: "vs",
                  inherits: true,
                  rules: [
                    {
                      token: "identifier",
                      foreground: "#000000",
                    },
                    {
                      token: "type",
                      foreground: "#1AAFB0",
                    },
                  ],
                  colors: {
                    "editor.background": "#c4c4c4",
                  },
                });
                monaco.editor.setTheme("default");
                editor.updateOptions({});
              }}
            />
          </div>
          <div className="mt-5  flex justify-center w-[95%]">
            {q_index > 0 && (
              <Button
                active={true}
                className="w-[15%] absolute left-5"
                variant={"outline"}
                onClick={() => updateQuestion(q_index - 1)}
              >
                Back
              </Button>
            )}
            <Button
              active={
                (input[q_index]?.trim().length ?? 0) > 0 &&
                input[q_index]?.trim() !== "// Your code here"
              }
              className="w-[20%] flex self-center"
              onClick={() => updateQuestion(q_index + 1)}
            >
              Submit
            </Button>
          </div>
        </Question>
      </div>

      <MatchProgress
        questions={questions ?? []}
        avatar={blue_avatar}
        opponent={puprle_avatar}
        progress={q_index}
        opponent_progress={player_2_progress}
        done={player_1_done}
        opponent_done={player_2_done}
      ></MatchProgress>
    </div>
  );
};

export default ProgMatch;
