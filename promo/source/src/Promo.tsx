import type { ReactNode } from 'react';
import { AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

import {
  CountPickerScreen,
  GrammarScreen,
  HomeScreen,
  LearnScreen,
  NotificationBanner,
  QuizScreen,
  ResultScreen,
  StoryScreen,
  WritingScreen,
} from './screens';
import { dark, fontFamily, light } from './theme';
import { AuroraBackground, Caption, Phone } from './ui';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

type Scene = { duration: number; render: () => ReactNode };
type CaptionSpan = { from: number; duration: number; title: string; subtitle?: string };
type Timeline = { intro: number; outro: number; scenes: Scene[]; captions: CaptionSpan[] };

/** Telefon içindeki ekranların arka arkaya, yumuşak geçişle gösterilmesi. */
function FadeIn({ children }: { children: ReactNode }) {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 6], [0, 1], clamp);
  const x = interpolate(frame, [0, 8], [24, 0], clamp);
  return <AbsoluteFill style={{ opacity, transform: `translateX(${x}px)` }}>{children}</AbsoluteFill>;
}

function ThemeAndNotification({ themeTapAt, notificationAt }: { themeTapAt: number; notificationAt: number }) {
  const frame = useCurrentFrame();
  const lightness = interpolate(frame, [themeTapAt + 2, themeTapAt + 12], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - lightness }}>
        <HomeScreen palette={dark} mode="system" themeTapAt={themeTapAt} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: lightness }}>
        <HomeScreen palette={light} mode="light" />
      </AbsoluteFill>
      <NotificationBanner at={notificationAt} palette={light} />
    </AbsoluteFill>
  );
}

const sum = (scenes: Scene[]) => scenes.reduce((total, scene) => total + scene.duration, 0);

const TIMELINES: Record<'30' | '15', Timeline> = {
  '30': {
    intro: 75,
    outro: 90,
    scenes: [
      { duration: 120, render: () => <HomeScreen tapAt={95} /> },
      { duration: 60, render: () => <CountPickerScreen tapAt={30} /> },
      { duration: 105, render: () => <LearnScreen speakAt={20} /> },
      { duration: 90, render: () => <QuizScreen tapAt={35} /> },
      { duration: 105, render: () => <WritingScreen word="ability" typeStart={10} typeEnd={60} checkAt={72} /> },
      { duration: 75, render: () => <ResultScreen /> },
      { duration: 55, render: () => <GrammarScreen /> },
      { duration: 55, render: () => <StoryScreen revealAt={18} /> },
      { duration: 70, render: () => <ThemeAndNotification themeTapAt={12} notificationAt={34} /> },
    ],
    captions: [
      { from: 0, duration: 120, title: 'Her gün 5 dakika', subtitle: 'Kelime · Gramer · Hikaye' },
      { from: 120, duration: 165, title: 'Dinle ve öğren 🔊', subtitle: 'Oxford 3000 kelime, Türkçe anlamlarıyla' },
      { from: 285, duration: 195, title: '3 testle pekiştir', subtitle: 'Seç · Yaz · Tersine çevir' },
      { from: 480, duration: 75, title: 'İlerlemen kaydedilir 🏆', subtitle: 'Öğrendiğin her kelime listende' },
      { from: 555, duration: 110, title: 'Gramer ve hikayeler', subtitle: "A1'den C2'ye 120 hikaye" },
      { from: 665, duration: 70, title: 'Unutma, tekrar et 🔔', subtitle: 'Aralıklı tekrar · Açık/Koyu tema' },
    ],
  },
  '15': {
    intro: 45,
    outro: 60,
    scenes: [
      { duration: 70, render: () => <HomeScreen tapAt={52} /> },
      { duration: 40, render: () => <CountPickerScreen tapAt={20} /> },
      { duration: 70, render: () => <LearnScreen speakAt={14} /> },
      { duration: 55, render: () => <QuizScreen tapAt={20} /> },
      { duration: 60, render: () => <WritingScreen word="ability" typeStart={6} typeEnd={36} checkAt={44} /> },
      { duration: 50, render: () => <ResultScreen /> },
    ],
    captions: [
      { from: 0, duration: 70, title: 'Her gün 5 dakika', subtitle: 'Kelime · Gramer · Hikaye' },
      { from: 70, duration: 110, title: 'Dinle ve öğren 🔊' },
      { from: 180, duration: 115, title: '3 testle pekiştir', subtitle: 'Seç · Yaz · Tersine çevir' },
      { from: 295, duration: 50, title: 'İlerlemen kaydedilir 🏆' },
    ],
  },
};

