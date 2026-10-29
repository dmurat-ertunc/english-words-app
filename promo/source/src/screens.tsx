import type { ReactNode } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

import { dark, gradients, type Palette } from './theme';
import { BackButton, glass, pressScale, StatusBar, Tap, TopBar, useCountUp } from './ui';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** Uygulamadaki Screen bileşeni: hafif aurora zemini + durum çubuğu + üst çubuk. */
function ScreenBase({
  palette = dark,
  back = false,
  left,
  right,
  mode,
  lightTapAt,
  children,
}: {
  palette?: Palette;
  back?: boolean;
  left?: ReactNode;
  right?: ReactNode;
  mode?: 'system' | 'light' | 'dark';
  lightTapAt?: number;
  children: ReactNode;
}) {
  const isDark = palette === dark;
  return (
    <div style={{ position: 'absolute', inset: 0, background: palette.background, color: palette.text, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          width: 260,
          height: 260,
          left: -90,
          top: -90,
          borderRadius: '50%',
          background: isDark ? 'rgba(139,92,255,0.35)' : 'rgba(139,92,255,0.18)',
          filter: 'blur(60px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 220,
          height: 220,
          right: -80,
          top: 360,
          borderRadius: '50%',
          background: isDark ? 'rgba(255,92,170,0.22)' : 'rgba(255,92,170,0.14)',
          filter: 'blur(60px)',
        }}
      />
      <div style={{ position: 'relative' }}>
        <StatusBar palette={palette} />
        <TopBar palette={palette} left={back ? <BackButton palette={palette} /> : left} right={right} mode={mode} lightTapAt={lightTapAt} />
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Ana sayfa

export function HomeScreen({
  palette = dark,
  mode = 'system',
  tapAt,
  themeTapAt,
}: {
  palette?: Palette;
  mode?: 'system' | 'light' | 'dark';
  tapAt?: number;
  themeTapAt?: number;
}) {
  const frame = useCurrentFrame();
  const learned = useCountUp(124, 8, 38);
  const streak = useCountUp(7, 14, 38);
  const stories = useCountUp(12, 20, 38);
  const cards = [
    { emoji: '📚', title: 'Kelime Çalış', stat: '2.936 kelime', bg: gradients.words },
    { emoji: '🧠', title: 'Grammer Çalış', stat: '46 konu', bg: gradients.grammar },
    { emoji: '📖', title: 'Hikayeler', stat: 'A1–C2 seviyeleri', bg: gradients.sunset },
  ];
  return (
    <ScreenBase
      palette={palette}
      mode={mode}
      lightTapAt={themeTapAt}
      left={
        <div style={{ ...glass(palette, { borderRadius: 999, padding: '8px 14px' }), fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: palette.textSecondary }}>
          👋 MERHABA, MURAT
        </div>
      }
      right={
        <div style={{ width: 36, height: 36, borderRadius: 999, background: 'rgba(139,92,255,0.25)', border: '1px solid rgba(139,92,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: palette.accentText }}>
          M
        </div>
      }>
      <div style={{ padding: '10px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1.12 }}>
          Bugün bir adım daha <span style={{ color: palette.pink }}>ileri.</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 500, color: palette.textSecondary, marginTop: -6 }}>
          Günde sadece 5 dakika. Farkı bir haftada hissedeceksin.
        </div>
        <div style={{ ...glass(palette, { borderRadius: 18, display: 'flex', padding: '14px 6px' }) }}>
          {[
            ['📚', learned, 'kelime öğrendin ›', palette.violet],
            ['🔥', streak, 'günlük seri', palette.amber],
            ['📖', stories, 'hikaye okudun', palette.cyan],
          ].map(([emoji, value, label, color], i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', borderLeft: i ? `1px solid ${palette.border}` : 'none' }}>
              <div style={{ fontSize: 18 }}>{emoji}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: color as string }}>{value}</div>
              <div style={{ fontSize: 11, color: palette.textSecondary }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ ...glass(palette, { borderRadius: 18, padding: '10px 16px', display: 'flex', gap: 12, alignItems: 'center' }) }}>
          <span style={{ fontSize: 18 }}>☀️</span>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.4, color: palette.amber }}>GÜNÜN KELİMESİ</div>
            <div style={{ fontSize: 14 }}>
              <b>journey</b> <span style={{ color: palette.textSecondary }}> · yolculuk</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cards.map((card, i) => (
            <div
              key={card.title}
              style={{
                background: card.bg,
                borderRadius: 18,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                boxShadow: '0 10px 28px rgba(139,92,255,0.25)',
                transform: i === 0 && tapAt !== undefined ? `scale(${pressScale(frame, tapAt)})` : undefined,
                position: 'relative',
              }}>
              {i === 0 && tapAt !== undefined && <Tap at={tapAt} />}
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                {card.emoji}
              </div>
              <div style={{ flex: 1, color: '#fff' }}>
                <div style={{ fontSize: 17, fontWeight: 700 }}>{card.title}</div>
                <div style={{ fontSize: 13, opacity: 0.85 }}>{card.stat}</div>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: 999, background: '#fff', color: '#07071A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                →
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScreenBase>
  );
}

// ---------------------------------------------------------------- Kelime çalışma modalları

function ModalCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 390, height: 844, background: 'rgba(3,3,15,0.82)', padding: '96px 16px 16px', boxSizing: 'border-box', zIndex: 10 }}>
      <div
        style={{
          width: '100%',
          borderRadius: 30,
          padding: 22,
          background: dark.surface,
          border: `1px solid ${dark.border}`,
          boxShadow: '0 30px 80px rgba(139,92,255,0.30)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.4, color: dark.textSecondary }}>{label}</span>
          <span style={{ width: 30, height: 30, borderRadius: 999, background: dark.selected, display: 'flex', alignItems: 'center', justifyContent: 'center', color: dark.textSecondary, fontSize: 13 }}>
            ✕
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

function Progress({ label, index, total, value, color }: { label: string; index: number; total: number; value: number; color: string }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
        <span style={{ letterSpacing: 1.4, color: dark.textSecondary }}>{label}</span>
        <span>
          {index} <span style={{ color: dark.textFaint, fontWeight: 500 }}>/ {total}</span>
        </span>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: dark.selected, overflow: 'hidden' }}>
        <div style={{ width: `${value * 100}%`, height: '100%', background: color, borderRadius: 999 }} />
      </div>
    </div>
  );
}

function Speaker({ speakAt }: { speakAt?: number }) {
  const frame = useCurrentFrame();
  const speaking = speakAt !== undefined && frame >= speakAt + 3 && frame < speakAt + 45;
  const pulse = speaking ? 1 + Math.abs(Math.sin((frame - speakAt!) / 4)) * 0.12 : 1;
  return (
    <div style={{ position: 'relative' }}>
      {speakAt !== undefined && <Tap at={speakAt} />}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          background: speaking ? 'rgba(139,92,255,0.28)' : dark.selected,
          border: `1px solid ${speaking ? dark.violet : dark.border}`,
          transform: `scale(${pulse})`,
        }}>
        🔊
      </div>
      {speaking &&
        [0, 1, 2].map((i) => {
          const t = ((frame - speakAt! + i * 8) % 24) / 24;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 22 - 22 * (1 + t * 1.4),
                top: 22 - 22 * (1 + t * 1.4),
                width: 44 * (1 + t * 1.4),
                height: 44 * (1 + t * 1.4),
                borderRadius: 999,
                border: `2px solid ${dark.violet}`,
                opacity: 1 - t,
              }}
            />
          );
        })}
    </div>
  );
}

