import { Composition } from 'remotion';

import { durationOf, Promo } from './Promo';

/** 1080×1920 dikey (Reels / Shorts / TikTok / WhatsApp durum), 30 fps. */
export function Root() {
  return (
    <>
      <Composition
        id="Promo30"
        component={Promo}
        durationInFrames={durationOf('30')}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ variant: '30' as const }}
      />
      <Composition
        id="Promo15"
        component={Promo}
        durationInFrames={durationOf('15')}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ variant: '15' as const }}
      />
    </>
  );
}
