# English Words 📚

İngilizce kelime, gramer ve hikaye çalışma uygulaması. Expo (SDK 58) + React Native ile yazıldı; kullanıcı ilerlemesi telefonda **SQLite** veritabanında tutulur.

- **Kelime Çalış:** Oxford 3000 listesinden kelime öğrenme + 3 test (EN→TR, yazma, TR→EN)
- **Grammer Çalış:** konu anlatımları ve alıştırmalar
- **Hikayeler:** A1–C2 seviyelerinde Türkçe çevirili hikayeler
- **Profil:** öğrenilen kelimeler, günlük seri, okunan hikayeler

---

## Geliştirme

```bash
npm install          # bağımlılıkları kur (ilk seferde)
npx expo start       # geliştirme sunucusunu başlat
```

Terminalde çıkan QR kodu telefondaki **Expo Go** uygulamasıyla okut; değişiklikler anında görünür.

Kontroller:

```bash
npx tsc --noEmit     # tip kontrolü
npx expo lint        # lint
```

> ⚠️ `npm run reset-project` komutunu **çalıştırma**: Expo şablonundan kalan bu komut proje kodunu başka klasöre taşır.

---

## APK alma

APK, Expo'nun bulut servisleri (EAS) **kullanılmadan**, tamamen bu bilgisayarda derlenir.

### Günlük kullanım

| Komut | Ne yapar? | Ne zaman? |
|---|---|---|
| `npm run apk:new` | Sürümü artırır (`versionCode` +1, örn. 1.0.0 → 1.0.1), sonra derler | **Telefona yeni sürüm kuracağın zaman** |
| `npm run apk` | Mevcut sürümle derler | Aynı sürümü yeniden derlemek istediğinde |

Akış:

1. Değişikliği yap ve `npx expo start` ile Expo Go'da test et.
2. Proje klasöründe terminale `npm run apk:new` yaz (yaklaşık 4–5 dakika sürer).
3. Sonunda `✅ APK hazır (…): apk\EnglishWords-1.0.1-2.apk` satırını göreceksin.
4. `apk/` klasöründeki **en yeni** dosyayı telefona at ve kur. Eski sürümün üzerine kurulur; profil ve ilerleme kaybolmaz.

> Yeni sürüm için **her zaman `apk:new`** kullan. `versionCode` artmazsa telefon güncellemeyi kabul etmeyebilir.

### Script ne yapıyor?

[`scripts/build-apk.mjs`](scripts/build-apk.mjs):

1. `--bump` verilmişse `app.json`'daki sürümü artırır.
2. `npx expo prebuild --platform android` ile `app.json` ayarlarını `android/` klasörüne yansıtır (yerel çalışır, hesap gerekmez).
3. `android/gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a` ile release APK derler.
4. Çıktıyı `apk/EnglishWords-<version>-<versionCode>.apk` adıyla kopyalar.

### Kurallar

- **`android/` klasörünü elle düzenleme.** Her derlemede `app.json`'dan yeniden üretilir; elle yapılan değişiklikler silinir. Uygulama adı, paket adı, sürüm gibi ayarlar `app.json`'dan değiştirilir.
- Yeni paketleri her zaman `npx expo install <paket>` ile ekle (SDK ile uyumlu sürümü seçer). Script yeni paketleri APK'ya kendiliğinden dahil eder.
- `android/` ve `*.apk` dosyaları git'e girmez (`.gitignore`).

### APK hakkında

- **APK almak:** `npm run apk:new`
- **Paket adı:** `com.dmeenglishwordsapp` · **Uygulama adı:** English Words
- **Mimari:** yalnızca `arm64-v8a` (günümüz Android telefonlarının neredeyse tamamı). Çok eski 32-bit telefonlar için `scripts/build-apk.mjs` içindeki `ARCHITECTURES` değerine `armeabi-v7a` eklenebilir.
- **İmza:** Expo şablonunun debug anahtarı. Kişisel kullanım ve telefona doğrudan kurulum için yeterlidir; her derleme aynı anahtarla imzalandığı için güncellemeler sorunsuz kurulur. **Play Store'a yüklemek için** ayrı bir release anahtarı oluşturulması gerekir.