export function CountPickerScreen({ tapAt }: { tapAt: number }) {
  const frame = useCurrentFrame();
  const levels: [number, string, string][] = [
    [5, 'Isınma 🔥', gradients.words],
    [10, 'Normal ⚡', gradients.grammar],
    [15, 'Güçlü 💪', gradients.sunset],
    [20, 'Efsane 🏆', gradients.primary],
  ];
  return (
    <ScreenBase back>
      <ModalCard label="SEVİYENİ SEÇ">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1 }}>Kaç kelime?</div>
          <div style={{ fontSize: 13, color: dark.textSecondary }}>Küçük başla, her gün biraz daha büyüt.</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {levels.map(([count, label, bg]) => (
            <div
              key={count}
              style={{
                background: bg,
                borderRadius: 22,
                padding: '18px 0',
                textAlign: 'center',
                color: '#fff',
                transform: count === 10 ? `scale(${pressScale(frame, tapAt)})` : undefined,
                position: 'relative',
              }}>
              {count === 10 && <Tap at={tapAt} />}
              <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1 }}>{count}</div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.4, opacity: 0.85, marginTop: 4 }}>KELİME</div>
              <div style={{ display: 'inline-block', marginTop: 8, padding: '3px 12px', borderRadius: 999, background: 'rgba(0,0,0,0.2)', fontSize: 13, fontWeight: 700 }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </ModalCard>
    </ScreenBase>
  );
}

