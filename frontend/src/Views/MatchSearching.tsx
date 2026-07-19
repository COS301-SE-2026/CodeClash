import robot from '../assets/Robots/Pink_fighting.png';
import mercuryBackground from '../assets/Planets/double-mercury-background.png';
import { Button } from '@/components/ui/button';
import { MatchSearchingViewModelFunction, useSearch } from '../ViewModels/MatchSearchingViewModel';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const headingFont = { fontFamily: 'var(--heading)' };

const MatchSearching = () => {
  const { formattedTime, content, players, handleCancel } = MatchSearchingViewModelFunction();
  const {matched} = useSearch();

  const leftPlayer = players.find((player) => player.side === 'left');
  const nav = useNavigate();
  useEffect(() => {
    if (matched) {
      nav('/match-found')
    }

  }, [matched, nav])


  return (
    <div className="relative min-h-screen overflow-hidden bg-[#14050C] text-white">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at top, rgba(79, 16, 38, 0.96) 0%, rgba(27, 6, 14, 0.98) 44%, rgba(10, 2, 6, 1) 100%)',
        }}
      />

      <img
        src={mercuryBackground}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_65%] opacity-55"
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-between px-6 py-8 md:px-10 md:py-10">
        <div className="w-full text-center">
          <p
            className="text-[4rem] font-extrabold leading-none text-[#FCECDD] md:text-[5.5rem] lg:text-[6.5rem]"
            style={headingFont}
          >
            {formattedTime}
          </p>
          <h1
            className="mt-3 text-[2.25rem] font-bold leading-none text-[#FCECDD] md:text-[3.5rem] lg:text-[4.25rem]"
            style={headingFont}
          >
            {content.title}
          </h1>
        </div>

        <div className="grid w-full max-w-7xl grid-cols-1 items-end gap-8 md:grid-cols-[1fr_auto_1fr] md:gap-10 lg:gap-16">
          <div className="flex flex-col items-center md:items-start">
            <img
              src={robot}
              alt={`${leftPlayer?.username ?? 'Player'} avatar`}
              className="w-[13rem] drop-shadow-2xl md:w-[18rem] lg:w-[22rem]"
            />
            <div className="mt-4 text-center md:text-left">
              <p
                className="text-[2.75rem] font-bold leading-none text-white md:text-[3.5rem]"
                style={headingFont}
              >
                {leftPlayer?.username}
              </p>
              <p
                className="mt-3 text-[2.5rem] font-bold leading-none text-white md:text-[3rem]"
                style={headingFont}
              >
                {leftPlayer?.elo.toLocaleString()} ELO
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center pb-6 md:pb-24">
            <span
              className="text-[4.5rem] font-extrabold leading-none text-[#FCECDD] md:text-[6rem] lg:text-[7rem]"
              style={headingFont}
            >
              {content.matchupLabel}
            </span>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <div
              className="flex h-[13rem] w-[13rem] items-center justify-center gap-3 md:h-[18rem] md:w-[18rem] lg:h-[22rem] lg:w-[22rem]"
              role="status"
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
            </div>
          </div>
        </div>

        <div className="flex w-full justify-center pt-6 md:pt-10">
          <Button
            type="button"
            onClick={handleCancel}
            className="h-auto min-w-[18rem] rounded-[1.75rem] bg-button-primary px-10 py-4 text-[1.9rem] font-bold text-white hover:scale-100 hover:bg-[#B13A5B] md:min-w-[28rem]"
          >
            {content.cancelLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchSearching;
