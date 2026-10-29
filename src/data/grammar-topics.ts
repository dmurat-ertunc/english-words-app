export type GrammarTopic = {
  id: string;
  /** Kitaptaki bölüm numarası; numarasız giriş bölümü için null. */
  number: number | null;
  title: string;
  turkish?: string;
};

/** Systematic English Grammar içindekiler sayfasındaki ana başlıklar. */
export const GRAMMAR_TOPICS: GrammarTopic[] = [
  { id: 'pronunciation', number: null, title: 'Pronunciation in English', turkish: "İngilizce'de Telaffuz" },
  { id: 'articles', number: 1, title: 'Articles', turkish: 'Tanımlıklar' },
  { id: 'nouns', number: 2, title: 'Nouns', turkish: 'İsimler' },
  { id: 'adjectives', number: 3, title: 'Adjectives', turkish: 'Sıfatlar' },
  { id: 'adverbs', number: 4, title: 'Adverbs', turkish: 'Zarflar' },
  {
    id: 'comparison',
    number: 5,
    title: 'The Comparison of Adjectives, Adverbs and Nouns',
    turkish: 'Sıfatların, Zarfların ve İsimlerin Karşılaştırılması',
  },
  { id: 'pronouns', number: 6, title: 'Pronouns', turkish: 'Zamirler' },
  { id: 'prepositions', number: 7, title: 'Prepositions', turkish: 'Edatlar' },
  { id: 'to-be', number: 8, title: '"To Be"', turkish: 'Fiil ve Yardımcı Fiil Olarak "To Be"' },
  { id: 'simple-present', number: 9, title: 'Simple Present Tense', turkish: 'Geniş Zaman' },
  { id: 'present-continuous', number: 10, title: 'Present Continuous Tense', turkish: 'Şimdiki Zaman' },
  { id: 'simple-past', number: 11, title: 'Simple Past Tense', turkish: "Di'li Geçmiş Zaman" },
  { id: 'past-continuous', number: 12, title: 'Past Continuous Tense', turkish: 'Şimdiki Zamanın Hikayesi' },
  { id: 'present-perfect', number: 13, title: 'Present Perfect Tense', turkish: 'Yakın Geçmiş Zaman' },
  {
    id: 'present-perfect-continuous',
    number: 14,
    title: 'Present Perfect Continuous Tense',
    turkish: 'Süreklilik Bildiren Yakın Geçmiş Zaman',
  },
  { id: 'past-perfect', number: 15, title: 'Past Perfect Tense', turkish: 'Geçmiş Zaman Öncesi' },
  {
    id: 'past-perfect-continuous',
    number: 16,
    title: 'Past Perfect Continuous Tense',
    turkish: 'Geçmişte Bitmiş Sürekli Zaman',
  },
  { id: 'simple-future', number: 17, title: 'Simple Future Tense', turkish: 'Gelecek Zaman' },
  { id: 'future-continuous', number: 18, title: 'Future Continuous Tense', turkish: 'Gelecekte Şimdiki Zaman' },
  { id: 'future-perfect', number: 19, title: 'Future Perfect Tense', turkish: 'Gelecekte Bitmiş Zaman' },
  {
    id: 'future-perfect-continuous',
    number: 20,
    title: 'Future Perfect Continuous Tense',
    turkish: 'Gelecekte Bitecek Sürekli Zaman',
  },
  { id: 'possession', number: 21, title: 'Possession (Have & Have Got)', turkish: 'Sahiplik' },
  {
    id: 'modals-ability-possibility',
    number: 22,
    title: 'Modals I (Ability & Possibility)',
    turkish: 'Kip Belirteçleri I (Yeterlilik & Olasılık)',
  },
  {
    id: 'modals-permission-prohibition',
    number: 23,
    title: 'Modals II (Permission & Prohibition)',
    turkish: 'Kip Belirteçleri II (İzin & Yasaklama)',
  },
  {
    id: 'modals-obligation-necessity',
    number: 24,
    title: 'Modals III (Obligation & Necessity)',
    turkish: 'Kip Belirteçleri III (Zorunluluk & Gereklilik)',
  },
  {
    id: 'modals-deduction',
    number: 25,
    title: 'Modals IV (Deduction)',
    turkish: 'Kip Belirteçleri IV (Sonuç Çıkarma)',
  },
  {
    id: 'modals-request-offer-suggestion',
    number: 26,
    title: 'Modals V (Request / Offer / Suggestion)',
    turkish: 'Kip Belirteçleri V (Rica / İkram / Öneri)',
  },
  { id: 'used-to-would', number: 27, title: 'Used To & Would' },
  {
    id: 'other-modals',
    number: 28,
    title: 'Other Modals and Structures',
    turkish: 'Diğer Kip Belirteçleri ve Yapılar',
  },
  { id: 'intensifiers', number: 29, title: 'Intensifiers', turkish: 'Pekiştireçler' },
  { id: 'both-either-neither', number: 30, title: 'Both / Either / Neither / Each / Too / So' },
  {
    id: 'numbers-dates-time',
    number: 31,
    title: 'Numbers / Dates / The Time',
    turkish: 'Sayılar / Tarihler / Saatler',
  },
  { id: 'interrogatives', number: 32, title: 'Interrogatives', turkish: 'Soru Cümleleri' },
  { id: 'question-tags', number: 33, title: 'Question Tags', turkish: 'Soru Takıları' },
  { id: 'imperative', number: 34, title: 'Imperative', turkish: 'Emir' },
  { id: 'conjunctions', number: 35, title: 'Conjunctions', turkish: 'Bağlaçlar' },
  { id: 'adverb-clauses', number: 36, title: 'Adverb Clauses', turkish: 'Zarf Cümlecikleri' },
  { id: 'passive-voice', number: 37, title: 'Passive Voice', turkish: 'Edilgen Çatı' },
  { id: 'causative', number: 38, title: 'The Causative', turkish: 'Ettirgen Çatı' },
  { id: 'conditional-sentences', number: 39, title: 'Conditional Sentences', turkish: 'Koşul Cümleleri' },
  {
    id: 'wish-clauses',
    number: 40,
    title: 'Wish Clauses & Conditional Conjunctions',
    turkish: 'Dilek Cümlecikleri & Koşul Bağlaçları',
  },
  { id: 'noun-clauses', number: 41, title: 'Noun Clauses', turkish: 'İsim Cümlecikleri' },
  {
    id: 'relative-clauses',
    number: 42,
    title: 'Relative Clauses (Adjective Clauses)',
    turkish: 'İlgi Cümlecikleri (Sıfat Cümlecikleri)',
  },
  {
    id: 'indirect-speech',
    number: 43,
    title: 'Indirect Speech (Reported Speech)',
    turkish: 'Dolaylı Anlatım',
  },
  { id: 'gerund', number: 44, title: 'Gerund (Fiil + ing)', turkish: 'Ulaç' },
  { id: 'infinitive', number: 45, title: 'Infinitive', turkish: 'Mastar' },
];

export function getGrammarTopic(id: string): GrammarTopic | undefined {
  return GRAMMAR_TOPICS.find((topic) => topic.id === id);
}