export function LearnScreen({ speakAt }: { speakAt: number }) {
  return (
    <ScreenBase back>
      <ModalCard label="ÖĞRENME">
        <Progress label="KELİME" index={1} total={10} value={0.1} color={gradients.words} />
        <div style={{ ...glass(dark, { borderRadius: 24, padding: '34px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1.5 }}>abandon</span>
            <Speaker speakAt={speakAt} />
          </div>
          <div style={{ width: 48, height: 4, borderRadius: 999, background: dark.pink }} />
          <div style={{ fontSize: 22, fontWeight: 700, color: dark.cyan }}>terk etmek, bırakmak</div>
        </div>
        <div style={{ background: gradients.words, borderRadius: 18, padding: '16px 0', textAlign: 'center', color: '#fff', fontWeight: 700 }}>
          Sonraki →
        </div>
      </ModalCard>
    </ScreenBase>
  );
}

export function QuizScreen({ tapAt }: { tapAt: number }) {
  const frame = useCurrentFrame();
  const answered = frame >= tapAt + 2;
  const options = ['kaza', 'yetenek, beceri', 'hesap; açıklama', 'eşlik etmek'];
  return (
    <ScreenBase back>
      <ModalCard label="ÇOKTAN SEÇMELİ">
        <Progress label="SORU" index={3} total={10} value={0.3} color={gradients.grammar} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <span style={{ fontSize: 42, fontWeight: 800, letterSpacing: -1.5 }}>ability</span>
          <Speaker />
        </div>
        <div style={{ textAlign: 'center', fontSize: 13, color: dark.textSecondary, marginTop: -10 }}>Türkçe anlamı hangisi?</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {options.map((option, i) => {
            const correct = i === 1;
            return (
              <div
                key={option}
                style={{
                  ...glass(dark, { borderRadius: 18, padding: 14, display: 'flex', alignItems: 'center', gap: 14 }),
                  background: answered && correct ? gradients.success : dark.element,
                  opacity: answered && !correct ? 0.45 : 1,
                  transform: correct ? `scale(${pressScale(frame, tapAt)})` : undefined,
                  position: 'relative',
                }}>
                {correct && <Tap at={tapAt} />}
                <div style={{ width: 32, height: 32, borderRadius: 12, background: answered && correct ? 'rgba(255,255,255,0.25)' : dark.selected, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                  {answered && correct ? '✓' : 'ABCD'[i]}
                </div>
                <span style={{ fontSize: 16, fontWeight: 500, color: answered && correct ? '#fff' : dark.text }}>{option}</span>
              </div>
            );
          })}
        </div>
        <div
          style={{
            borderRadius: 18,
            padding: 14,
            textAlign: 'center',
            background: 'rgba(46,230,166,0.12)',
            color: dark.success,
            fontWeight: 700,
            fontSize: 15,
            opacity: interpolate(frame, [tapAt + 4, tapAt + 12], [0, 1], clamp),
          }}>
          Harika! Doğru cevap 🎉
        </div>
      </ModalCard>
    </ScreenBase>
  );
}

const KEY_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

export function WritingScreen({ word, typeStart, typeEnd, checkAt }: { word: string; typeStart: number; typeEnd: number; checkAt: number }) {
  const frame = useCurrentFrame();
  const typedCount = Math.floor(interpolate(frame, [typeStart, typeEnd], [0, word.length], clamp));
  const typed = word.slice(0, typedCount);
  const activeKey = frame >= typeStart && frame < typeEnd ? word[Math.min(typedCount, word.length - 1)] : null;
  const checked = frame >= checkAt + 2;
  const caretOn = Math.floor(frame / 12) % 2 === 0;
  return (
    <ScreenBase back>
      <ModalCard label="YAZMA TESTİ">
        <Progress label="YAZMA TESTİ" index={2} total={10} value={0.2} color={gradients.sunset} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1 }}>yetenek, beceri</div>
          <div style={{ fontSize: 13, color: dark.textSecondary }}>İngilizcesini yaz · 7 harf</div>
        </div>
        <div
          style={{
            ...glass(dark, { borderRadius: 18, minHeight: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }),
            border: `1.5px solid ${checked ? dark.success : dark.border}`,
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: 0.5,
          }}>
          {typed || <span style={{ color: dark.textFaint }}>Cevabını yaz…</span>}
          {!checked && <span style={{ width: 2, height: 26, marginLeft: 2, background: caretOn ? dark.pink : 'transparent' }} />}
        </div>
        {checked ? (
          <div style={{ borderRadius: 18, padding: 18, textAlign: 'center', background: 'rgba(46,230,166,0.12)', color: dark.success, fontWeight: 700 }}>
            Mükemmel yazdın! 🎉
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, padding: 7, borderRadius: 18, background: 'rgba(255,255,255,0.04)' }}>
            {KEY_ROWS.map((row, r) => (
              <div key={row} style={{ display: 'flex', gap: 4, padding: r === 1 ? '0 14px' : 0 }}>
                {[...row].map((key) => (
                  <div
                    key={key}
                    style={{
                      flex: 1,
                      height: 40,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 16,
                      fontWeight: 600,
                      background: key === activeKey ? 'rgba(139,92,255,0.55)' : dark.element,
                      border: `1px solid ${dark.border}`,
                      transform: key === activeKey ? 'scale(0.92)' : undefined,
                    }}>
                    {key}
                  </div>
                ))}
                {r === 2 && <div style={{ flex: 1.6, height: 40, borderRadius: 8, background: dark.selected, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⌫</div>}
              </div>
            ))}
            <div style={{ display: 'flex', gap: 4 }}>
              <div style={{ flex: 1, height: 40, borderRadius: 8, background: dark.selected }} />
              <div style={{ flex: 1, height: 40, borderRadius: 8, background: dark.selected }} />
              <div style={{ flex: 4, height: 40, borderRadius: 8, background: dark.element, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>boşluk</div>
              <div
                style={{
                  flex: 3,
                  height: 40,
                  borderRadius: 8,
                  background: gradients.sunset,
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${pressScale(frame, checkAt)})`,
                  position: 'relative',
                }}>
                <Tap at={checkAt} />
                Kontrol ✓
              </div>
            </div>
          </div>
        )}
      </ModalCard>
    </ScreenBase>
  );
}

export function ResultScreen() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const percent = useCountUp(100, 2, 16);
  const pop = spring({ frame: frame - 2, fps, config: { damping: 14 } });
  return (
    <ScreenBase back>
      <ModalCard label="SONUÇ">
        <div style={{ alignSelf: 'center', width: 170, height: 170, borderRadius: 999, padding: 8, background: gradients.sunset, transform: `scale(${pop})`, boxShadow: '0 16px 50px rgba(139,92,255,0.4)' }}>
          <div style={{ width: '100%', height: '100%', borderRadius: 999, background: dark.surface, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 44, fontWeight: 800 }}>{percent}%</div>
            <div style={{ fontSize: 13, color: dark.textSecondary }}>30 / 30 doğru</div>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 30, fontWeight: 800 }}>Mükemmel! 🏆</div>
          <div style={{ fontSize: 15, color: dark.textSecondary }}>Hepsini bildin, sen bir efsanesin.</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['🎯 EN → TR', '✍️ Yazma', '🔁 TR → EN'].map((label) => (
            <div key={label} style={{ ...glass(dark, { flex: 1, borderRadius: 16, padding: '10px 0', textAlign: 'center' }) }}>
              <div style={{ fontSize: 12, color: dark.textSecondary }}>{label}</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>
                10<span style={{ fontSize: 13, color: dark.textFaint }}> / 10</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderRadius: 18, padding: 14, textAlign: 'center', background: 'rgba(46,230,166,0.10)', border: '1px solid rgba(46,230,166,0.35)', color: dark.success, fontWeight: 700 }}>
          🎉 Bu oturumda 10 kelime öğrendin!
        </div>
      </ModalCard>
    </ScreenBase>
  );
}

// ---------------------------------------------------------------- Gramer ve hikaye

export function GrammarScreen() {
  const frame = useCurrentFrame();
  const scroll = interpolate(frame, [10, 60], [0, -90], clamp);
  const topics: [string, string, string, string, string?][] = [
    ['1', 'Articles', 'Tanımlıklar', gradients.words],
    ['2', 'Nouns', 'İsimler', gradients.grammar, '✓ 13/13'],
    ['3', 'Adjectives', 'Sıfatlar', gradients.sunset, '✓ 11/12'],
    ['4', 'Adverbs', 'Zarflar', gradients.primary],
    ['5', 'The Comparison of Adjectives…', 'Sıfatların Karşılaştırılması', gradients.words],
    ['6', 'Pronouns', 'Zamirler', gradients.grammar],
    ['7', 'Prepositions', 'Edatlar', gradients.sunset],
    ['9', 'Simple Present Tense', 'Geniş Zaman', gradients.primary],
  ];
  return (
    <ScreenBase back>
      <div style={{ padding: '8px 24px', transform: `translateY(${scroll}px)` }}>
        <div style={{ display: 'inline-block', padding: '8px 14px', borderRadius: 999, background: 'rgba(34,211,255,0.12)', color: dark.cyan, fontSize: 11, fontWeight: 700, letterSpacing: 1.4 }}>
          🧠 46 KONU
        </div>
        <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1.5, margin: '10px 0 4px' }}>Gramer Yolculuğu</div>
        <div style={{ fontSize: 15, color: dark.textSecondary, marginBottom: 16 }}>Temelden ileri seviyeye, her konu bir sonrakine köprü.</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {topics.map(([n, title, tr, bg, score]) => (
            <div key={n} style={{ ...glass(dark, { borderRadius: 18, padding: 14, display: 'flex', alignItems: 'center', gap: 14 }) }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
                <div style={{ fontSize: 13, color: dark.textSecondary }}>{tr}</div>
              </div>
              {score && <div style={{ padding: '3px 8px', borderRadius: 999, background: 'rgba(46,230,166,0.14)', color: dark.success, fontSize: 10, fontWeight: 700 }}>{score}</div>}
              <span style={{ color: dark.textFaint, fontSize: 22 }}>›</span>
            </div>
          ))}
        </div>
      </div>
    </ScreenBase>
  );
}

export function StoryScreen({ revealAt }: { revealAt: number }) {
  const frame = useCurrentFrame();
  const revealed = interpolate(frame, [revealAt + 2, revealAt + 12], [0, 1], clamp);
  return (
    <ScreenBase back>
      <div style={{ padding: '8px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ padding: '3px 10px', borderRadius: 999, background: gradients.grammar, color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: 1.4 }}>A1</span>
          <span style={{ fontSize: 13, color: dark.textSecondary }}>~1 dk · 125 kelime</span>
        </div>
        <div>
          <div style={{ fontSize: 44 }}>☕</div>
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>At the Café</div>
          <div style={{ fontSize: 16, color: dark.textSecondary }}>Kafede</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: dark.textFaint }}>Türkçesini görmek için paragrafa dokun</span>
          <span style={{ padding: '6px 12px', borderRadius: 999, background: 'rgba(34,211,255,0.12)', color: dark.cyan, fontSize: 13, fontWeight: 700 }}>🇹🇷 Tümünü göster</span>
        </div>
        <div style={{ ...glass(dark, { borderRadius: 18, padding: 16 }), border: `1px solid ${revealed > 0 ? 'rgba(34,211,255,0.45)' : dark.border}`, transform: `scale(${pressScale(frame, revealAt)})`, position: 'relative' }}>
          <Tap at={revealAt} />
          <div style={{ fontSize: 17, lineHeight: 1.6, fontWeight: 500 }}>
            A waiter comes to their table. “Hello! What would you like?” he asks. “A cup of tea, please,” says Selin.
          </div>
          <div style={{ overflow: 'hidden', maxHeight: revealed * 140, opacity: revealed }}>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${dark.border}`, color: dark.cyan, fontSize: 14, lineHeight: 1.5 }}>
              “Merhaba! Ne alırsınız?” diye sorar garson masalarına gelerek. “Bir çay lütfen,” der Selin.
            </div>
          </div>
        </div>
        <div style={{ ...glass(dark, { borderRadius: 18, padding: 16 }) }}>
          <div style={{ fontSize: 17, lineHeight: 1.6, fontWeight: 500, color: dark.textSecondary }}>
            They eat, drink and talk about their weekend. Mark is from London…
          </div>
        </div>
      </div>
    </ScreenBase>
  );
}

/** Telefonun üstünden kayarak inen bildirim. */
export function NotificationBanner({ at, palette }: { at: number; palette: Palette }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drop = spring({ frame: frame - at, fps, config: { damping: 16 } });
  if (frame < at) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 10,
        right: 10,
        top: 8,
        zIndex: 40,
        transform: `translateY(${(1 - drop) * -140}px)`,
        borderRadius: 22,
        padding: '12px 14px',
        background: palette === dark ? 'rgba(30,30,52,0.96)' : 'rgba(255,255,255,0.97)',
        color: palette.text,
        boxShadow: '0 14px 40px rgba(0,0,0,0.35)',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
      }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#0B0B26,#1B0E36)', border: '2px solid #8B5CFF', color: '#fff', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        EW
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: palette.textSecondary }}>
          <span>English Words</span>
          <span>şimdi</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>🔁 Tekrar zamanı · 3 kelime</div>
        <div style={{ fontSize: 13, color: palette.textSecondary, lineHeight: 1.4 }}>
          abandon = terk etmek
          <br />
          ability = yetenek, beceri
        </div>
      </div>
    </div>
  );
}
