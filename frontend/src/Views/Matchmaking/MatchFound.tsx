import Starfield from '@/components/ui/animations/Starfield';
import pinkCelebrate from 'src/assets/Robots/pink_celebrate.png';
import { useMatchFound } from 'src/ViewModels/Matchmaking/MatchFoundViewModel';

import Loading from '@/components/shared/Loading';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

const MatchFound = () => {
  const { content, players, matchDetails, decline, accept, loading } =
    useMatchFound();

  useEffect(() => {
    console.log("found url", window.location.href);

    return () => {
      console.log("found unmount url", window.location.href);
    }
  })

  if (!players) {
    return (
      <Loading></Loading>
    )
  }

  const leftPlayer = players.find((player) => player.side === 'left');
  const rightPlayer = players.find((player) => player.side === 'right');

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-background"
      style={{ background: "radial-gradient(circle at 50% 12%, #b91551 0%, #850f3b 22%, #630b3c 34%, #0a0008 62%)" }}>
      <Starfield />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-16">
        <div className="w-full text-center">
          <h1
            className="text-xl font-bold leading-none text-primary-text"
          >
            {content.title}
          </h1>
        </div>

        <div className="grid w-full max-w-5xl grid-cols-1 items-end gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-10 lg:gap-20">
          <div className="flex flex-col items-center md:items-start">
            <img
              src={pinkCelebrate}
              alt={`${leftPlayer?.username ?? 'Player'} avatar`}
              className="w-[14rem] drop-shadow-2xl md:w-[19rem] lg:w-[23rem]"
            />
            <div className="mt-1 text-center md:text-left">
              <p
                className="text-md font-bold leading-none text-primary-text"
              >
                {leftPlayer?.username}
              </p>
              <p
                className="mt-2 text-md font-bold leading-none text-primary-text"
              >
                {leftPlayer?.elo.toLocaleString()} ELO
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:pb-24">
            <span
              className="text-3xl font-extrabold leading-none text-primary-text"
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
            <div className="mt-1 text-center md:text-right">
              <p
                className="text-md font-bold leading-none text-primary-text"
              >
                {rightPlayer?.username}
              </p>
              <p
                className="mt-2 text-md font-bold leading-none text-primary-text"
              >
                {rightPlayer?.elo.toLocaleString()} ELO
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[42rem]">
          <div className="rounded-[2rem] border border-border px-8 py-7 backdrop-blur-[18px] shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
            <div className="flex flex-col gap-6">
              {matchDetails?.map((detail) => (
                <div
                  key={detail.label}
                  className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center md:gap-8"
                >
                  <span
                    className="text-sm font-semibold text-primary-text"
                  >
                    {detail.label}
                  </span>
                  <span
                    className="text-sm font-bold text-primary-text"
                  >
                    -
                  </span>
                  <span
                    className="text-sm font-bold text-primary-text"
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
            className='btn btn-primary w-[30%] h-[60px] group'
          >
            {content.declineLabel}
          </Button>

          <Button
            type="button"
            onClick={accept}
            className='btn btn-secondary w-[30%] h-[60px] group'
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