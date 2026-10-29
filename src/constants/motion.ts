import { Easing, Keyframe } from 'react-native-reanimated';

const DURATION = 280;
const OFFSET = 8;
const STAGGER = 50;

/**
 * Tüm ekranlarda kullanılan sakin giriş animasyonu: hafifçe aşağıdan belirir,
 * yay (spring) kullanmadığı için sekme ya da sallanma yapmaz.
 */
export function enter(index = 0) {
  return new Keyframe({
    0: { opacity: 0, transform: [{ translateY: OFFSET }] },
    100: { opacity: 1, transform: [{ translateY: 0 }], easing: Easing.out(Easing.cubic) },
  })
    .delay(index * STAGGER)
    .duration(DURATION);
}

export const PRESS_TIMING = { duration: 120, easing: Easing.out(Easing.quad) };
