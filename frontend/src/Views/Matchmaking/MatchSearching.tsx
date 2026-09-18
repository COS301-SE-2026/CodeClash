import Starfield from '@/components/ui/animations/Starfield';
import robot from 'src/assets/Robots/Pink_fighting.png';
import { MatchSearchingViewModelFunction } from 'src/ViewModels/Matchmaking/MatchSearchingViewModel';

import { Link } from 'react-router-dom';

const headingFont = { fontFamily: 'var(--heading)' };

const MatchSearching = () => {
  const { formattedTime, content, players} = MatchSearchingViewModelFunction();
  const leftPlayer = players.find((player) => player.side === 'left');

  return (
    <div className="relative w-full min-h-screen overflow-hidden" 
        style={{background: "radial-gradient(circle at 50% 12%, #b91551 0%, #850f3b 22%, #630b3c 34%, #0a0008 62%)"}}>
          <Starfield/>
      <div className="relative z-10 flex h-full flex-col items-center justify-between px-6 py-8 md:px-10 md:py-10">
        <div className="w-full text-center">
          <p
            className="score-display text-xl font-extrabold leading-none text-primary-text "
          >
            {formattedTime}
          </p>
          <h1
            className="mt-4 text-xl font-bold leading-none text-primary-text"
          >
            {content.title}
          </h1>
        </div>

        <div className="grid w-full max-w-5xl grid-cols-1 items-end gap-3 md:grid-cols-[1fr_auto_1fr]">
          <div className="flex flex-col items-center md:items-start">
            <img
              src={robot}
              alt={`${leftPlayer?.username ?? 'Player'} avatar`}
              className="w-[50%] drop-shadow-2xl md:w-[18rem] lg:w-[22rem]"
            />
            <div className="mt-0 text-center md:text-left">
              <p
                className="text-md font-bold leading-none text-primary-text"
              >
                {leftPlayer?.username}
              </p>
              <p
                className="mt-3 text-md font-bold leading-none text-primary-text"
              >
                {leftPlayer?.elo.toLocaleString()} ELO
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center pb-6 md:pb-24">
            <span
              className="text-3xl font-extrabold leading-none text-primary-text"
              style={headingFont}
            >
              {content.matchupLabel}
            </span>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <output
              className="flex h-[13rem] w-[13rem] items-center justify-center gap-3 md:h-[18rem] md:w-[18rem] lg:h-[22rem] lg:w-[22rem]"
              aria-label="Searching for opponent"
            >
              <span className="h-4 w-4 rounded-full bg-[#FCECDD] animate-pulse" />
              <span
                className="h-4 w-4 rounded-full bg-[#FCECDD] animate-pulse"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="h-4 w-4 rounded-full bg-[#FCECDD] animate-pulse"
                style={{ animationDelay: '300ms' }}
              />
            </output>
          </div>
        </div>

        <div className="flex items-center gap-3 w-[30%]">
          <Link to='/dashboard' className="btn btn-primary w-full group">
            <span>{content.cancelLabel}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MatchSearching;