export const durationOf = (variant: '30' | '15') => {
  const t = TIMELINES[variant];
  return t.intro + sum(t.scenes) + t.outro;
};

function Logo({ size }: { size: number }) {
  return <Img src={staticFile('logo.png')} style={{ width: size, height: size }} />;
}

function Intro({ duration }: { duration: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12 } });
  const text = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const exit = interpolate(frame, [duration - 10, duration], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', fontFamily, opacity: exit }}>
      <div style={{ transform: `scale(${pop}) rotate(${(1 - pop) * -40}deg)` }}>
        <Logo size={420} />
      </div>
      <div style={{ marginTop: 10, textAlign: 'center', opacity: text, transform: `translateY(${(1 - text) * 30}px)` }}>
        <div style={{ fontSize: 110, fontWeight: 800, color: '#fff', letterSpacing: -4 }}>English Words</div>
        <div style={{ fontSize: 40, fontWeight: 600, color: 'rgba(228,228,255,0.75)', marginTop: 10 }}>
          İngilizceyi her gün biraz daha sev.
        </div>
      </div>
    </AbsoluteFill>
  );
}

function Outro() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14 } });
  const text = spring({ frame: frame - 8, fps, config: { damping: 200 } });
  const credit = interpolate(frame, [20, 34], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', fontFamily }}>
      <div style={{ transform: `scale(${pop})` }}>
        <Logo size={360} />
      </div>
      <div style={{ textAlign: 'center', opacity: text, transform: `translateY(${(1 - text) * 30}px)` }}>
        <div style={{ fontSize: 104, fontWeight: 800, color: '#fff', letterSpacing: -4 }}>English Words</div>
        <div style={{ fontSize: 40, fontWeight: 600, color: 'rgba(228,228,255,0.8)', marginTop: 8 }}>Kelime · Gramer · Hikaye</div>
        <div
          style={{
            display: 'inline-block',
            marginTop: 50,
            padding: '24px 56px',
            borderRadius: 999,
            background: 'linear-gradient(135deg, #8B5CFF, #FF5CAA)',
            color: '#fff',
            fontSize: 44,
            fontWeight: 800,
            boxShadow: '0 20px 60px rgba(255,92,170,0.45)',
          }}>
          Hemen başla 🚀
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 90, fontSize: 30, fontWeight: 500, letterSpacing: 4, color: 'rgba(228,228,255,0.55)', opacity: credit }}>
        made by dme
      </div>
    </AbsoluteFill>
  );
}

/** Telefon: uygulama bölümünün başında aşağıdan kayarak gelir, sonunda kaybolur. */
function AppSegment({ timeline }: { timeline: Timeline }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = sum(timeline.scenes);
  const enter = spring({ frame, fps, config: { damping: 18 } });
  const exit = interpolate(frame, [total - 10, total], [1, 0], clamp);
  let from = 0;
  return (
    <AbsoluteFill style={{ opacity: exit }}>
      {timeline.captions.map((caption) => (
        <Sequence key={caption.from} from={caption.from} durationInFrames={caption.duration}>
          <Caption title={caption.title} subtitle={caption.subtitle} duration={caption.duration} />
        </Sequence>
      ))}
      <AbsoluteFill style={{ transform: `translateY(${(1 - enter) * 900}px)` }}>
        <Phone>
          {timeline.scenes.map((scene, index) => {
            const start = from;
            from += scene.duration;
            return (
              <Sequence key={index} from={start} durationInFrames={scene.duration} layout="none">
                <FadeIn>{scene.render()}</FadeIn>
              </Sequence>
            );
          })}
        </Phone>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

export function Promo({ variant }: { variant: '30' | '15' }) {
  const timeline = TIMELINES[variant];
  const appFrames = sum(timeline.scenes);
  return (
    <AbsoluteFill>
      <AuroraBackground />
      <Sequence durationInFrames={timeline.intro}>
        <Intro duration={timeline.intro} />
      </Sequence>
      <Sequence from={timeline.intro} durationInFrames={appFrames}>
        <AppSegment timeline={timeline} />
      </Sequence>
      <Sequence from={timeline.intro + appFrames} durationInFrames={timeline.outro}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
}