---

## Yeni bir bilgisayarda kurulum (tek seferlik)

Bu adımlar bu bilgisayarda bir kez yapıldı; başka bir bilgisayarda APK almak için tekrarlanmalı.

### 1. Java (JDK 17 veya üstü)

```bash
java -version        # 17+ olmalı (bu projede JDK 21 kullanıldı)
```

### 2. Android SDK (Android Studio gerekmez)

1. [developer.android.com/studio](https://developer.android.com/studio) sayfasının "Command line tools only" bölümünden Windows paketini indir.
2. Zip'in içindeki `cmdline-tools` klasörünü şu konuma `latest` adıyla koy:
   `%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest`
3. Lisansları kabul et ve gerekli paketleri kur:

   ```bash
   SDK="$LOCALAPPDATA/Android/Sdk"
   SM="$SDK/cmdline-tools/latest/bin/sdkmanager.bat"
   yes | "$SM" --sdk_root="$SDK" --licenses
   "$SM" --sdk_root="$SDK" "platform-tools" "platforms;android-37.0" "build-tools;37.0.0" "ndk;27.1.12297006" "cmake;3.22.1" "cmake;4.1.2"
   ```

   > Gerekli sürümler React Native'in `node_modules/react-native/gradle/libs.versions.toml` dosyasında yazar (`compileSdk`, `buildTools`, `ndkVersion`). Expo SDK güncellenirse buradan kontrol et. Platform paketinin adı `platforms;android-37` değil **`platforms;android-37.0`**'dır.

4. `ANDROID_HOME` ortam değişkenini kalıcı olarak ayarla (PowerShell):

   ```powershell
   setx ANDROID_HOME "$env:LOCALAPPDATA\Android\Sdk"
   ```

   Ardından VS Code'u / terminali kapatıp aç.

### 3. Windows uzun yol desteği (zorunlu)

React Native'in C++ derlemesi Windows'un 260 karakterlik yol sınırını aşar (`ninja: error: mkdir(...): No such file or directory` hatası). İki adım gerekir:

1. **Yönetici olarak** açılmış PowerShell'de:

   ```powershell
   New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
   ```

2. CMake 3.22.1 ile gelen **ninja 1.10.2 uzun yolları desteklemez**. CMake 4.1.2 paketindeki **ninja 1.12.1** ile değiştir (eskisini yedekleyerek):

   ```bash
   B="$LOCALAPPDATA/Android/Sdk/cmake/3.22.1/bin"
   cp "$B/ninja.exe" "$B/ninja-1.10.2-original.exe"
   cp "$LOCALAPPDATA/Android/Sdk/cmake/4.1.2/bin/ninja.exe" "$B/ninja.exe"
   "$B/ninja.exe" --version    # 1.12.1 yazmalı
   ```

### 4. İlk APK

```bash
npm install
npm run apk
```

İlk derleme Gradle ve bağımlılıkları indirdiği için daha uzun sürer (~10–15 dk); sonrakiler ~4–5 dk.

---

## Sorun giderme

| Hata | Çözüm |
|---|---|
| `Android SDK bulunamadı` | `ANDROID_HOME` ayarlı mı kontrol et; VS Code'u yeniden başlat. |
| `ninja: error: mkdir(...): No such file or directory` | Uzun yol desteği kapalı ya da ninja eski sürüm → yukarıdaki 3. adım. Sonra `android/app/.cxx` klasörünü silip tekrar derle. |
| `Failed to find package 'platforms;android-XX'` | Doğru paket adını listele: `sdkmanager --list \| grep platforms` |
| Telefon güncellemeyi kabul etmiyor | `npm run apk:new` ile `versionCode`'u artırarak derle. |
| Derleme garip bir şekilde takılıyor | `cd android && ./gradlew.bat --stop` ile Gradle süreçlerini durdur, sonra tekrar dene. |
