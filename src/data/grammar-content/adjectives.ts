import type { GrammarContent } from './types';

export const adjectives: GrammarContent = {
  intro:
    'Sıfatlar (adjectives) isimlerin rengini, boyutunu, durumunu, sayısını ya da kime ait olduğunu anlatan kelimelerdir. Bir isim hakkında bilgi vererek onu diğerlerinden ayırmamızı sağlarlar.',

  sections: [
    {
      id: 'intro',
      code: '3',
      title: 'Sıfat Nedir?',
      turkish: 'Temel kurallar',
      blocks: [
        {
          type: 'examples',
          items: [
            { en: 'a **quiet** street', tr: 'sessiz bir sokak' },
            { en: 'the **smart** teacher', tr: 'zeki öğretmen' },
          ],
        },
        {
          type: 'paragraph',
          text: 'Yukarıda **street** (sokak) ve **teacher** (öğretmen) isimdir; **quiet** ve **smart** ise bu isimleri niteleyen sıfatlardır.',
        },
        {
          type: 'note',
          tone: 'tip',
          text: "İngilizce'de sıfatlar, tıpkı Türkçe'deki gibi **isimden önce** gelir: a **red** car → kırmızı bir araba.",
        },
        {
          type: 'note',
          tone: 'info',
          text: 'Sıfatlar **çoğul eki almaz**. İsim çoğul olsa bile sıfat değişmez: two **big** houses (bigs değil).',
        },
        {
          type: 'paragraph',
          text: 'Zamirler ismin yerini tuttuğu için sıfatlar zamirleri de niteleyebilir:',
        },
        {
          type: 'examples',
          items: [{ en: 'He is **kind, funny and honest**.', tr: 'O nazik, komik ve dürüsttür.' }],
        },
        {
          type: 'paragraph',
          text: 'Bir ismin önünde birden fazla sıfat olabilir. Bunları virgülle ayırabilir ya da virgülsüz art arda yazabiliriz:',
        },
        {
          type: 'examples',
          items: [
            { en: 'a **cold refreshing** drink', tr: 'soğuk, ferahlatıcı bir içecek' },
            { en: 'the **old, wooden** table', tr: 'eski, ahşap masa' },
          ],
        },
      ],
    },

    {
      id: 'possessive',
      code: '3.A.1',
      title: 'Possessive Adjectives',
      turkish: 'İyelik Sıfatları',
      blocks: [
        {
          type: 'paragraph',
          text: 'Bir ismin **kime ait olduğunu** gösterirler. Her öznenin kendine ait bir iyelik sıfatı vardır:',
        },
        {
          type: 'table',
          headers: ['Özne', 'İyelik sıfatı'],
          rows: [
            ['I', '**my** (benim)'],
            ['You', '**your** (senin)'],
            ['He', '**his** (onun – erkek)'],
            ['She', '**her** (onun – kadın)'],
            ['It', '**its** (onun – hayvan / nesne)'],
            ['We', '**our** (bizim)'],
            ['You', '**your** (sizin)'],
            ['They', '**their** (onların)'],
          ],
        },
        {
          type: 'examples',
          items: [
            { en: '**his** car', tr: 'onun arabası' },
            { en: '**our** garden', tr: 'bizim bahçemiz' },
          ],
        },
        { type: 'subheading', text: "One's (birinin)" },
        {
          type: 'paragraph',
          text: "Kim olduğu belli olmayan, genel bir kişiden söz ederken **one's** kullanılır. Bu sadece sıfat olarak kullanılır, zamir olarak kullanılamaz. Diğer iyelik sıfatları sonlarına **'s** almaz.",
        },
        {
          type: 'examples',
          items: [{ en: "**One's** family is **one's** strength.", tr: 'İnsanın ailesi onun gücüdür.' }],
        },
        { type: 'subheading', text: "Its mi, it's mi?" },
        {
          type: 'note',
          tone: 'warning',
          text: "Bu ikisi sık karıştırılır: **its** bir iyelik sıfatıdır (onun), **it's** ise **it is** ifadesinin kısaltmasıdır.",
        },
        {
          type: 'examples',
          items: [
            { en: 'The dog wagged **its** tail.', tr: 'Köpek kuyruğunu salladı.' },
            { en: "**It's** my phone.", tr: 'O benim telefonum.' },
          ],
        },
      ],
    },

    {
      id: 'descriptive',
      code: '3.A.2',
      title: 'Descriptive Adjectives',
      turkish: 'Tanımlayıcı Sıfatlar',
      blocks: [
        {
          type: 'paragraph',
          text: 'İsmin **nasıl** olduğunu anlatırlar: güzel, büyük, eski, mavi… Bir ismin önüne birden fazla tanımlayıcı sıfat gelebilir. Art arda birkaç renk söylüyorsak son iki rengin arasına **and** koyarız.',
        },
        {
          type: 'examples',
          items: [{ en: 'a **black, white and grey** cat', tr: 'siyah, beyaz ve gri bir kedi' }],
        },
        { type: 'subheading', text: 'Sıfatların sıralaması' },
        {
          type: 'paragraph',
          text: 'Birden fazla sıfat kullanırken genellikle aşağıdaki sıra izlenir (istisnalar olabilir):',
        },
        {
          type: 'formula',
          steps: ['Görüş', 'Boyut', 'Yaş', 'Renk', 'Köken', 'Malzeme', 'İsim'],
          example: {
            en: 'a **lovely big new green Italian leather** bag',
            tr: 'hoş, büyük, yeni, yeşil, İtalyan yapımı deri bir çanta',
          },
        },
        {
          type: 'examples',
          items: [
            { en: 'a **warm cotton** sweater', tr: 'sıcak, pamuklu bir kazak' },
            { en: 'a **young French** chef', tr: 'genç bir Fransız aşçı' },
            {
              en: 'She bought a **lovely, tiny, antique, Chinese** teapot.',
              tr: 'Hoş, minicik, antika bir Çin demliği aldı.',
            },
          ],
        },
        { type: 'subheading', text: 'Link verbs (bağlayıcı fiiller)' },
        {
          type: 'paragraph',
          text: 'Bazı fiillerden sonra **zarf değil, sıfat** gelir. Bu fiiller öznenin nasıl olduğunu, nasıl göründüğünü ya da hissettirdiğini anlatır:',
        },
        {
          type: 'chips',
          items: ['be', 'get', 'become', 'seem', 'appear', 'look', 'smell', 'sound', 'taste', 'feel'],
        },
        {
          type: 'examples',
          items: [
            { en: 'The manager **looks tired**.', tr: 'Müdür yorgun görünüyor.' },
            { en: 'This cake **tastes sweet**.', tr: 'Bu kekin tadı tatlı.' },
            { en: 'The roses **smell lovely**.', tr: 'Güller çok güzel kokuyor.' },
          ],
        },
        {
          type: 'note',
          tone: 'info',
          text: 'Bu fiiller bir **eylem** bildiriyorsa (ör. tatmak, koklamak) sıfat değil zarf alırlar: The cook **is smelling** the soup **carefully**. (Aşçı çorbayı dikkatlice kokluyor.)',
        },
      ],
    },

    {
      id: 'quantitative',
      code: '3.A.3',
      title: 'Quantitative Adjectives',
      turkish: 'Nicelik Sıfatları',
      blocks: [
        {
          type: 'paragraph',
          text: 'İsmin **miktarı** hakkında bilgi verirler. Hangisini kullanacağımız, önüne geldikleri ismin türüne bağlıdır:',
        },
        {
          type: 'chips',
          title: 'Sayılabilen çoğul isimlerle',
          items: ['many', 'few', 'a few', 'a couple of', 'a number of', 'the majority of', 'several', 'both'],
        },
        {
          type: 'chips',
          title: 'Sayılamayan isimlerle',
          items: ['much', 'little', 'a little', 'a great deal of', 'a large amount of'],
        },
        {
          type: 'chips',
          title: 'Her ikisiyle de',
          items: ['some', 'any', 'no', 'a lot of', 'lots of', 'plenty of', 'all', 'most of the', 'hardly any'],
        },
        {
          type: 'chips',
          title: 'Sayılabilen tekil isimlerle',
          items: ['each', 'every', 'either', 'neither', 'another', 'the whole'],
        },

        { type: 'subheading', text: 'A few / few – A little / little' },
        {
          type: 'paragraph',
          text: 'Başındaki **a** küçük görünse de anlamı değiştirir: **a few / a little** olumlu (az ama yeterli), **few / little** olumsuz (yetersiz) bir anlam taşır.',
        },
        {
          type: 'examples',
          items: [
            {
              en: 'I have **a few** close friends, so I never feel lonely.',
              tr: 'Birkaç yakın arkadaşım var, bu yüzden hiç yalnız hissetmem.',
            },
            {
              en: '**Very few** people came to the concert, so it was cancelled.',
              tr: 'Konsere çok az kişi geldi, bu yüzden iptal edildi.',
            },
            {
              en: "There's **a little** milk left. It's enough for our coffee.",
              tr: 'Biraz süt kaldı. Kahvemize yeter.',
            },
            { en: 'We have **little** time. We need to hurry.', tr: 'Çok az vaktimiz var. Acele etmeliyiz.' },
          ],
        },

        { type: 'subheading', text: 'A / an / one (bir)' },
        {
          type: 'paragraph',
          text: '**a/an** herhangi bir şeyden söz ederken, **one** ise sayıyı vurgulamak için kullanılır. Türkçe karşılıkları aynı olsa da vurgu farklıdır.',
        },
        {
          type: 'examples',
          items: [
            { en: 'She bought **a** lamp.', tr: 'Bir lamba aldı. (Önemli olan ne aldığı)' },
            { en: 'She bought **one** lamp.', tr: 'Bir lamba aldı. (Önemli olan kaç tane aldığı)' },
          ],
        },

        { type: 'subheading', text: 'Both (her ikisi de)' },
        {
          type: 'paragraph',
          text: 'İki şeyden söz ederken kullanılır. Ardından çoğul isim ve çoğul fiil gelir. **the** ya da iyelik sıfatıyla birlikte de kullanılabilir.',
        },
        {
          type: 'correctWrong',
          items: [
            { text: 'Both brothers', correct: true },
            { text: 'Both the brothers', correct: true },
            { text: 'Both of the brothers', correct: true },
            { text: 'Both of his brothers', correct: true },
            { text: 'Both of brothers', correct: false, note: '"of" sonrası the / his gibi bir kelime gerekir' },
          ],
        },
        {
          type: 'examples',
          items: [{ en: '**Both** brothers **are** tall.', tr: 'İki kardeş de uzun boylu.' }],
        },

        { type: 'subheading', text: 'All / all of (hepsi)' },
        {
          type: 'paragraph',
          text: "Üç ya da daha fazla şey için kullanılır. **all** ile **all of** arasında anlam farkı yoktur; ancak **of** kullanıyorsak ardından **the, this, these, my, your, his** gibi bir kelime gelmelidir.",
        },
        {
          type: 'examples',
          items: [
            { en: '**all of the** students', tr: 'öğrencilerin hepsi' },
            { en: '**all** animals', tr: 'bütün hayvanlar' },
            { en: '**all of my** shoes', tr: 'ayakkabılarımın hepsi' },
          ],
        },

        { type: 'subheading', text: 'A lot of / lots of / plenty of (çok)' },
        {
          type: 'paragraph',
          text: 'Hem sayılabilen çoğul hem de sayılamayan isimlerle kullanılır. **Plenty of** "bol, fazlasıyla yeterli" anlamı taşır.',
        },
        {
          type: 'examples',
          items: [
            { en: 'There is **a lot of** traffic in the city.', tr: 'Şehirde çok trafik var.' },
            { en: 'There are **lots of** photos on the wall.', tr: 'Duvarda bir sürü fotoğraf var.' },
            { en: 'There is **plenty of** food for everyone.', tr: 'Herkese yetecek kadar bol yemek var.' },
          ],
        },

        { type: 'subheading', text: "Else's (başkasının)" },
        {
          type: 'paragraph',
          text: "Tek başına kullanılmaz; **someone, somebody, anyone, anybody, nobody, no one** gibi kelimelerle birlikte gelir.",
        },
        {
          type: 'examples',
          items: [
            { en: "This is somebody **else's** umbrella.", tr: 'Bu başka birinin şemsiyesi.' },
            { en: "It's nobody **else's** problem.", tr: 'Bu başka hiç kimsenin sorunu değil.' },
          ],
        },

        { type: 'subheading', text: 'Either / neither (ikisinden biri / hiçbiri)' },
        {
          type: 'paragraph',
          text: '**Either** iki seçenekten herhangi birini, **neither** ise ikisinden hiçbirini anlatır. İkisi de tekil isim ve tekil fiil alır. **of** ile kullanılırsa ardından **the, these, my** gibi bir kelime gelmelidir.',
        },
        {
          type: 'note',
          tone: 'tip',
          text: '**Both** ikisini birden kapsar; **either** ise ikisi arasında bir seçim yapıldığını gösterir.',
        },
        {
          type: 'examples',
          items: [
            {
              en: 'I like both of the jackets, but I can only buy **either of them**.',
              tr: 'İki ceketi de beğeniyorum ama sadece birini alabilirim.',
            },
            { en: 'You can sit on **either side** of the table.', tr: 'Masanın iki tarafından birine oturabilirsin.' },
            { en: '**Neither** answer **is** correct.', tr: 'İki cevaptan hiçbiri doğru değil.' },
          ],
        },

        { type: 'subheading', text: 'Each / every (her bir / her)' },
        {
          type: 'paragraph',
          text: '**Each** iki ya da daha fazla şeyi tek tek ele alır; **every** üç ya da daha fazla şeyi bir bütün olarak düşünür. İkisi de tekil isim ve tekil fiil alır. **Each of** "her biri" anlamında sık kullanılır; **every** ise **of** almaz, onun yerine **every one of** kullanılır.',
        },
        {
          type: 'examples',
          items: [
            { en: '**Each** player **has** a number on his shirt.', tr: 'Her oyuncunun formasında bir numara var.' },
            { en: '**Every** room in the hotel has a balcony.', tr: 'Oteldeki her odanın balkonu var.' },
            { en: 'I have read **every one of** these novels.', tr: 'Bu romanların her birini okudum.' },
          ],
        },

        { type: 'subheading', text: 'Whole (tamamı)' },
        {
          type: 'paragraph',
          text: 'Tekil isimlerle kullanılır ve "bütün, tamamı" anlamına gelir. Fiil de tekildir.',
        },
        {
          type: 'examples',
          items: [{ en: 'I ate the **whole** pizza.', tr: 'Pizzanın tamamını yedim.' }],
        },

        { type: 'subheading', text: 'No / none / none of (hiç / hiçbiri)' },
        {
          type: 'paragraph',
          text: 'Üçü de cümleye olumsuzluk katar, bu yüzden yanlarında ayrıca **not** kullanılmaz. **No** isimle birlikte gelir, **none** tek başına kullanılır, **none of** sonrasında ise **the, my, these** gibi bir kelime gelir.',
        },
        {
          type: 'examples',
          items: [
            { en: '**No** email was sent.', tr: 'Hiç e-posta gönderilmedi.' },
            { en: 'We invited guests, but **none** came.', tr: 'Misafir davet ettik ama hiçbiri gelmedi.' },
            { en: '**None of my** friends knows the answer.', tr: 'Arkadaşlarımın hiçbiri cevabı bilmiyor.' },
          ],
        },

        { type: 'subheading', text: 'A number of (birçok)' },
        {
          type: 'paragraph',
          text: 'Ardından çoğul isim ve çoğul fiil gelir; "a group of" (bir grup) ile yakın anlamlıdır.',
        },
        {
          type: 'examples',
          items: [
            {
              en: '**A number of** tourists **have** visited the museum today.',
              tr: 'Bugün birçok turist müzeyi ziyaret etti.',
            },
          ],
        },

        { type: 'subheading', text: 'Some / any (biraz, birkaç / hiç)' },
        {
          type: 'paragraph',
          text: '**Some** genellikle olumlu, **any** ise olumsuz ve soru cümlelerinde kullanılır. Bir şey teklif ederken ya da rica ederken soru cümlesinde de **some** kullanabiliriz.',
        },
        {
          type: 'examples',
          items: [
            { en: 'There are **some** oranges in the fridge.', tr: 'Buzdolabında birkaç portakal var.' },
            { en: 'There is **some** juice in the glass.', tr: 'Bardakta biraz meyve suyu var.' },
            { en: "There isn't **any** bread left.", tr: 'Hiç ekmek kalmamış.' },
            { en: 'Would you like **some** tea?', tr: 'Biraz çay ister misin?' },
          ],
        },

        { type: 'subheading', text: 'Another / other (bir başka / diğer)' },
        {
          type: 'paragraph',
          text: '**Another** tekil, **other** çoğul isimlerle kullanılır.',
        },
        {
          type: 'examples',
          items: [
            { en: 'Can I have **another** cup?', tr: 'Bir fincan daha alabilir miyim?' },
            { en: '**Other** students are waiting outside.', tr: 'Diğer öğrenciler dışarıda bekliyor.' },
          ],
        },

        { type: 'subheading', text: 'Much of / many of (çoğu)' },
        {
          type: 'paragraph',
          text: '**Much of** ardından tekil / sayılamayan, **many of** ise çoğul isim alır.',
        },
        {
          type: 'examples',
          items: [
            { en: '**Much of** the money was spent on food.', tr: 'Paranın çoğu yemeğe harcandı.' },
            { en: '**Many of** my classmates live nearby.', tr: 'Sınıf arkadaşlarımın çoğu yakında oturuyor.' },
          ],
        },

        { type: 'subheading', text: 'The majority of / the minority of' },
        {
          type: 'paragraph',
          text: '"Çoğunluğu" ve "azınlığı" anlamına gelirler; ardından sayılabilen çoğul isim alırlar.',
        },
        {
          type: 'examples',
          items: [
            { en: '**The majority of** the voters support the plan.', tr: 'Seçmenlerin çoğunluğu planı destekliyor.' },
            { en: '**The minority of** the voters support the plan.', tr: 'Seçmenlerin azınlığı planı destekliyor.' },
          ],
        },
      ],
    },

    {
      id: 'demonstrative',
      code: '3.A.4',
      title: 'Demonstrative Adjectives',
      turkish: 'İşaret Sıfatları',
      blocks: [
        {
          type: 'paragraph',
          text: 'İşaret ettiğimiz isimleri birbirinden ayırmak için kullanılır. Tekil olanlar tekil, çoğul olanlar çoğul isim ve fiil alır.',
        },
        {
          type: 'table',
          headers: ['', 'Yakın', 'Uzak'],
          rows: [
            ['Tekil', '**this** (bu)', '**that** (şu / o)'],
            ['Çoğul', '**these** (bunlar)', '**those** (şunlar / onlar)'],
          ],
        },
        {
          type: 'examples',
          items: [
            { en: '**These** shoes **are** too small.', tr: 'Bu ayakkabılar çok küçük.' },
            { en: '**That** bike belongs to Ali.', tr: "Şu bisiklet Ali'ye ait." },
          ],
        },
      ],
    },

    {
      id: 'interrogative',
      code: '3.A.5',
      title: 'Interrogative Adjectives',
      turkish: 'Soru Sıfatları',
      blocks: [
        { type: 'paragraph', text: 'Bir isim hakkında soru sormak için kullanılan üç soru sıfatı vardır:' },
        { type: 'chips', items: ['which (hangi)', 'what (ne / hangi)', 'whose (kimin)'] },
        {
          type: 'examples',
          items: [
            { en: '**Which** bus goes to the airport?', tr: 'Hangi otobüs havalimanına gidiyor?' },
            { en: '**What** color do you like?', tr: 'Hangi rengi seversin?' },
            { en: '**Whose** keys are these?', tr: 'Bunlar kimin anahtarları?' },
          ],
        },
      ],
    },

    {
      id: 'distributive',
      code: '3.A.6',
      title: 'Distributive Adjectives',
      turkish: 'Üleştirme Sıfatları',
      blocks: [
        {
          type: 'paragraph',
          text: 'Bir gruptaki kişi ya da nesneleri **tek tek** ele almak için kullanılır: **each, every, either, neither**. Bu kullanımda **of** almazlar ve ardından tekil isim gelir.',
        },
        {
          type: 'examples',
          items: [
            { en: '**each** student', tr: 'her öğrenci' },
            { en: '**neither** option', tr: 'iki seçenekten hiçbiri' },
          ],
        },
      ],
    },

    {
      id: 'predicative-attributive',
      code: '3.B',
      title: 'Predicative & Attributive',
      turkish: 'Yüklem ve Niteleyici Sıfatlar',
      blocks: [
        { type: 'subheading', text: 'Predicative: sadece yüklem olarak' },
        {
          type: 'paragraph',
          text: 'Bazı sıfatlar yalnızca **fiilden sonra** (yüklem olarak) kullanılabilir; ismin önüne konamazlar. En yaygınları:',
        },
        {
          type: 'chips',
          items: ['awake', 'asleep', 'alive', 'alone', 'alike', 'afraid', 'ashamed', 'glad', 'pleased', 'sorry', 'upset'],
        },
        {
          type: 'correctWrong',
          items: [
            { text: 'The baby is **asleep**.', correct: true, note: 'Bebek uyuyor.' },
            { text: 'the asleep baby', correct: false, note: 'Bunun yerine: the **sleeping** baby' },
          ],
        },
        {
          type: 'note',
          tone: 'info',
          text: 'Bunların bir kısmı duygu ve tepki bildirir: **glad, sorry, upset, pleased, content, delighted**. Uzaklık bildiren **far** ve **near** de bu şekilde kullanılır: The station **is near** here.',
        },
        {
          type: 'paragraph',
          text: 'Bu sıfatların bazıları edatlarla birlikte kullanılır:',
        },
        {
          type: 'examples',
          items: [
            { en: 'She **is good at** chess.', tr: 'Satrançta iyidir.' },
            { en: 'My father **is proud of** me.', tr: 'Babam benimle gurur duyuyor.' },
            { en: 'He **is kind to** animals.', tr: 'Hayvanlara karşı naziktir.' },
          ],
        },
        {
          type: 'note',
          tone: 'tip',
          text: 'Bu sıfatlar **very** ile güçlendirilmez. Bunun yerine kalıplaşmış ifadeler kullanılır: **all alone** (yapayalnız), **fast / sound asleep** (derin uykuda), **wide / fully awake** (tamamen uyanık).',
        },

        { type: 'subheading', text: 'Attributive: sadece isimden önce' },
        {
          type: 'paragraph',
          text: 'Bunun tam tersi olarak bazı sıfatlar **yalnızca isimden önce** kullanılabilir, yüklem olamazlar:',
        },
        {
          type: 'chips',
          items: ['main', 'chief', 'principal', 'sole', 'only', 'mere', 'sheer', 'utter', 'total', 'elder', 'out-and-out'],
        },
        {
          type: 'correctWrong',
          items: [
            { text: 'The **main** problem is money.', correct: true, note: 'Asıl sorun para.' },
            { text: 'The problem is main.', correct: false },
            { text: 'This is the **only** way out.', correct: true, note: 'Tek çıkış yolu bu.' },
            { text: 'The way out is only.', correct: false },
          ],
        },
        {
          type: 'note',
          tone: 'info',
          text: '**sheer, mere, utter, out-and-out** "tamamen, düpedüz" anlamı taşır: It was **sheer** luck. (Tamamen şanstı.)',
        },
      ],
    },

    {
      id: 'ing-ed',
      code: '3.C',
      title: '-ing ve -ed Sıfatlar',
      turkish: 'Etken ve edilgen sıfat ekleri',
      blocks: [
        { type: 'subheading', text: '-ing: etkiyi yaratan' },
        {
          type: 'paragraph',
          text: '**-ing** ile biten sıfatlar bir şeyin **bizde nasıl bir etki bıraktığını** anlatır:',
        },
        {
          type: 'examples',
          items: [
            { en: 'an **amazing** view', tr: 'muhteşem bir manzara' },
            { en: 'a **convincing** answer', tr: 'ikna edici bir cevap' },
            { en: 'The film was really **boring**.', tr: 'Film gerçekten sıkıcıydı.' },
          ],
        },
        {
          type: 'paragraph',
          text: 'Ayrıca **devam eden bir hareketi ya da süreci** de nitelerler:',
        },
        { type: 'chips', items: ['growing', 'rising', 'falling', 'living', 'remaining', 'existing', 'ruling'] },
        {
          type: 'examples',
          items: [
            { en: 'a **running** child', tr: 'koşan bir çocuk' },
            { en: 'a **barking** dog', tr: 'havlayan bir köpek' },
          ],
        },
        {
          type: 'note',
          tone: 'tip',
          text: 'Bazı -ing sıfatlar başka sıfatları güçlendirir: **boiling hot** (kaynar sıcak), **freezing cold** (buz gibi soğuk).',
        },

        { type: 'subheading', text: '-ed: etkiyi hisseden' },
        {
          type: 'paragraph',
          text: '**-ed** ile biten sıfatlar ise **kişinin ne hissettiğini** ya da içinde bulunduğu durumu anlatır:',
        },
        {
          type: 'chips',
          items: ['bored', 'tired', 'excited', 'interested', 'worried', 'confused', 'surprised', 'satisfied', 'frightened', 'exhausted'],
        },
        {
          type: 'examples',
          items: [
            { en: 'the **tired** players', tr: 'yorgun oyuncular' },
            { en: 'an **excited** crowd', tr: 'heyecanlı bir kalabalık' },
            { en: 'a **talented** pianist', tr: 'yetenekli bir piyanist' },
          ],
        },
        {
          type: 'correctWrong',
          items: [
            { text: 'The lesson was **boring**, so the students were **bored**.', correct: true, note: 'Ders sıkıcıydı (etki), öğrenciler sıkıldı (his).' },
            { text: 'The students were boring.', correct: false, note: 'Bu "öğrenciler sıkıcı insanlardı" demek olur.' },
          ],
        },
        {
          type: 'table',
          headers: ['Fiil', '-ing', '-ed'],
          rows: [
            ['amaze', 'amazing', 'amazed'],
            ['bore', 'boring', 'bored'],
            ['confuse', 'confusing', 'confused'],
            ['disappoint', 'disappointing', 'disappointed'],
            ['excite', 'exciting', 'excited'],
            ['frighten', 'frightening', 'frightened'],
            ['interest', 'interesting', 'interested'],
            ['surprise', 'surprising', 'surprised'],
            ['tire', 'tiring', 'tired'],
            ['worry', 'worrying', 'worried'],
          ],
        },
      ],
    },

    {
      id: 'adjective-preposition',
      code: '3.D',
      title: 'Adjective + Preposition',
      turkish: 'Sıfat + Edat',
      blocks: [
        {
          type: 'paragraph',
          text: 'Bazı sıfatlar belirli edatlarla kalıplaşmıştır. Bu kalıpları ezberlemek doğal konuşmanın anahtarıdır:',
        },
        {
          type: 'patterns',
          items: [
            {
              pattern: 'nice / kind / clever / silly / polite + OF + kişi',
              meaning: 'Birinin davranışını değerlendirir.',
              example: { en: 'It was **kind of you** to call me.', tr: 'Beni araman çok incelikliydi.' },
            },
            {
              pattern: 'nice / kind / polite / rude + TO + kişi',
              meaning: 'Davranışın kime yöneldiğini anlatır.',
              example: { en: 'The nurse was very **kind to** my grandfather.', tr: 'Hemşire dedeme karşı çok nazikti.' },
            },
            {
              pattern: 'pleased / satisfied / disappointed + WITH',
              meaning: 'Bir şey karşısında hissedileni anlatır.',
              example: { en: "I'm really **pleased with** my new phone.", tr: 'Yeni telefonumdan çok memnunum.' },
            },
            {
              pattern: 'angry / annoyed + ABOUT (şey) / WITH (kişi) + FOR (eylem)',
              meaning: 'Kızgınlık bildirir.',
              example: { en: 'She was **angry with** him **for** being late.', tr: 'Geç kaldığı için ona kızgındı.' },
            },
            {
              pattern: 'surprised / shocked / amazed + AT / BY',
              meaning: 'Şaşkınlık bildirir.',
              example: { en: 'Everyone was **surprised at** the result.', tr: 'Herkes sonuca şaşırdı.' },
            },
            {
              pattern: 'afraid / scared / frightened / terrified + OF',
              meaning: 'Korkuyu anlatır.',
              example: { en: 'My sister is **afraid of** spiders.', tr: 'Kız kardeşim örümceklerden korkar.' },
            },
            {
              pattern: 'proud / ashamed + OF',
              meaning: 'Gurur ya da utanç bildirir.',
              example: { en: 'She is **proud of** her son.', tr: 'Oğluyla gurur duyuyor.' },
            },
            {
              pattern: 'bored / fed up + WITH',
              meaning: 'Sıkılmayı, bıkmayı anlatır.',
              example: { en: "I'm **fed up with** this rainy weather.", tr: 'Bu yağmurlu havadan bıktım.' },
            },
            {
              pattern: 'jealous / envious / suspicious + OF',
              meaning: 'Kıskançlık ya da şüphe bildirir.',
              example: { en: "He is **jealous of** his brother's success.", tr: 'Kardeşinin başarısını kıskanıyor.' },
            },
            {
              pattern: 'good / bad / brilliant / hopeless + AT',
              meaning: 'Bir konuda ne kadar iyi olduğunu anlatır.',
              example: { en: 'My brother is **hopeless at** cooking.', tr: 'Kardeşim yemek yapmakta berbat.' },
            },
            {
              pattern: 'married / engaged + TO',
              meaning: 'Evli ya da nişanlı olmayı anlatır.',
              example: { en: 'Ayşe is **married to** a doctor.', tr: 'Ayşe bir doktorla evli.' },
            },
          ],
        },
        {
          type: 'note',
          tone: 'warning',
          text: '"Evli" ya da "nişanlı" derken **with** değil **to** kullanılır: married **to** ✓ — married with ✗',
        },
      ],
    },

    {
      id: 'other',
      code: '3.E',
      title: 'Diğer Önemli Bilgiler',
      turkish: 'The + sıfat, ekler',
      blocks: [
        { type: 'subheading', text: 'The + adjective' },
        {
          type: 'paragraph',
          text: 'Bazı sıfatlar **the** ile birleşince isim gibi davranır ve **bütün bir grubu** temsil eder. Fiil çoğuldur.',
        },
        { type: 'chips', items: ['the rich', 'the poor', 'the young', 'the elderly', 'the homeless', 'the unemployed', 'the sick'] },
        {
          type: 'examples',
          items: [{ en: 'We should help **the homeless**.', tr: 'Evsizlere yardım etmeliyiz.' }],
        },

        { type: 'subheading', text: 'İsim ve fiilden sıfat türetme' },
        {
          type: 'paragraph',
          text: 'Birçok sıfat, isim ya da fiillere **sonek (suffix)** eklenerek oluşur:',
        },
        { type: 'chips', title: 'İsim + sonek', items: ['-ful', '-less', '-ous', '-al', '-ic', '-ish', '-ly', '-y', '-en', '-some'] },
        { type: 'chips', title: 'Fiil + sonek', items: ['-able', '-ive', '-ent', '-ing', '-ed'] },
        {
          type: 'table',
          headers: ['Kök', 'Sıfat'],
          rows: [
            ['rain (yağmur)', '**rainy** (yağmurlu)'],
            ['care (dikkat)', '**careful** (dikkatli)'],
            ['home (ev)', '**homeless** (evsiz)'],
            ['danger (tehlike)', '**dangerous** (tehlikeli)'],
            ['nature (doğa)', '**natural** (doğal)'],
            ['artist (sanatçı)', '**artistic** (sanatsal)'],
            ['child (çocuk)', '**childish** (çocukça)'],
            ['friend (arkadaş)', '**friendly** (cana yakın)'],
            ['wash (yıkamak)', '**washable** (yıkanabilir)'],
            ['attract (çekmek)', '**attractive** (çekici)'],
          ],
        },

        { type: 'subheading', text: 'Olumsuz anlam katan ekler' },
        {
          type: 'paragraph',
          text: 'Bazı önekler ve sonekler sıfata **olumsuz** anlam katar: **un-, in-, im-, il-, ir-, dis-, -less**',
        },
        {
          type: 'examples',
          items: [
            { en: '**un**happy', tr: 'mutsuz' },
            { en: '**im**possible', tr: 'imkânsız' },
            { en: '**il**legal', tr: 'yasa dışı' },
            { en: '**ir**regular', tr: 'düzensiz' },
            { en: '**dis**honest', tr: 'dürüst olmayan' },
            { en: 'care**less**', tr: 'dikkatsiz' },
          ],
        },
      ],
    },
  ],

  exercises: [
    {
      sentence: 'She cries at every sad film. She is very ___.',
      options: ['sensitive', 'harmful', 'national', 'foolish'],
      answer: 'sensitive',
      explanation: '"sensitive" duygusal / hassas demektir; her üzücü filmde ağlayan biri için en uygunudur.',
    },
    {
      sentence: 'Eating too much sugar is ___ for your teeth.',
      options: ['harmful', 'friendly', 'creative', 'clever'],
      answer: 'harmful',
      explanation: '"harmful" zararlı demektir: harm (zarar) + -ful.',
    },
    {
      sentence: 'The film was so ___ that I fell asleep.',
      options: ['boring', 'bored', 'bore', 'boredom'],
      answer: 'boring',
      explanation: 'Film bir etki yaratıyor; etkiyi yaratan şey için -ing kullanılır.',
    },
    {
      sentence: 'We were really ___ when we heard the good news.',
      options: ['excited', 'exciting', 'excite', 'excitement'],
      answer: 'excited',
      explanation: 'Hisseden kişiler "we"; kişinin ne hissettiğini -ed anlatır.',
    },
    {
      sentence: 'I have ___ money, but it is enough for a coffee.',
      options: ['a little', 'a few', 'few', 'many'],
      answer: 'a little',
      explanation: 'Money sayılamaz ve cümle olumlu (yeterli) bir anlam taşıyor: a little.',
    },
    {
      sentence: 'This cup is dirty. Could you bring me ___ one?',
      options: ['another', 'other', 'others', 'both'],
      answer: 'another',
      explanation: '"one" tekil olduğu için "bir başka" anlamında another kullanılır.',
    },
    {
      sentence: "This isn't my umbrella. It's somebody ___.",
      options: ["else's", 'else', 'other', "another's"],
      answer: "else's",
      explanation: "Somebody + else's = başka birinin.",
    },
    {
      sentence: 'The soup smells ___. Can I have some?',
      options: ['delicious', 'deliciously', 'delicacy', 'deliciousness'],
      answer: 'delicious',
      explanation: '"smell" bir link verb; ardından zarf değil sıfat gelir.',
    },
    {
      sentence: 'My grandmother is afraid ___ big dogs.',
      options: ['of', 'at', 'with', 'to'],
      answer: 'of',
      explanation: 'Kalıp: afraid OF + nesne.',
    },
    {
      sentence: 'We should always try to help ___.',
      options: ['the poor', 'the poors', 'poors', 'a poor'],
      answer: 'the poor',
      explanation: 'The + sıfat bütün bir grubu anlatır ve çoğul eki almaz.',
    },
    {
      sentence: 'She bought a ___ bag.',
      options: ['beautiful new leather', 'leather new beautiful', 'new leather beautiful', 'beautiful leather new'],
      answer: 'beautiful new leather',
      explanation: 'Sıralama: görüş (beautiful) → yaş (new) → malzeme (leather).',
    },
    {
      sentence: 'Be quiet! The ___ baby is in the next room.',
      options: ['sleeping', 'asleep', 'sleep', 'slept'],
      answer: 'sleeping',
      explanation: '"asleep" isimden önce kullanılamaz; isimden önce "sleeping" gelir.',
    },
  ],
};
