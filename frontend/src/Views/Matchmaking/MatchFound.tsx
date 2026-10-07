import Starfield from '@/components/ui/animations/Starfield';
import { useMatchFound } from 'src/ViewModels/Matchmaking/MatchFoundViewModel';

import Loading from '@/components/shared/Loading';
import { Button } from '@/components/ui/button';
import PlayerAvatar from 'src/avatar/PlayerAvatar';
import { resolve } from 'src/assets/Shop/ResolveShopImages';

const MatchFound = () => {
  const { content, players, rightPlayerAvatar, leftPlayerAvatar, matchDetails, decline, accept, loading } =
    useMatchFound();

    console.log("leftPlayerAvatar", leftPlayerAvatar)


  if (!players) {
    return (
      <Loading></Loading>
    )
  }

  const leftPlayer = players.find((player) => player.side === 'left');
  const rightPlayer = players.find((player) => player.side === 'right');

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-background bg-radial-glow">
          <Starfield/>

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
            <PlayerAvatar
              assetKey={resolve(leftPlayerAvatar ?? "") ?? ""}
              size={250}
              className="size-[14rem] drop-shadow-2xl md:w-[19rem] lg:w-[23rem] md:-ml-20"
            />
            <div className="mt-1 text-center md:text-left">
              <p
                className="text-sm font-bold leading-none text-primary-text"
              >
                {leftPlayer?.username}
              </p>
              <p
                className="mt-2 text-sm font-bold leading-none text-primary-text"
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
            <PlayerAvatar
              assetKey={resolve(rightPlayerAvatar ?? "") ?? ""}
              size={250}
              className="w-[14rem] drop-shadow-2xl md:w-[19rem] lg:w-[23rem] md:-mr-20"
            />
            <div className="mt-1 text-center md:text-right">
              <p
                className="text-sm font-bold leading-none text-primary-text"
              >
                {rightPlayer?.username}
              </p>
              <p
                className="mt-2 text-sm font-bold leading-none text-primary-text"
              >
                {rightPlayer?.elo.toLocaleString()} ELO
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[42rem] -mt-5">
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

        <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-5 pt-6 md:flex-row md:gap-8 -mt-5">
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