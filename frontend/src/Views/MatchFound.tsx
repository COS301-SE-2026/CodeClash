import mercuryBackground from '../assets/Planets/double-mercury-background.png';
import pinkCelebrate from '../assets/Robots/pink_celebrate.png';
import { MatchFoundViewModelFunction } from '../ViewModels/MatchFoundViewModel';

import Loading from '@/components/shared/Loading';
import { Button } from '@/components/ui/button';

const headingFont = { fontFamily: 'var(--heading)' };

const actionButtonClass =
  'h-auto min-w-[18rem] cursor-pointer rounded-[1.75rem] px-8 py-4 text-[1.75rem] font-bold shadow-[0_18px_40px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 md:min-w-[24rem] md:text-[2rem]';

const MatchFound = () => {
  const { content, players, details, decline, accept, loading } =
    MatchFoundViewModelFunction();

  if (!players) {
    return (
      <Loading></Loading>
    )
  }

  const leftPlayer = players.find((player) => player.side === 'left');
  const rightPlayer = players.find((player) => player.side === 'right');

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#14050C] text-white">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at top, rgba(79, 16, 38, 0.94) 0%, rgba(27, 6, 14, 0.98) 48%, rgba(10, 2, 6, 1) 100%)',
        }}
      />

      <img
        src={mercuryBackground}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-[center_62%] opacity-55"
      />

      <div className="relative z-10 flex flex-col items-center justify-between ">
        <div className="w-full text-center">
          <h1
            className="text-[2.4rem] font-bold leading-none text-[#FCECDD] md:text-[4rem] lg:text-[4.5rem]"
            style={headingFont}
          >
            {content.title}
          </h1>
        </div>

        <div className="grid w-full max-w-7xl grid-cols-1 items-end gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-10 lg:gap-20">
          <div className="flex flex-col items-center md:items-start">
            <img
              src={pinkCelebrate}
              alt={`${leftPlayer?.username ?? 'Player'} avatar`}
              className="w-[14rem] drop-shadow-2xl md:w-[19rem] lg:w-[23rem]"
            />
            <div className="mt-5 text-center md:text-left">
              <p
                className="text-[2.8rem] font-bold leading-none text-white md:text-[3.5rem]"
                style={headingFont}
              >
                {leftPlayer?.username}
              </p>
              <p
                className="mt-4 text-[2.9rem] font-bold leading-none text-white md:text-[3.9rem]"
                style={headingFont}
              >
                {leftPlayer?.elo.toLocaleString()} ELO
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center pb-6 md:pb-24">
            <span
              className="text-[5rem] font-extrabold leading-none text-[#FCECDD] md:text-[6.5rem] lg:text-[7.25rem]"
              style={headingFont}
            >
              {content.matchupLabel}
            </span>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <img
              src={pinkCelebrate}
              alt={`${rightPlayer?.username ?? 'Opponent'} avatar`}
              className="w-[14rem] drop-shadow-2xl md:w-[19rem] lg:w-[23rem]"
              style={{ transform: 'scaleX(-1)' }}
            />
            <div className="mt-5 text-center md:text-right">
              <p
                className="text-[2.8rem] font-bold leading-none text-white md:text-[3.5rem]"
                style={headingFont}
              >
                {rightPlayer?.username}
              </p>
              <p
                className="mt-4 text-[2.9rem] font-bold leading-none text-white md:text-[3.9rem]"
                style={headingFont}
              >
                {rightPlayer?.elo.toLocaleString()} ELO
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[54rem]">
          <div className="rounded-[2rem] border border-white/15 bg-white/14 px-8 py-7 backdrop-blur-[18px] shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
            <div className="flex flex-col gap-6">
              {details.map((detail) => (
                <div
                  key={detail.label}
                  className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center md:gap-8"
                >
                  <span
                    className="text-[1.35rem] font-semibold text-[#E8D7CF] md:text-[1.75rem]"
                    style={headingFont}
                  >
                    {detail.label}
                  </span>
                  <span
                    className="text-[1.35rem] font-bold text-[#FCECDD] md:text-[1.75rem]"
                    style={headingFont}
                  >
                    -
                  </span>
                  <span
                    className="text-[1.45rem] font-bold text-white md:text-[1.85rem]"
                    style={headingFont}
                  >
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-5 pt-6 md:flex-row md:gap-8">
          <Button
            type="button"
            onClick={decline}
            className={`${actionButtonClass} bg-[#F8EBDD] text-[#8C2945] hover:bg-[#F2DFCA]`}
          >
            {content.declineLabel}
          </Button>

          <Button
            type="button"
            onClick={accept}
            className={`${actionButtonClass} bg-[#B64662] text-white hover:bg-[#A43A55]`}
          >
            {content.acceptLabel}
          </Button>
        </div>
      </div>


      {loading && <Loading isOpen={loading} ></Loading>}
    </div>
  );
};

export default MatchFound;