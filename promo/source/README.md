# Tanıtım videoları (Remotion)

Uygulamanın 30 ve 15 saniyelik dikey (1080×1920, 30 fps) tanıtım videolarının kaynağı.
Uygulamadan bağımsız, ayrı bir projedir; kendi bağımlılıkları vardır.

```bash
cd promo/source
npm install
npm run render:30   # → out/english-words-30s.mp4
npm run render:15   # → out/english-words-15s.mp4
npx remotion studio src/index.ts   # tarayıcıda canlı önizleme ve düzenleme
```

- `src/theme.ts`  — uygulamayla aynı renkler ve font
- `src/screens.tsx` — uygulama ekranlarının video için yeniden çizimi
- `src/Promo.tsx` — sahne sıraları, süreler, dokunuş anları ve üst yazılar (`TIMELINES`)
