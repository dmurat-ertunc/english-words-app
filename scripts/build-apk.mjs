#!/usr/bin/env node
/**
 * Yerel release APK derler (bulut/EAS kullanmadan).
 *
 *   npm run apk        → mevcut sürümle derler
 *   npm run apk:new    → önce sürümü artırır (versionCode +1, version x.y.z → x.y.z+1), sonra derler
 *
 * Gereksinimler: JDK 17+, Android SDK (ANDROID_HOME ya da %LOCALAPPDATA%\Android\Sdk) ve
 * Windows'ta uzun yol desteği (LongPathsEnabled = 1).
 */
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const APP_JSON = path.join(ROOT, 'app.json');
const ANDROID_DIR = path.join(ROOT, 'android');
const OUTPUT_DIR = path.join(ROOT, 'apk');
const BUILT_APK = path.join(ANDROID_DIR, 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk');
// Günümüz Android telefonlarının neredeyse tamamı arm64; tek mimari derleme hem hızlı hem küçük.
const ARCHITECTURES = 'arm64-v8a';
const isWindows = process.platform === 'win32';

function fail(message) {
  console.error(`\n✖ ${message}`);
  process.exit(1);
}

function run(command, args, options = {}) {
  console.log(`\n▶ ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, { stdio: 'inherit', shell: isWindows, ...options });
  if (result.status !== 0) fail(`Komut başarısız oldu: ${command} ${args.join(' ')}`);
}

function bumpVersion(config) {
  const android = (config.expo.android ??= {});
  android.versionCode = (android.versionCode ?? 0) + 1;
  const [major = 1, minor = 0, patch = 0] = String(config.expo.version ?? '1.0.0').split('.').map(Number);
  config.expo.version = `${major}.${minor}.${patch + 1}`;
  writeFileSync(APP_JSON, `${JSON.stringify(config, null, 2)}\n`);
  console.log(`⬆ Sürüm artırıldı: ${config.expo.version} (versionCode ${android.versionCode})`);
}

function resolveAndroidHome() {
  const candidates = [
    process.env.ANDROID_HOME,
    process.env.ANDROID_SDK_ROOT,
    isWindows && process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk'),
    !isWindows && path.join(os.homedir(), 'Library', 'Android', 'sdk'),
    !isWindows && path.join(os.homedir(), 'Android', 'Sdk'),
  ].filter(Boolean);
  const sdk = candidates.find((candidate) => existsSync(candidate));
  if (!sdk) fail('Android SDK bulunamadı. ANDROID_HOME ortam değişkenini ayarla.');
  return sdk;
}

// ---- 1. Sürüm ----
const config = JSON.parse(readFileSync(APP_JSON, 'utf8'));
if (process.argv.includes('--bump')) bumpVersion(config);
const version = config.expo.version;
const versionCode = config.expo.android?.versionCode;
console.log(`📦 ${config.expo.name} ${version} (versionCode ${versionCode}) derleniyor…`);

// ---- 2. app.json değişikliklerini native projeye yansıt ----
run('npx', ['expo', 'prebuild', '--platform', 'android', '--no-install'], { cwd: ROOT });

// ---- 3. Gradle ile release derlemesi ----
const env = { ...process.env, ANDROID_HOME: resolveAndroidHome() };
// Tam yol: bazı Windows ortamlarında komutlar bulunulan klasörde aranmaz.
const gradlew = path.join(ANDROID_DIR, isWindows ? 'gradlew.bat' : 'gradlew');
run(gradlew, ['assembleRelease', `-PreactNativeArchitectures=${ARCHITECTURES}`], { cwd: ANDROID_DIR, env });

// ---- 4. Çıktıyı kopyala ----
if (!existsSync(BUILT_APK)) fail(`Derleme bitti ama APK bulunamadı: ${BUILT_APK}`);
mkdirSync(OUTPUT_DIR, { recursive: true });
const target = path.join(OUTPUT_DIR, `EnglishWords-${version}-${versionCode}.apk`);
copyFileSync(BUILT_APK, target);

const sizeMb = (statSync(target).size / 1024 / 1024).toFixed(1);
console.log(`\n✅ APK hazır (${sizeMb} MB): ${path.relative(ROOT, target)}`);
