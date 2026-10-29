import type { GrammarContent } from './types';

export const nouns: GrammarContent = {
  intro:
    'İsimler (nouns) insanları, hayvanları, nesneleri, yerleri ve kavramları adlandıran kelimelerdir. İngilizce\'de isimleri doğru kullanmanın anahtarı üç soruda saklı: **sayılabilir mi**, **tekil mi çoğul mu** ve **kime ait**?',

  sections: [
    {
      id: 'gender',
      code: '2.A',
      title: 'Gender',
      turkish: 'Cinsiyet',
      blocks: [
        {
          type: 'paragraph',
          text: "İngilizce'de isimler erkek (**masculine**), dişi (**feminine**) ya da cinsiyetsiz (**neuter**) olabilir. Ancak bazı dillerdeki gibi isme ek ya da artikel eklenmez. Cinsiyet, isim yerine kullandığımız zamirde ortaya çıkar: **he**, **she** ya da **it**.",
        },
        {
          type: 'examples',
          items: [
            { en: 'My uncle is a pilot. **He** travels a lot.', tr: 'Amcam pilot. Çok seyahat eder.' },
            { en: 'Look at that bird! **It** is building a nest.', tr: 'Şu kuşa bak! Yuva yapıyor.' },
          ],
        },
        {
          type: 'paragraph',
          text: 'İnsanlar ve meslekler için kullanılan isimlerin çoğu iki cinsiyette de aynıdır (teacher, doctor). Ancak bazılarının erkek ve dişi için ayrı biçimleri vardır:',
        },
        {
          type: 'table',
          headers: ['Erkek', 'Dişi', 'Anlam'],
          rows: [
            ['father', 'mother', 'baba – anne'],
            ['son', 'daughter', 'oğul – kız evlat'],
            ['boy', 'girl', 'erkek çocuk – kız'],
            ['man', 'woman', 'adam – kadın'],
            ['husband', 'wife', 'koca – eş (kadın)'],
            ['king', 'queen', 'kral – kraliçe'],
            ['prince', 'princess', 'prens – prenses'],
            ['actor', 'actress', 'aktör – aktris'],
            ['host', 'hostess', 'ev sahibi'],
            ['waiter', 'waitress', 'garson'],
          ],
        },
        {
          type: 'note',
          tone: 'info',
          text: "Günümüz İngilizce'sinde meslekler için çoğunlukla cinsiyetsiz biçim tercih edilir: kadın oyuncular için de **actor**, hostes yerine **flight attendant** denir.",
        },
        { type: 'subheading', text: 'Hayvanlarda erkek ve dişi' },
        {
          type: 'table',
          headers: ['Erkek', 'Dişi', 'Anlam'],
          rows: [
            ['drake', 'duck', 'ördek'],
            ['bull', 'cow', 'boğa – inek'],
            ['rooster / cock', 'hen', 'horoz – tavuk'],
            ['lion', 'lioness', 'aslan – dişi aslan'],
            ['tiger', 'tigress', 'kaplan – dişi kaplan'],
          ],
        },
        {
          type: 'examples',
          items: [{ en: 'The **hen** lays an egg every morning.', tr: 'Tavuk her sabah bir yumurta yumurtlar.' }],
        },
      ],
    },

    {
      id: 'countable-uncountable',
      code: '2.B',
      title: 'Countable & Uncountable',
      turkish: 'Sayılabilen ve Sayılamayan İsimler',
      blocks: [
        {
          type: 'paragraph',
          text: '**Bir kalem, iki kalem, üç kalem** diyebiliriz; kalem **sayılabilir**. Ama **bir su, iki su** diyemeyiz; su ancak bardak, litre gibi bir ölçüyle ifade edilir, yani **sayılamaz**.',
        },
        {
          type: 'note',
          tone: 'warning',
          text: "Sayılamayan isimler **çoğul yapılmaz**. Türkçe'deki \"Havalar soğuk\" ya da \"Sular kesik\" yerine İngilizce'de tekil kullanılır: The **weather is** cold. The **water is** off.",
        },
        {
          type: 'note',
          tone: 'info',
          text: "Türkçe'de ikisi de sayılan **fruit** (meyve) İngilizce'de genellikle sayılamaz, **vegetables** (sebzeler) ise sayılabilir: I eat a lot of **fruit** and **vegetables**.",
        },

        { type: 'subheading', text: 'Countable nouns (sayılabilen)' },
        {
          type: 'paragraph',
          text: 'Önüne **a/an**, **the** ya da hiçbir artikel almadan kullanılabilir ve çoğul biçimi vardır. Sayılabilir olup olmadığını **How many…?** sorusuyla test edebiliriz.',
        },
        {
          type: 'examples',
          items: [
            { en: '**How many** apples did you buy? — Just three.', tr: 'Kaç elma aldın? — Sadece üç.' },
            { en: '**How many** eggs does the hen lay?', tr: 'Tavuk kaç yumurta yumurtlar?' },
          ],
        },
        {
          type: 'paragraph',
          text: 'Sayılabilen isimlerin çoğu **somut** (elle tutulur) isimlerdir:',
        },
        {
          type: 'table',
          headers: ['Tür', 'Örnek'],
          rows: [
            ['Nesneler', 'a pen, a desk'],
            ['Kişi, hayvan, bitki', 'a girl, a lion, a rose'],
            ['Ölçüler', 'a kilo, a metre, a dozen'],
            ['Gruplar', 'a team, a class'],
            ['Miktarlar', 'a slice, a piece'],
          ],
        },

        { type: 'subheading', text: 'Uncountable nouns (sayılamayan)' },
        {
          type: 'paragraph',
          text: 'Önüne **a/an** almaz ve çoğul yapılmaz. Miktarını **How much…?** ile sorarız. Sıvılar, maddeler, soyut kavramlar ve para genellikle bu gruptadır.',
        },
        {
          type: 'examples',
          items: [
            { en: '**Milk is** good for your bones.', tr: 'Süt kemikleriniz için faydalıdır.' },
            { en: '**How much** sugar do you want in your tea?', tr: 'Çayına ne kadar şeker istersin?' },
            { en: '**How much** money do you need?', tr: 'Ne kadar paraya ihtiyacın var?' },
          ],
        },
        {
          type: 'chips',
          title: 'Somut ama sayılamayan',
          items: ['water', 'milk', 'coffee', 'oil', 'air', 'sand', 'gold', 'wood', 'paper', 'glass', 'rice', 'flour', 'meat', 'jam'],
        },
        {
          type: 'chips',
          title: 'Soyut ve sayılamayan',
          items: ['love', 'fear', 'patience', 'knowledge', 'happiness', 'advice', 'information', 'violence', 'death'],
        },
        {
          type: 'correctWrong',
          items: [
            { text: 'Can you give me some **advice**?', correct: true },
            { text: 'Can you give me an advice?', correct: false, note: 'Bunun yerine: **a piece of** advice' },
            { text: 'I need some **information**.', correct: true },
            { text: 'I need some informations.', correct: false },
          ],
        },

        { type: 'subheading', text: 'Hem sayılabilen hem sayılamayan' },
        {
          type: 'paragraph',
          text: 'Bazı isimlerin anlamı, sayılabilir ya da sayılamaz kullanılmasına göre değişir:',
        },
        {
          type: 'table',
          headers: ['Sayılamaz', 'Sayılabilir'],
          rows: [
            ['**glass** (cam)', '**a glass** (bardak), **glasses** (gözlük)'],
            ['**paper** (kağıt)', '**a paper** (gazete)'],
            ['**noise** (gürültü)', '**a noise** (bir ses)'],
            ['**chicken** (tavuk eti)', '**a chicken** (canlı tavuk)'],
          ],
        },
        {
          type: 'examples',
          items: [
            { en: 'I heard **a noise** in the kitchen.', tr: 'Mutfakta bir ses duydum.' },
            { en: "There's too much **noise** here.", tr: 'Burada çok fazla gürültü var.' },
          ],
        },

        { type: 'subheading', text: 'Grup isimleri ve parçaları' },
        {
          type: 'paragraph',
          text: '**furniture, clothing, luggage, equipment** gibi isimler bir grubun tamamını anlatır ve sayılamaz. Grubun tek bir parçasından söz ederken sayılabilen bir isim kullanırız:',
        },
        {
          type: 'table',
          headers: ['Sayılamaz (grup)', 'Sayılabilir (parça)'],
          rows: [
            ['furniture (mobilya)', 'a chair, a sofa, a table'],
            ['clothing (giysi)', 'a coat, a skirt, a hat'],
            ['luggage (bagaj)', 'a bag, a suitcase'],
            ['jewellery (mücevher)', 'a ring, a necklace'],
            ['work (iş)', 'a job'],
            ['laughter (kahkaha)', 'a laugh'],
            ['machinery (makineler)', 'a machine'],
          ],
        },
        {
          type: 'note',
          tone: 'tip',
          text: '**baggage, equipment, traffic, money** de sayılamaz: How much **luggage** do you have? (luggages değil)',
        },
      ],
    },

    {
      id: 'regular-plurals',
      code: '2.C.1',
      title: 'Regular Plurals',
      turkish: 'Düzenli Çoğullar',
      blocks: [
        { type: 'paragraph', text: 'Çoğu isim, sonuna **-s** eklenerek çoğul yapılır:' },
        {
          type: 'table',
          headers: ['Tekil', 'Çoğul'],
          rows: [
            ['cup', 'cup**s**'],
            ['door', 'door**s**'],
            ['pear', 'pear**s**'],
          ],
        },
        { type: 'subheading', text: '-ch, -sh, -s, -x, -o → -es' },
        {
          type: 'table',
          headers: ['Tekil', 'Çoğul'],
          rows: [
            ['watch (saat)', 'watch**es**'],
            ['dish (tabak)', 'dish**es**'],
            ['bus (otobüs)', 'bus**es**'],
            ['box (kutu)', 'box**es**'],
            ['hero (kahraman)', 'hero**es**'],
            ['tomato (domates)', 'tomato**es**'],
          ],
        },
        {
          type: 'note',
          tone: 'warning',
          text: '-o ile biten bazı kelimeler sadece **-s** alır: photo**s**, piano**s**, radio**s**, video**s**.',
        },
        { type: 'subheading', text: 'Sessiz harf + y → -ies' },
        {
          type: 'table',
          headers: ['Tekil', 'Çoğul'],
          rows: [
            ['baby (bebek)', 'bab**ies**'],
            ['story (hikaye)', 'stor**ies**'],
            ['country (ülke)', 'countr**ies**'],
            ['lady (hanımefendi)', 'lad**ies**'],
          ],
        },
        { type: 'subheading', text: 'Sesli harf + y → -s' },
        {
          type: 'table',
          headers: ['Tekil', 'Çoğul'],
          rows: [
            ['day (gün)', 'day**s**'],
            ['key (anahtar)', 'key**s**'],
            ['monkey (maymun)', 'monkey**s**'],
          ],
        },
        { type: 'subheading', text: '-f / -fe → -ves' },
        {
          type: 'table',
          headers: ['Tekil', 'Çoğul'],
          rows: [
            ['leaf (yaprak)', 'lea**ves**'],
            ['knife (bıçak)', 'kni**ves**'],
            ['wife (eş)', 'wi**ves**'],
            ['life (hayat)', 'li**ves**'],
            ['shelf (raf)', 'shel**ves**'],
            ['wolf (kurt)', 'wol**ves**'],
            ['half (yarım)', 'hal**ves**'],
            ['loaf (somun)', 'loa**ves**'],
            ['thief (hırsız)', 'thie**ves**'],
          ],
        },
        {
          type: 'note',
          tone: 'info',
          text: '-f / -fe ile biten diğer kelimelerin çoğu sadece **-s** alır: roof**s**, chef**s**, belief**s**.',
        },
      ],
    },

    {
      id: 'irregular-plurals',
      code: '2.C.2',
      title: 'Irregular Plurals',
      turkish: 'Düzensiz Çoğullar',
      blocks: [
        {
          type: 'paragraph',
          text: 'Bazı isimlerin çoğulları hiçbir kurala uymaz; bunları ezberlemek gerekir:',
        },
        {
          type: 'table',
          headers: ['Tekil', 'Çoğul'],
          rows: [
            ['person (kişi)', '**people**'],
            ['man (adam)', '**men**'],
            ['woman (kadın)', '**women**'],
            ['child (çocuk)', '**children**'],
            ['foot (ayak)', '**feet**'],
            ['tooth (diş)', '**teeth**'],
            ['mouse (fare)', '**mice**'],
            ['goose (kaz)', '**geese**'],
          ],
        },
        { type: 'subheading', text: 'Tekili ve çoğulu aynı olanlar' },
        { type: 'chips', items: ['sheep', 'deer', 'fish', 'salmon', 'trout', 'mackerel'] },
        {
          type: 'examples',
          items: [{ en: 'There are ten **sheep** in the field.', tr: 'Tarlada on koyun var.' }],
        },

        { type: 'subheading', text: 'Sadece çoğul olanlar' },
        {
          type: 'paragraph',
          text: 'İki parçadan oluşan bazı eşyaların tekil biçimi yoktur; her zaman **çoğul fiille** kullanılırlar:',
        },
        {
          type: 'chips',
          items: ['glasses (gözlük)', 'trousers (pantolon)', 'jeans (kot)', 'shorts (şort)', 'pyjamas (pijama)', 'scissors (makas)'],
        },
        {
          type: 'examples',
          items: [
            { en: 'My new **jeans are** too tight.', tr: 'Yeni kotum çok dar.' },
            { en: 'Where **are** my **scissors**?', tr: 'Makasım nerede?' },
          ],
        },

        { type: 'subheading', text: '-s ile biten ama tekil olanlar' },
        {
          type: 'paragraph',
          text: 'Bu kelimeler -s ile bitse de anlam olarak tekildir ve **tekil fiil** alır:',
        },
        {
          type: 'chips',
          items: ['news', 'mathematics', 'physics', 'athletics', 'gymnastics', 'darts', 'billiards', 'Athens', 'Brussels'],
        },
        {
          type: 'examples',
          items: [
            { en: 'The **news is** really good today.', tr: 'Bugün haberler gerçekten iyi.' },
            { en: '**Physics is** my favourite subject.', tr: 'Fizik en sevdiğim ders.' },
          ],
        },

        { type: 'subheading', text: 'Topluluk isimleri (collective nouns)' },
        {
          type: 'paragraph',
          text: 'Bir grubu anlatan isimler, grubu **tek bir birim** olarak düşünürsek tekil, **üyeleri tek tek** düşünürsek çoğul fiil alabilir:',
        },
        {
          type: 'chips',
          items: ['family', 'team', 'class', 'staff', 'crowd', 'audience', 'government', 'company', 'council', 'orchestra'],
        },
        {
          type: 'examples',
          items: [
            { en: 'The **team is** in the final.', tr: 'Takım finalde. (bir bütün olarak)' },
            { en: 'The **team are** celebrating with their families.', tr: 'Takım oyuncuları aileleriyle kutluyor. (üyeler)' },
            { en: '**Companies have** to protect their workers.', tr: 'Şirketler çalışanlarını korumak zorunda.' },
          ],
        },
        {
          type: 'note',
          tone: 'warning',
          text: '**the police** ve **the military** çoğul biçimi olmadığı halde her zaman **çoğul fiil** alır: The **police are** looking for the driver. Milliyetler ve **the + sıfat** grupları da öyle: the French, the young, the healthy.',
        },
        {
          type: 'paragraph',
          text: '**the public, the majority, the minority** gibi isimlerin çoğul biçimi yoktur; tekil ya da çoğul fiille kullanılabilirler.',
        },

        { type: 'subheading', text: 'Her zaman çoğul olanlar' },
        {
          type: 'chips',
          items: ['clothes', 'goods', 'thanks', 'congratulations', 'stairs', 'belongings', 'surroundings', 'outskirts', 'earnings', 'remains', 'savings'],
        },
        {
          type: 'examples',
          items: [
            { en: 'The **stairs are** slippery.', tr: 'Merdivenler kaygan.' },
            { en: 'All my **belongings are** in the car.', tr: 'Bütün eşyalarım arabada.' },
          ],
        },

        { type: 'subheading', text: '"of" ile kurulan topluluklar' },
        {
          type: 'examples',
          items: [
            { en: 'a **collection of** coins', tr: 'bir madeni para koleksiyonu' },
            { en: 'a **group of** tourists', tr: 'bir grup turist' },
            { en: 'a **gang of** robbers', tr: 'bir soyguncu çetesi' },
            { en: 'a **flock of** sheep', tr: 'bir koyun sürüsü' },
          ],
        },

        { type: 'subheading', text: 'Sayılar: hundred, thousand, million, dozen' },
        {
          type: 'correctWrong',
          items: [
            { text: 'three **hundred** students', correct: true, note: 'Belli bir sayıdan sonra -s almaz.' },
            { text: 'three hundreds students', correct: false },
            { text: '**Thousands of** fans waited outside.', correct: true, note: 'Sayı belli değilse -s + of alır.' },
          ],
        },
        {
          type: 'note',
          tone: 'tip',
          text: 'Mesafe, süre ya da para **tek bir miktar** olarak düşünülüyorsa çoğul olsa bile **tekil fiil** alır: **Two hours is** enough for the exam. **Fifty dollars is** too much for a T-shirt.',
        },
      ],
    },

    {
      id: 'partitives',
      code: '2.D',
      title: 'Partitives',
      turkish: 'Miktar ve parça ifadeleri',
      blocks: [
        {
          type: 'paragraph',
          text: 'Sayılamayan bir şeyin **bir parçasını ya da belli bir miktarını** anlatmak için kullanılır. En genel olanları **a piece of** ve **a bit of**:',
        },
        {
          type: 'table',
          headers: ['Tekil', 'Çoğul'],
          rows: [
            ['a **piece of** cake', 'two **pieces of** cake'],
            ['a **piece of** information', 'some **pieces of** information'],
            ['a **bit of** luck', 'a few **bits of** luck'],
          ],
        },
        { type: 'subheading', text: 'Özel kullanımlar' },
        {
          type: 'table',
          headers: ['İfade', 'Anlam'],
          rows: [
            ['a **bar of** soap', 'bir kalıp sabun'],
            ['a **slice of** cheese', 'bir dilim peynir'],
            ['a **loaf of** bread', 'bir somun ekmek'],
            ['a **sheet of** paper', 'bir yaprak kağıt'],
            ['a **cup of** tea', 'bir fincan çay'],
            ['a **bottle of** water', 'bir şişe su'],
            ['a **drop of** rain', 'bir damla yağmur'],
            ['a **pinch of** salt', 'bir tutam tuz'],
            ['a **cube of** sugar', 'bir küp şeker'],
            ['a **flash of** lightning', 'bir şimşek çakması'],
          ],
        },
        { type: 'subheading', text: 'Ölçü birimleri' },
        {
          type: 'examples',
          items: [
            { en: 'a **litre of** olive oil', tr: 'bir litre zeytinyağı' },
            { en: 'two **kilos of** apples', tr: 'iki kilo elma' },
          ],
        },
        { type: 'subheading', text: 'A pair of (bir çift)' },
        {
          type: 'paragraph',
          text: '**a pair of** ile başlayan ifadeler **tekil fiil** alır; birden fazla çift söz konusuysa (**pairs of**) fiil çoğul olur.',
        },
        {
          type: 'chips',
          items: ['a pair of socks', 'a pair of gloves', 'a pair of shoes', 'a pair of jeans', 'a pair of glasses', 'a pair of scissors'],
        },
        {
          type: 'examples',
          items: [
            { en: 'A **pair of** gloves **is** on the table.', tr: 'Masanın üstünde bir çift eldiven var.' },
            { en: 'Three **pairs of** shoes **were** bought yesterday.', tr: 'Dün üç çift ayakkabı alındı.' },
          ],
        },
      ],
    },

    {
      id: 'possessive',
      code: '2.E',
      title: 'Possessive Nouns',
      turkish: 'İsimlerde İyelik',
      blocks: [
        {
          type: 'paragraph',
          text: "Bir şeyin **kime ya da neye ait olduğunu** göstermek için isme **'s**, sadece **'** (apostrof) ya da **of** eklenir.",
        },
        { type: 'subheading', text: "Tekil isimler → 's" },
        {
          type: 'examples',
          items: [
            { en: "This is **Mehmet's** bike.", tr: 'Bu Mehmet\'in bisikleti.' },
            {
              en: "Use my pen. I'll use **Zeynep's**.",
              tr: "Benim kalemimi kullan. Ben Zeynep'inkini kullanacağım.",
            },
          ],
        },
        {
          type: 'paragraph',
          text: "Sonu **-s** ile biten tekil isimlere de **'s** eklenir; sadece **'** koymak da kabul edilir:",
        },
        {
          type: 'examples',
          items: [
            { en: "**James's** car / **James'** car", tr: "James'in arabası" },
            { en: "the **boss's** office", tr: 'patronun ofisi' },
          ],
        },
        { type: 'subheading', text: "Düzenli çoğullar → '" },
        {
          type: 'examples',
          items: [
            { en: "the **students'** books", tr: 'öğrencilerin kitapları' },
            { en: "my **parents'** house", tr: 'ailemin evi' },
          ],
        },
        { type: 'subheading', text: "Düzensiz çoğullar → 's" },
        {
          type: 'examples',
          items: [
            { en: "**children's** toys", tr: 'çocukların oyuncakları' },
            { en: "**women's** rights", tr: 'kadın hakları' },
            { en: "**people's** opinions", tr: 'insanların fikirleri' },
          ],
        },
        { type: 'subheading', text: 'İki isim "and" ile bağlıysa' },
        {
          type: 'paragraph',
          text: "Ortak bir şeyden söz ediyorsak **'s** sadece **ikinci** isme eklenir. Her birinin ayrı bir şeyi varsa ikisine de eklenir:",
        },
        {
          type: 'examples',
          items: [
            { en: "**Ali and Ayşe's** house", tr: "Ali ile Ayşe'nin (ortak) evi" },
            { en: "**Ali's and Ayşe's** phones", tr: "Ali'nin ve Ayşe'nin (ayrı) telefonları" },
          ],
        },
        { type: 'subheading', text: "Of + 's (çift iyelik)" },
        {
          type: 'paragraph',
          text: "Bir cümlede iki iyelik bir arada olabilir; bu durumda **'s**, **of**'tan sonra gelir:",
        },
        {
          type: 'examples',
          items: [
            { en: "a friend **of my brother's**", tr: 'abimin arkadaşlarından biri (one of my brother\'s friends)' },
            { en: "a song **of Tarkan's**", tr: "Tarkan'ın şarkılarından biri" },
          ],
        },
        { type: 'subheading', text: "'s'den sonraki ismin düşmesi" },
        {
          type: 'paragraph',
          text: "Neden söz edildiği belliyse **'s**'den sonraki isim tekrarlanmaz. Bir **ev ya da iş yeri** anlatılırken de isim çoğu zaman söylenmez:",
        },
        {
          type: 'examples',
          items: [
            { en: "My laptop is broken, so I'll use my **cousin's**.", tr: 'Laptopum bozuk, kuzeninkini kullanacağım.' },
            { en: "I'm staying at my **aunt's** this weekend.", tr: 'Bu hafta sonu teyzemde kalıyorum.' },
            { en: "She bought bread from the **baker's**.", tr: 'Fırından ekmek aldı.' },
          ],
        },
        {
          type: 'note',
          tone: 'tip',
          text: "Cansız varlıklarda genellikle **'s** yerine **of** kullanılır: the end **of** the film, the roof **of** the house.",
        },
      ],
    },
  ],

  exercises: [
    {
      sentence: 'In autumn, the ___ fall from the trees.',
      options: ['leaves', 'leafs', 'leafes', 'leaf'],
      answer: 'leaves',
      explanation: 'leaf → leaves: -f ile biten bu kelime -ves alır.',
    },
    {
      sentence: 'There are three ___ playing in the garden.',
      options: ['children', 'childs', 'childrens', 'child'],
      answer: 'children',
      explanation: 'child düzensiz çoğul yapılır: children.',
    },
    {
      sentence: 'There are many ___ in this city.',
      options: ['buses', 'buss', 'busies', 'bus'],
      answer: 'buses',
      explanation: '-s ile biten isimler -es alır: bus → buses.',
    },
    {
      sentence: 'The news ___ really good today.',
      options: ['is', 'are', 'were', 'have'],
      answer: 'is',
      explanation: '"news" -s ile bitse de tekildir ve tekil fiil alır.',
    },
    {
      sentence: 'My new jeans ___ too tight.',
      options: ['are', 'is', 'was', 'has'],
      answer: 'are',
      explanation: '"jeans" her zaman çoğuldur ve çoğul fiil alır.',
    },
    {
      sentence: 'How ___ milk do we need for the cake?',
      options: ['much', 'many', 'few', 'a'],
      answer: 'much',
      explanation: 'Milk sayılamaz; miktarı "How much" ile sorulur.',
    },
    {
      sentence: 'Can you give me some ___ about the hotel?',
      options: ['information', 'informations', 'an information', 'a informations'],
      answer: 'information',
      explanation: '"information" sayılamaz; a/an almaz ve çoğul yapılmaz.',
    },
    {
      sentence: "I'd like ___ of cake, please.",
      options: ['a piece', 'a bar', 'a drop', 'a pinch'],
      answer: 'a piece',
      explanation: 'Kek için "a piece of cake" (bir dilim / parça kek) kullanılır.',
    },
    {
      sentence: 'The shop sells ___ clothes.',
      options: ["children's", "childrens'", 'childs', "child's'"],
      answer: "children's",
      explanation: "children düzensiz çoğuldur; iyelik için 's alır.",
    },
    {
      sentence: 'The two boys share a bedroom. The ___ room is upstairs.',
      options: ["boys'", "boy's", "boys's", 'boys'],
      answer: "boys'",
      explanation: "Düzenli çoğul (boys) iyelik için sadece ' (apostrof) alır.",
    },
    {
      sentence: 'Two hours ___ enough for this exam.',
      options: ['is', 'are', 'were', 'have'],
      answer: 'is',
      explanation: 'Süre tek bir miktar olarak düşünüldüğü için tekil fiil kullanılır.',
    },
    {
      sentence: 'The police ___ looking for the thief.',
      options: ['are', 'is', 'was', 'has'],
      answer: 'are',
      explanation: '"the police" her zaman çoğul fiil alır.',
    },
    {
      sentence: 'She bought three ___ of shoes.',
      options: ['pairs', 'pair', "pair's", 'a pair'],
      answer: 'pairs',
      explanation: 'Birden fazla çift için "pairs of" kullanılır.',
    },
  ],
};
