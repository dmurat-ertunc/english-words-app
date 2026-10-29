import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

import { dark, fontFamily, SCREEN, type Palette } from './theme';

/** Videonun tamamının arkasındaki yavaşça süzülen aurora ışıkları. */
export function AuroraBackground() {
  const frame = useCurrentFrame();
  const orb = (color: string, size: number, x: number, y: number, speed: number, phase: number): CSSProperties => ({
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: '50%',
    left: x + Math.sin(frame / speed + phase) * 40,
    top: y + Math.cos(frame / speed + phase) * 30,
    background: color,
    filter: 'blur(120px)',
  });
  return (
    <AbsoluteFill style={{ background: dark.background, overflow: 'hidden' }}>
      <div style={orb('rgba(139, 92, 255, 0.55)', 760, -220, -160, 70, 0)} />
      <div style={orb('rgba(255, 92, 170, 0.40)', 640, 600, 760, 85, 2)} />
      <div style={orb('rgba(34, 211, 255, 0.30)', 700, -260, 1320, 95, 4)} />
    </AbsoluteFill>
  );
}

/** Sahne üstündeki büyük slogan; yumuşakça belirip kaybolur. */
export function Caption({ title, subtitle, duration }: { title: string; subtitle?: string; duration: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200 } });
  const exit = interpolate(frame, [duration - 8, duration], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div
      style={{
        position: 'absolute',
        top: 70,
        width: '100%',
        textAlign: 'center',
        fontFamily,
        opacity: enter * exit,
        transform: `translateY(${(1 - enter) * 30}px)`,
      }}>
      <div style={{ fontSize: 62, fontWeight: 800, color: '#fff', letterSpacing: -1.5, lineHeight: 1.1 }}>{title}</div>
      {subtitle && (
        <div style={{ marginTop: 14, fontSize: 32, fontWeight: 600, color: 'rgba(228,228,255,0.75)' }}>{subtitle}</div>
      )}
    </div>
  );
}

const PHONE_SCALE = 1.9;
const BEZEL = 14;

/** Telefon çerçevesi; içerik uygulamadaki mantıksal ölçülerle (390×844) çizilip büyütülür. */
export function Phone({ children, palette = dark, offsetY = 0 }: { children: ReactNode; palette?: Palette; offsetY?: number }) {
  const width = SCREEN.width * PHONE_SCALE + BEZEL * 2;
  const height = SCREEN.height * PHONE_SCALE + BEZEL * 2;
  return (
    <div
      style={{
        position: 'absolute',
        left: (1080 - width) / 2,
        top: 250 + offsetY,
        width,
        height,
        borderRadius: 96,
        padding: BEZEL,
        background: 'linear-gradient(160deg, #2b2b40, #0d0d18)',
        boxShadow: '0 60px 140px rgba(0,0,0,0.55), 0 0 0 2px rgba(255,255,255,0.08)',
      }}>
      <div
        style={{
          width: SCREEN.width * PHONE_SCALE,
          height: SCREEN.height * PHONE_SCALE,
          borderRadius: 84,
          overflow: 'hidden',
          position: 'relative',
          background: palette.background,
        }}>
        <div
          style={{
            width: SCREEN.width,
            height: SCREEN.height,
            transform: `scale(${PHONE_SCALE})`,
            transformOrigin: 'top left',
            position: 'relative',
            fontFamily,
            color: palette.text,
          }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Parmak dokunuşu: beyaz nokta + dışa doğru yayılan halka. x/y verilmezse dokunulan öğenin
 * (position: relative) tam ortasına yerleşir.
 */
export function Tap({ x, y, at }: { x?: number; y?: number; at: number }) {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < -10 || t > 22) return null;
  const appear = interpolate(t, [-10, 0], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const press = t >= 0 ? interpolate(t, [0, 4, 10], [1, 0.8, 1], { extrapolateRight: 'clamp' }) : 1;
  const ring = interpolate(t, [0, 18], [0.6, 2.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ringOpacity = interpolate(t, [0, 18], [0.7, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fade = interpolate(t, [14, 22], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div
      style={{
        position: 'absolute',
        left: x === undefined ? 'calc(50% - 22px)' : x - 22,
        top: y === undefined ? 'calc(50% - 22px)' : y - 22,
        width: 44,
        height: 44,
        zIndex: 50,
        pointerEvents: 'none',
      }}>
      {t >= 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid rgba(255,255,255,0.9)',
            transform: `scale(${ring})`,
            opacity: ringOpacity,
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          inset: 6,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.85)',
          boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
          transform: `scale(${press})`,
          opacity: appear * fade,
        }}
      />
    </div>
  );
}

/** Basit durum çubuğu (saat ve simgeler). */
export function StatusBar({ palette }: { palette: Palette }) {
  return (
    <div
      style={{
        height: 36,
        padding: '10px 26px 0',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 13,
        fontWeight: 700,
        color: palette.text,
      }}>
      <span>9:41</span>
      <span style={{ letterSpacing: 2 }}>▮▮▮ ◔ ▰</span>
    </div>
  );
}

/** Üst çubuk: solda geri/selam, sağda tema seçici (uygulamadaki Screen bileşeni gibi). */
export function TopBar({
  palette,
  left,
  right,
  mode = 'system',
  lightTapAt,
}: {
  palette: Palette;
  left?: ReactNode;
  right?: ReactNode;
  mode?: 'system' | 'light' | 'dark';
  /** ☀️ (açık tema) düğmesine dokunuş anı. */
  lightTapAt?: number;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 24px 4px', minHeight: 44 }}>
      <div>{left}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {right}
        <div style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 999, background: palette.element, border: `1px solid ${palette.border}` }}>
          {(['📱', '☀️', '🌙'] as const).map((emoji, i) => {
            const selected = ['system', 'light', 'dark'][i] === mode;
            return (
              <div
                key={emoji}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  opacity: selected ? 1 : 0.45,
                  background: selected ? palette.selected : 'transparent',
                  border: selected ? `1px solid ${palette.violet}` : '1px solid transparent',
                  position: 'relative',
                }}>
                {i === 1 && lightTapAt !== undefined && <Tap at={lightTapAt} />}
                {emoji}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function BackButton({ palette }: { palette: Palette }) {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 999,
        background: palette.element,
        border: `1px solid ${palette.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: 700,
      }}>
      ←
    </div>
  );
}

export const glass = (palette: Palette, extra: CSSProperties = {}): CSSProperties => ({
  background: palette.element,
  border: `1px solid ${palette.border}`,
  borderRadius: 22,
  ...extra,
});

/** Değeri `from`→`to` arasında belirli karelerde sayarak artırır. */
export function useCountUp(to: number, start: number, end: number) {
  const frame = useCurrentFrame();
  return Math.round(interpolate(frame, [start, end], [0, to], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
}

/** Sahne içinde basılan bir öğenin küçülüp geri gelmesi. */
export function pressScale(frame: number, at: number) {
  return interpolate(frame, [at - 1, at + 3, at + 9], [1, 0.95, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
}
