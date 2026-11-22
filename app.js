/* =========================================================
   RABEE TRADING — App logic (control-deck layout)
   ========================================================= */
document.documentElement.classList.add('js');

const WA_NUMBER = '963988779070';
const SITE = 'https://rt-rabea.com';
const IMG = (id) => /^https?:\/\//i.test(String(id || ''))
  ? String(id)
  : `https://api.rt-rabea.com/uploads/products/${id}.png`;

/* ---------------- REAL BENCHMARK DATA ----------------
   PassMark CPU Mark / G3D Mark values retrieved from cpubenchmark.net
   and videocardbenchmark.net. Raw marks are normalised to 0-100 below.
   Original Arabic product names and prices are never modified. */
const BENCHMARK_SOURCES = {
  cpu: { label: 'PassMark CPU Mark', url: 'https://www.cpubenchmark.net/' },
  gpu: { label: 'PassMark G3D Mark', url: 'https://www.videocardbenchmark.net/' }
};
/* Local 0-100 index. CPU ceiling = high-end desktop class; GPU ceiling = RTX 5090 (~39k G3D). */
const BENCHMARK_MAX = { cpu: 40000, gpu: 39000 };
const BENCHMARKS = [
  /* GPUs — specific VRAM/Ti variants must come before shorter model names */
  { type: 'gpu', re: /(?:geforce\s+)?rtx\s?5070\s?ti\b/i, model: 'GeForce RTX 5070 Ti', mark: 32330 },
  { type: 'gpu', re: /(?:geforce\s+)?rtx\s?5070\b/i, model: 'GeForce RTX 5070', mark: 28683 },
  { type: 'gpu', re: /(?:geforce\s+)?rtx\s?5060\s?ti\s?16gb\b/i, model: 'GeForce RTX 5060 Ti 16GB', mark: 22635 },
  { type: 'gpu', re: /(?:geforce\s+)?rtx\s?5060\s?ti\s?8gb\b/i, model: 'GeForce RTX 5060 Ti 8GB', mark: 21753 },
  { type: 'gpu', re: /(?:geforce\s+)?rtx\s?5060\s?ti\b/i, model: 'GeForce RTX 5060 Ti 8GB', mark: 21753 },
  { type: 'gpu', re: /(?:geforce\s+)?rtx\s?5060\b/i, model: 'GeForce RTX 5060', mark: 20578 },
  { type: 'gpu', re: /(?:geforce\s+)?rtx\s?4060\s?ti\s?16gb\b/i, model: 'GeForce RTX 4060 Ti 16GB', mark: 22523 },
  { type: 'gpu', re: /(?:geforce\s+)?rtx\s?4060\s?ti\b/i, model: 'GeForce RTX 4060 Ti', mark: 22597 },
  { type: 'gpu', re: /(?:geforce\s+)?rtx\s?4060\b/i, model: 'GeForce RTX 4060', mark: 19477 },
  { type: 'gpu', re: /(?:geforce\s+)?rtx\s?3060\s?12gb\b/i, model: 'GeForce RTX 3060 12GB', mark: 16695 },
  { type: 'gpu', re: /(?:geforce\s+)?rtx\s?3060\b/i, model: 'GeForce RTX 3060 12GB', mark: 16695 },
  { type: 'gpu', re: /(?:geforce\s+)?rtx\s?3050\s?6gb\b/i, model: 'GeForce RTX 3050 6GB', mark: 10736 },
  { type: 'gpu', re: /(?:geforce\s+)?rtx\s?3050\s?8gb\b/i, model: 'GeForce RTX 3050 8GB', mark: 12450 },
  { type: 'gpu', re: /(?:geforce\s+)?rtx\s?3050\b/i, model: 'GeForce RTX 3050 8GB', mark: 12450 },
  { type: 'gpu', re: /(?:radeon\s+)?rx\s?9070\s?xt\b/i, model: 'Radeon RX 9070 XT', mark: 26929 },
  { type: 'gpu', re: /(?:radeon\s+)?rx\s?9070\b/i, model: 'Radeon RX 9070', mark: 25373 },
  { type: 'gpu', re: /(?:radeon\s+)?rx\s?9060\s?xt\s?16gb\b/i, model: 'Radeon RX 9060 XT 16GB', mark: 20147 },
  { type: 'gpu', re: /(?:radeon\s+)?rx\s?9060\s?xt\s?8gb\b/i, model: 'Radeon RX 9060 XT 8GB', mark: 19730 },
  { type: 'gpu', re: /(?:radeon\s+)?rx\s?9060\s?xt\b/i, model: 'Radeon RX 9060 XT 8GB', mark: 19730 },

  /* CPUs — laptop id overrides first, then exact models, then generation names */
  { type: 'cpu', id: 'lenovo-t450', model: 'Intel Core i5-4300U', mark: 2485, note: 'الطراز الأكثر شيوعاً لجهاز T450' },
  { type: 'cpu', id: 'dell-e5540', model: 'Intel Core i5-4300M', mark: 2960, note: 'الطراز الأكثر شيوعاً لجهاز E5540' },
  { type: 'cpu', id: 'hp-probook-g3', model: 'Intel Core i5-6300HQ', mark: 4668, note: 'المعالج المذكور بالجيل السادس HQ' },
  { type: 'cpu', id: 'x1-carbon', model: 'Intel Core i7-7600U', mark: 3703, note: 'الطراز الأكثر شيوعاً لـ X1 Carbon الجيل الخامس' },
  { type: 'cpu', re: /ryzen\s?7\s?9700x/i, model: 'AMD Ryzen 7 9700X', mark: 36911 },
  { type: 'cpu', re: /core\s?i5[\s-]?14400f/i, model: 'Intel Core i5-14400F', mark: 25384 },
  { type: 'cpu', re: /core\s?i5[\s-]?12400f/i, model: 'Intel Core i5-12400F', mark: 19516 },
  { type: 'cpu', re: /core\s?i5[\s-]?9400f/i, model: 'Intel Core i5-9400F', mark: 9463 },
  { type: 'cpu', re: /core\s?i5[\s-]?8600\b/i, model: 'Intel Core i5-8600', mark: 9992 },
  { type: 'cpu', re: /core\s?i5[\s-]?8400\b/i, model: 'Intel Core i5-8400', mark: 9235 },
  { type: 'cpu', re: /core\s?i7[\s-]?7600u/i, model: 'Intel Core i7-7600U', mark: 3703 },
  { type: 'cpu', re: /core\s?i5[\s-]?7400\b/i, model: 'Intel Core i5-7400', mark: 5482 },
  { type: 'cpu', re: /core\s?i5[\s-]?7300u/i, model: 'Intel Core i5-7300U', mark: 3612 },
  { type: 'cpu', re: /core\s?i5[\s-]?6600\b/i, model: 'Intel Core i5-6600', mark: 6070 },
  { type: 'cpu', re: /core\s?i5[\s-]?6300hq/i, model: 'Intel Core i5-6300HQ', mark: 4668 },
  { type: 'cpu', re: /core\s?i5[\s-]?6300u/i, model: 'Intel Core i5-6300U', mark: 3198 },
  { type: 'cpu', re: /core\s?i5[\s-]?4300u/i, model: 'Intel Core i5-4300U', mark: 2485 },
  { type: 'cpu', re: /core\s?i5[\s-]?4300m/i, model: 'Intel Core i5-4300M', mark: 2960 },
  { type: 'cpu', re: /core\s?i5[\s-]?8250u/i, model: 'Intel Core i5-8250U', mark: 5779 },
  { type: 'cpu', re: /core\s?i3[\s-]?7100\b/i, model: 'Intel Core i3-7100', mark: 4311 },
  { type: 'cpu', re: /celeron\s?n3450/i, model: 'Intel Celeron N3450', mark: 1970 },
  { type: 'cpu', re: /(?:core\s+)?i5\s+(?:الجيل\s+)?الثامن|\bT480\b/i, model: 'Intel Core i5-8250U', mark: 5779, note: 'الطراز الأكثر شيوعاً لجهاز T480' },
  { type: 'cpu', re: /(?:core\s+)?i7\s+(?:الجيل\s+)?السابع/i, model: 'Intel Core i7-7600U', mark: 3703, note: 'المعالج المذكور بالجيل السابع' },
  { type: 'cpu', re: /(?:core\s+)?i5\s+(?:الجيل\s+)?السابع/i, model: 'Intel Core i5-7300U', mark: 3612, note: 'المعالج المذكور بالجيل السابع' },
  { type: 'cpu', re: /(?:core\s+)?i5\s+(?:الجيل\s+)?السادس\s+HQ/i, model: 'Intel Core i5-6300HQ', mark: 4668, note: 'المعالج المذكور بالجيل السادس HQ' },
  { type: 'cpu', re: /(?:core\s+)?i5\s+(?:الجيل\s+)?السادس/i, model: 'Intel Core i5-6300U', mark: 3198, note: 'المعالج المذكور بالجيل السادس' },
  { type: 'cpu', re: /(?:core\s+)?i5\s+(?:الجيل\s+)?الرابع|i5\s+جيل\s+رابع/i, model: 'Intel Core i5-4300U', mark: 2485, note: 'المعالج المذكور بالجيل الرابع' }
];

/* ---------------- DATA ---------------- */
let PRODUCTS = (typeof ADMIN_PRODUCTS !== 'undefined' && Array.isArray(ADMIN_PRODUCTS) && ADMIN_PRODUCTS.length)
  ? ADMIN_PRODUCTS.map(p => ({
      ...p,
      specs: p.specs && typeof p.specs === 'object' ? { ...p.specs } : {},
      features: Array.isArray(p.features) ? [...p.features] : [],
      images: Array.isArray(p.images) ? [...p.images] : []
    }))
  : [
  {
    id: 'chair-80', name: 'كرسي ألعاب Gaming Chair', category: 'كراسي وطاولات',
    price: 80, oldPrice: 90, badge: '-11% خصم',
    image: IMG('d112db28-a20a-48dd-b7d0-42cb4afc2dbe'),
    desc: 'كرسي ألعاب مريح بتصميم رياضي، دعم قطني ومسند رأس قابل للتعديل، مناسب لجلسات اللعب الطويلة.',
    features: ['دعم قطني ومسند رأس', 'قاعدة متينة وعجلات ناعمة', 'تصميم مريح لجلسات طويلة'],
    specs: { type: 'كرسي ألعاب', extra: 'دعم قطني • مسند رأس' },
    link: '/products/213321213213123', deal: true, featured: true
  },
  {
    id: 'office-chair', name: 'كرسي مكتب شبكي مريح', category: 'كراسي وطاولات',
    price: 60,
    image: IMG('f44369e5-957f-47ac-81fc-de32d0ea307e'),
    desc: 'كرسي مكتب شبكي مريح بتصميم خفيف وتهوية جيدة، مناسب للعمل اليومي لساعات طويلة.',
    features: ['ظهر شبكي مهوي', 'مقعد مريح', 'مناسب للعمل اليومي'],
    specs: { type: 'كرسي مكتب', extra: 'شبكة مهوية • تصميم خفيف' },
    link: '/products/879987987', featured: true
  },
  {
    id: 'ps4-gta', name: 'يد تحكم PS4 DualShock 4 – Grand Theft Auto Edition', category: 'بلايستيشن',
    price: 7, oldPrice: 9, badge: '-22% خصم',
    image: IMG('a7295604-f654-46b0-baf3-8982a16ae766'),
    desc: 'يد تحكم DualShock 4 بتصميم Grand Theft Auto، توافق كامل مع بلايستيشن 4 وPC.',
    features: ['تصميم GTA حصري', 'لمس واهتزاز', 'توافق PS4 / PC'],
    specs: { type: 'يد تحكم', extra: ' DualShock 4 • PS4 / PC' },
    link: '/products/08271', deal: true
  },
  {
    id: 'ps4-cod', name: 'يد تحكم PS4 DualShock 4 – Call of Duty Black Ops Cold War Edition', category: 'بلايستيشن',
    price: 7, oldPrice: 9, badge: '-22% خصم',
    image: IMG('26632e8d-ea68-4dff-aaa3-c2cce74681f9'),
    desc: 'يد تحكم DualShock 4 بتصميم Call of Duty Black Ops Cold War، مثالية لعشاق الألعاب التنافسية.',
    features: ['تصميم COD حصري', 'لمس واهتزاز', 'توافق PS4 / PC'],
    specs: { type: 'يد تحكم', extra: ' DualShock 4 • PS4 / PC' },
    link: '/products/08274', deal: true
  },
  {
    id: 'rx9060xt', name: 'ASUS Dual Radeon RX 9060 XT 16GB GDDR6', category: 'كروت شاشة', brand: 'ASUS',
    price: 600, oldPrice: 680, badge: '-12% خصم',
    image: IMG('fac04897-fd33-4066-bbb4-5b4fbd4d5bfe'),
    desc: 'كرت شاشة ASUS Dual Radeon RX 9060 XT بذاكرة 16GB GDDR6، أداء قوي للألعاب بدقة 1440p.',
    features: ['16GB GDDR6', 'تبريد ثنائي المراوح', 'دعم FSR وRay Tracing'],
    specs: { type: 'كرت شاشة', gpu: 'Radeon RX 9060 XT 16GB', ram: '16GB GDDR6', extra: 'تبريد Dual-Fan • 1440p' },
    link: '/products/00201221', deal: true, featured: true
  },
  {
    id: 'majesty-22', name: 'شاشة ألعاب Majesty Gaming مقاس 22 بوصة بدقة FHD ومعدل تحديث 120 هرتز', category: 'شاشات',
    price: 75, oldPrice: 80, badge: '-6% خصم',
    image: IMG('b46020ce-a7b6-4ba6-9556-856b8436b9b2'),
    desc: 'شاشة ألعاب 22 بوصة بدقة Full HD ومعدل تحديث 120Hz، استجابة سريعة وألوان واضحة.',
    features: ['22 بوصة FHD', '120Hz', 'ألوان غنية واستجابة سريعة'],
    specs: { type: 'شاشة', screen: '22 بوصة FHD • 120Hz', extra: 'ألوان غنية • استجابة سريعة' },
    link: '/products/00927', deal: true, featured: true
  },
  {
    id: 'ps4-slim', name: 'بلايستيشن 4 سليم 500 جيجا – إصدار 9 مع قبضتين وتابلت Acer 10.1 إنش', category: 'بلايستيشن',
    price: 250,
    image: IMG('dca46d0d-8abb-4665-a2f9-4ac999ba1701'),
    desc: 'بلايستيشن 4 سليم 500GB إصدار 9 مع قبضتين وتابلت Acer 10.1 إنش — عرض متكامل جاهز للعب.',
    features: ['500GB', 'إصدار 9', 'قبضتان + تابلت Acer'],
    specs: { type: 'كونسول', storage: '500GB', extra: 'قبضتان + تابلت Acer 10.1' },
    link: '/products/32132131', deal: true
  },
  {
    id: 'standing-desk', name: 'طاولة هايدروليك Standing Desk', category: 'كراسي وطاولات',
    price: 120, oldPrice: 135, badge: '-11% خصم',
    image: IMG('ca0eff65-dd8c-4f3d-80d2-1c5b9e4236d0'),
    desc: 'طاولة مكتب قابلة للتعديل كهربائياً، ارتفاع مرن لراحة أفضل أثناء العمل واللعب.',
    features: ['تعديل ارتفاع كهربائي', 'سطح متين', 'تصميم عصري'],
    specs: { type: 'طاولة', extra: 'تعديل ارتفاع كهربائي' },
    link: '/products/112312222222222222222', deal: true
  },
  {
    id: 'keyboard-x98', name: 'Attack Shark X98 Pro Starry White - تصميم 98% مع Numpad - اتصال ثلاثي Bluetooth و2.4GHz وسلكي - بطارية 4000mAh - شاشة ملونة 1.5 إنش - مقبض تحكم معدني - Hot-Swap - Gasket Mount - إضاءة RGB - اللون Starry White أبيض نجمي', category: 'كيبورد',
    price: 55,
    image: IMG('295086a4-563e-4dd0-a911-259de69369d1'),
    desc: 'كيبورد ميكانيكي 98% بتصميم Starry White، اتصال ثلاثي، شاشة ملونة، وبطارية 4000mAh.',
    features: ['98% مع Numpad', 'Bluetooth + 2.4GHz + سلكي', 'بطارية 4000mAh', 'RGB + Hot-Swap'],
    specs: { type: 'كيبورد', extra: '98% • Tri-Mode • 4000mAh • RGB' },
    link: '/products/x-98', featured: true
  },
  {
    id: 'mouse-v8', name: 'ماوس الألعاب ATTACK SHARK V8', category: 'ماوس',
    price: 67,
    image: IMG('eb6eb224-9c88-4ad8-bce0-33260c8cae46'),
    desc: 'ماوس ألعاب خفيف بدقة عالية واستجابة سريعة، مثالي لألعاب الـ FPS والـ Gaming.',
    features: ['مستشعر دقيق', 'تصميم خفيف', 'إضاءة RGB'],
    specs: { type: 'ماوس', extra: 'مستشعر دقيق • تصميم خفيف' },
    link: '/products/01127', featured: true
  },
  {
    id: 'mouse-x6', name: 'ماوس الألعاب ATTACK SHARK X6 Tri-Mode – أبيض', category: 'ماوس',
    price: 43,
    image: IMG('23833b47-aaa0-4b02-8b42-5024fbc5a162'),
    desc: 'ماوس لاسلكي ثلاثي الوضعيات بلون أبيض، خفيف وعملي للاستخدام اليومي والألعاب.',
    features: ['Tri-Mode', 'لاسلكي + سلكي', 'تصميم أبيض أنيق'],
    specs: { type: 'ماوس', extra: 'Tri-Mode • لاسلكي + سلكي' },
    link: '/products/01137', featured: true
  },
  {
    id: 'falcon-x', name: 'Gaming PC Falcon X', category: 'كمبيوترات',
    price: 2477,
    image: IMG('409f60e3-21d2-4994-be49-2d89976f41a2'),
    desc: 'تجميعة PC احترافية بأداء عالٍ للألعاب والتصميم، مكونات مختارة بعناية وقابلة للتخصيص.',
    features: ['تجميعة Gaming', 'أداء 1440p+', 'قابل للتخصيص'],
    specs: { type: 'تجميعة Gaming', gpu: 'قابلة للتخصيص', extra: 'أداء 1440p+ • مكونات مختارة' },
    link: '/products/16'
  },
  {
    id: 'lenovo-11e', name: 'LENOVO 11E | المعالج: Intel Celeron N3450 | الرام: 4GB DDR3L | التخزين: 128GB SSD NVMe | الشاشة: 14 بوصة HD | معدل التحديث: 60Hz | نظام التشغيل: Windows 10 Pro', category: 'لابتوبات', brand: 'LENOVO',
    price: 75,
    image: IMG('8546aa65-a5d7-4b9b-8fdb-374c31a1341b'),
    desc: 'لابتوب Lenovo 11E عملي للاستخدام اليومي والدراسة، خفيف ومتين بسعر اقتصادي.',
    features: ['Celeron N3450', '4GB RAM', '128GB SSD', '14 بوصة HD'],
    specs: { cpu: 'Intel Celeron N3450', ram: '4GB DDR3L', storage: '128GB SSD NVMe', screen: '14 بوصة HD • 60Hz', os: 'Windows 10 Pro' },
    link: '/products/00018'
  },
  {
    id: 'lenovo-t450', name: 'لينوفو T450 - المعالج Intel Core i5 الجيل الرابع - الرام 8GB DDR3L - التخزين 256GB SSD - الشاشة 14.0 إنش HD 60Hz - نظام التشغيل Windows 10 Pro', category: 'لابتوبات', brand: 'LENOVO',
    price: 110,
    image: IMG('d8dbfad2-0a14-4ff3-a8a1-99d91be17abe'),
    desc: 'لابتوب Lenovo T450 بمعالج i5 الجيل الرابع، أداء موثوق للعمل والدراسة.',
    features: ['i5 الجيل الرابع', '8GB RAM', '256GB SSD', '14.0 إنش HD'],
    specs: { cpu: 'Intel Core i5 الجيل الرابع', ram: '8GB DDR3L', storage: '256GB SSD', screen: '14.0 إنش HD • 60Hz', os: 'Windows 10 Pro' },
    link: '/products/00006'
  },
  {
    id: 'lenovo-t470s', name: 'لينوفو T470S - المعالج Intel Core i5 الجيل السادس - الرام 8GB DDR4 - التخزين 256GB SSD - الشاشة 14.0 إنش FHD 60Hz - نظام التشغيل Windows 10 Pro', category: 'لابتوبات', brand: 'LENOVO',
    price: 150,
    image: IMG('a59ba475-616e-430d-8c03-bcf4c5d03243'),
    desc: 'لابتوب نحيف بمعالج i5 الجيل السادس وشاشة FHD، مثالي للتنقل والعمل.',
    features: ['i5 الجيل السادس', '8GB DDR4', '256GB SSD', '14.0 إنش FHD'],
    specs: { cpu: 'Intel Core i5 الجيل السادس', ram: '8GB DDR4', storage: '256GB SSD', screen: '14.0 إنش FHD • 60Hz', os: 'Windows 10 Pro' },
    link: '/products/00009'
  },
  {
    id: 'hp-probook-g4', name: 'إتش بي ProBook 650 G4 - المعالج Intel Core i5 الجيل السابع - الرام 8GB DDR4 - التخزين 256GB SSD - الشاشة 15.6 إنش HD بتردد 60Hz - كيبورد كامل - نظام التشغيل Windows 10 Pro', category: 'لابتوبات', brand: 'HP',
    price: 180,
    image: IMG('3c79e521-a858-4b52-aca4-7ae9a28954fb'),
    desc: 'لابتوب أعمال HP ProBook 650 G4 بشاشة 15.6 إنش وكيبورد كامل، مناسب للعمل المكتبي.',
    features: ['i5 الجيل السابع', '8GB DDR4', '256GB SSD', '15.6 إنش HD'],
    specs: { cpu: 'Intel Core i5 الجيل السابع', ram: '8GB DDR4', storage: '256GB SSD', screen: '15.6 إنش HD • 60Hz', os: 'Windows 10 Pro' },
    link: '/products/009'
  },
  {
    id: 'hp-probook-g3', name: 'إتش بي ProBook 650 G3 - المعالج Intel Core i5 الجيل السادس HQ - الرام 8GB DDR4 - التخزين 256GB SSD - كرت الشاشة AMD سعة 2GB - الشاشة 15.6 إنش HD بتردد 60Hz - كيبورد كامل - نظام التشغيل Windows 10 Pro', category: 'لابتوبات', brand: 'HP',
    price: 200,
    image: IMG('7e919956-893e-421d-b5ed-5a6cc289f1e0'),
    desc: 'لابتوب HP ProBook 650 G3 بمعالج i5 HQ وكرت AMD 2GB، أداء قوي للعمل والتصميم.',
    features: ['i5 الجيل السادس HQ', '8GB DDR4', '256GB SSD', 'AMD 2GB'],
    specs: { cpu: 'Intel Core i5 الجيل السادس HQ', ram: '8GB DDR4', storage: '256GB SSD', screen: '15.6 إنش HD • 60Hz', os: 'Windows 10 Pro' },
    link: '/products/502'
  },
  {
    id: 'dell-e5540', name: 'لابتوب أعمال Dell Latitude E5540 شاشة 15.6 بوصة، معالج Intel Core i5 جيل رابع، رام 8GB، تخزين سريع 256GB SSD، لوحة مفاتيح كاملة مع أرقام جانبية، وهيكل متين مخصص للمهام اليومية والدراسة (مستعمل)', category: 'لابتوبات', brand: 'Dell',
    price: 125,
    image: IMG('52e47037-a2b2-4d1f-a5e6-d36d9f1899d3'),
    desc: 'لابتوب Dell Latitude E5540 بحالة جيدة، هيكل متين وأداء مناسب للمهام اليومية والدراسة.',
    features: ['i5 جيل رابع', '8GB RAM', '256GB SSD', '15.6 بوصة + Numpad'],
    specs: { cpu: 'Intel Core i5 جيل رابع', ram: '8GB', storage: '256GB SSD', screen: '15.6 بوصة', os: 'مستعمل' },
    link: '/products/323'
  },
  {
    id: 'x1-carbon', name: 'Lenovo ThinkPad X1 Carbon الجيل الخامس - Intel Core i7 الجيل السابع - رام 8GB - تخزين 256GB SSD - شاشة 14 إنش FHD - اللون أسود', category: 'لابتوبات', brand: 'LENOVO',
    price: 130,
    image: IMG('9a9db4ce-e61c-4ef7-ac26-105917d8375a'),
    desc: 'لابتوب ThinkPad X1 Carbon خفيف وفاخر بمعالج i7 وشاشة FHD، مثالي للأعمال والتنقل.',
    features: ['i7 الجيل السابع', '8GB RAM', '256GB SSD', '14 إنش FHD'],
    specs: { cpu: 'Intel Core i7 الجيل السابع', ram: '8GB', storage: '256GB SSD', screen: '14 إنش FHD', os: '—' },
    link: '/products/0987'
  },
  {
    id: 'yoga-260', name: 'Lenovo ThinkPad Yoga 260 - المعالج Intel Core i5 الجيل السادس - الرام 8GB DDR4 - التخزين 256GB SSD - الشاشة 12.5 إنش FHD Touch - Intel HD Graphics 520 -', category: 'لابتوبات', brand: 'LENOVO',
    price: 160,
    image: IMG('7a38fbf8-28bd-4979-aab1-e0eab47066a0'),
    desc: 'لابتوب 2-in-1 بشاشة لمس FHD، مرن للعمل والرسم والتنقل.',
    features: ['i5 الجيل السادس', '8GB DDR4', '256GB SSD', '12.5 إنش FHD Touch'],
    specs: { cpu: 'Intel Core i5 الجيل السادس', ram: '8GB DDR4', storage: '256GB SSD', screen: '12.5 إنش FHD Touch', os: 'Intel HD Graphics 520' },
    link: '/products/0000'
  },
  {
    id: 'asus-vy279hgr', name: 'شاشة ألعاب ASUS VY279HGR حجم 27 بوصة بدقة FHD، لوحة IPS، معدل تحديث 120Hz، زمن استجابة 1ms MPRT، تقنية حماية العين العميقة Eye Care Plus، تدعم SmoothMotion (جديد)', category: 'شاشات', brand: 'ASUS',
    price: 140,
    image: IMG('90754e9f-8c15-4ed9-a792-d93218e4b7de'),
    desc: 'شاشة ASUS 27 بوصة IPS بمعدل 120Hz واستجابة 1ms، ألوان دقيقة وحماية للعين.',
    features: ['27 بوصة FHD IPS', '120Hz', '1ms MPRT', 'Eye Care Plus'],
    specs: { type: 'شاشة', screen: '27 بوصة FHD IPS • 120Hz', extra: '1ms MPRT • Eye Care Plus' },
    link: '/products/00960'
  },
  {
    id: 'asus-prime-a21', name: 'كيس قيمنق ASUS Prime A21 حجم Micro-ATX، واجهة مش مخرمة Porous Mesh للتهوية الفائقة، يدعم مبردات مائية حتى 360mm، وكروت شاشة حتى 380mm (جديد)', category: 'كيس كمبيوتر', brand: 'ASUS',
    price: 96,
    image: IMG('3b8a2353-f6c3-4498-b748-9269add2ee17'),
    desc: 'كيس ASUS Prime A21 بتصميم شبكي وتهوية ممتازة، يدعم مبردات 360mm وكروت شاشة كبيرة.',
    features: ['Micro-ATX', 'Mesh أمامي', 'يدعم 360mm', 'GPU حتى 380mm'],
    specs: { type: 'كيس كمبيوتر', extra: 'Micro-ATX • Mesh • 360mm • GPU 380mm' },
    link: '/products/00201142'
  },
  {
    id: 'rtx-5060', name: 'كرت شاشة ASUS Dual GeForce RTX 5060 سعة 8GB GDDR7، معمارية الذكاء الاصطناعي الجيل الجديد، تبريد Compact Dual-Fan، يدعم DLSS 4.0 (جديد)', category: 'كروت شاشة', brand: 'ASUS',
    price: 540,
    image: IMG('e3fd572f-2aaf-4843-aaf8-58ac8929c1af'),
    desc: 'كرت RTX 5060 بذاكرة GDDR7 وتقنيات AI، أداء ممتاز للألعاب الحديثة.',
    features: ['8GB GDDR7', 'DLSS 4.0', 'تبريد Dual-Fan'],
    specs: { type: 'كرت شاشة', gpu: 'GeForce RTX 5060 8GB', ram: '8GB GDDR7', extra: 'DLSS 4.0 • Dual-Fan' },
    link: '/products/00201105'
  },
  {
    id: 'rtx-5070', name: 'كرت شاشة ASUS Dual GeForce RTX 5070 سعة 12GB GDDR7، مراوح عالية الكفاءة Axial-tech، حجم 2.5-Slot، تقنية Auto-Extreme (جديد)', category: 'كروت شاشة', brand: 'ASUS',
    price: 0,
    image: IMG('e3fd572f-2aaf-4843-aaf8-58ac8929c1af'),
    desc: 'كرت RTX 5070 بذاكرة 12GB GDDR7 ومراوح Axial-tech، السعر عند الطلب.',
    features: ['12GB GDDR7', 'Axial-tech', '2.5-Slot', 'Auto-Extreme'],
    specs: { type: 'كرت شاشة', gpu: 'GeForce RTX 5070 12GB', ram: '12GB GDDR7', extra: 'Axial-tech • 2.5-Slot' },
    link: '/products/rtx5070'
  },
  {
    id: 'rog-ryujin', name: 'ASUS ROG Ryujin III - مبرد مائي AIO - شاشة LCD بحجم 3.5 إنش - مضخة Asetek الجيل الثامن - ردياتير 240mm / 360mm - مروحة VRM مدمجة - قاعدة نحاسية - دعم Intel / AMD', category: 'مبرد معالج', brand: 'ASUS',
    price: 300,
    image: IMG('1c176027-8b9f-4005-9061-2639b40ded64'),
    desc: 'مبرد مائي ROG Ryujin III بشاشة LCD 3.5 إنش وأداء تبريد احترافي.',
    features: ['شاشة LCD 3.5 إنش', 'Asetek Gen 8', '240/360mm', 'Intel / AMD'],
    specs: { type: 'مبرد معالج', extra: 'AIO • LCD 3.5" • 240/360mm' },
    link: '/products/asus-rog'
  },
  {
    id: 'tuf-650w', name: 'أسوس TUF Gaming 650W Bronze TUF-GAMING-650B - قدرة 650 واط - شهادة 80 PLUS Bronze - خط +12V أحادي بقدرة 612W - مكونات بمعايير عسكرية - مروحة 135mm Axial-tech - تقنية 0dB - محمل كروي مزدوج - كابلات Sleeved - تصميم Non-Modular - اللون أسود', category: 'بور سبلاي', brand: 'ASUS',
    price: 65,
    image: IMG('98b367fe-a814-4ac2-96a8-f82191bc8993'),
    desc: 'بور سبلاي TUF 650W بشهادة Bronze ومكونات عسكرية، ثبات وأمان عالي.',
    features: ['650W', '80+ Bronze', 'مروحة 135mm', 'وضع 0dB'],
    specs: { type: 'بور سبلاي', extra: '650W • 80+ Bronze • 0dB' },
    link: '/products/650w'
  },
  {
    id: 'rtx-5060-ti', name: 'ASUS Dual GeForce RTX 5060 Ti OC Edition 8GB GDDR7', category: 'كروت شاشة', brand: 'ASUS',
    price: 630,
    image: IMG('88bd3f94-80ce-487d-be71-1f15127f5529'),
    desc: 'كرت RTX 5060 Ti OC بذاكرة 8GB GDDR7، أداء أقوى للألعاب والإبداع.',
    features: ['8GB GDDR7', 'OC Edition', 'DLSS 4'],
    specs: { type: 'كرت شاشة', gpu: 'GeForce RTX 5060 Ti OC 8GB', ram: '8GB GDDR7', extra: 'OC Edition • DLSS 4' },
    link: '/products/00201008'
  },
  {
    id: 'asus-h610m', name: 'ASUS PRIME H610M-A WIFI D4', category: 'اللوحة الام', brand: 'ASUS',
    price: 120,
    image: IMG('34a2d640-6556-4734-af9b-77a99e3b37f8'),
    desc: 'لوحة أم ASUS H610M-A مع Wi-Fi، دعم DDR4 ومنفذ M.2.',
    features: ['H610', 'WiFi', 'DDR4', 'M.2'],
    specs: { type: 'لوحة أم', extra: 'H610 • WiFi • DDR4 • M.2' },
    link: '/products/1153'
  },
  {
    id: 'msi-b760m', name: 'MSI PRO B760M-B DDR5', category: 'اللوحة الام', brand: 'MSI',
    price: 130,
    image: IMG('40e9a2db-996b-4473-978b-eaf65c983f65'),
    desc: 'لوحة أم MSI B760M بدعم DDR5، أساس قوي لتجميعة حديثة.',
    features: ['B760', 'DDR5', 'M.2'],
    specs: { type: 'لوحة أم', extra: 'B760 • DDR5 • M.2' },
    link: '/products/0997'
  },
  {
    id: 'msi-h610m', name: 'MSI PRO H610M-E DDR4', category: 'اللوحة الام', brand: 'MSI',
    price: 90,
    image: IMG('624355a0-1cc0-4169-961b-6eb2df722fe3'),
    desc: 'لوحة أم MSI H610M-E اقتصادية وعملية لتجميعات DDR4.',
    features: ['H610', 'DDR4', 'Micro-ATX'],
    specs: { type: 'لوحة أم', extra: 'H610 • DDR4 • Micro-ATX' },
    link: '/products/0951'
  },
  {
    id: 'msi-mag-245f', name: 'شاشة ألعاب MSI MAG 245F X24 - مقاس 24 بوصة', category: 'شاشات', brand: 'MSI',
    price: 140,
    image: IMG('12d64c60-1eb7-4ff8-b701-f64fbad9a775'),
    desc: 'شاشة MSI 24 بوصة للألعاب بمعدل تحديث عالٍ واستجابة سريعة.',
    features: ['24 بوصة', 'Gaming', 'Rapid IPS'],
    specs: { type: 'شاشة', screen: '24 بوصة', extra: 'Gaming • Rapid IPS' },
    link: '/products/00995'
  },
  {
    id: 'msi-mag-244f', name: 'MSI MAG 244F Gaming Monitor', category: 'شاشات', brand: 'MSI',
    price: 130,
    image: IMG('91de1c5d-ad11-4c37-bb13-5c437d983fab'),
    desc: 'شاشة MSI MAG 244F للألعاب، توازن ممتاز بين السعر والأداء.',
    features: ['24 بوصة', 'Gaming', 'FHD'],
    specs: { type: 'شاشة', screen: '24 بوصة FHD', extra: 'Gaming' },
    link: '/products/00994'
  },
  {
    id: 'msi-mag-274qf', name: 'شاشة MSI MAG 274QF X24 27" 2K 240Hz Rapid IPS', category: 'شاشات', brand: 'MSI',
    price: 225,
    image: IMG('c9533279-ee9d-4820-bf69-ac2a1fad2f74'),
    desc: 'شاشة MSI 27 بوصة بدقة 2K ومعدل 240Hz، تجربة ألعاب فائقة السلاسة.',
    features: ['27 بوصة 2K', '240Hz', 'Rapid IPS'],
    specs: { type: 'شاشة', screen: '27 بوصة 2K • 240Hz', extra: 'Rapid IPS' },
    link: '/products/001002'
  },
  {
    id: 'msi-mp246e18', name: 'شاشة MSI PRO MP246E18 23.8" FHD 180Hz', category: 'شاشات', brand: 'MSI',
    price: 135,
    image: IMG('71430c13-0361-4b6e-8db4-3cc18d38671d'),
    desc: 'شاشة MSI PRO 23.8 بوصة FHD بمعدل 180Hz، مناسبة للعمل والألعاب.',
    features: ['23.8 بوصة FHD', '180Hz', 'IPS'],
    specs: { type: 'شاشة', screen: '23.8 بوصة FHD • 180Hz', extra: 'IPS' },
    link: '/products/001003'
  },
  {
    id: 'msi-mag-245f-x24', name: 'شاشة ألعاب MSI MAG 245F X24 مقاس 23.8 بوصة بدقة Full HD، لوحة Rapid IPS، تردد 240 هرتز، زمن استجابة أدنى 0.5ms GtG، ودعم AI Vision وAMD FreeSync Premium', category: 'شاشات', brand: 'MSI',
    price: 145,
    image: IMG('3824af14-ef5d-40b9-b45d-5cd58750e429'),
    desc: 'شاشة MSI 23.8 بوصة Rapid IPS بمعدل 240Hz واستجابة 0.5ms، مع FreeSync Premium.',
    features: ['23.8 بوصة FHD', '240Hz', '0.5ms GtG', 'FreeSync Premium'],
    specs: { type: 'شاشة', screen: '23.8 بوصة FHD • 240Hz', extra: '0.5ms • FreeSync Premium' },
    link: '/products/009950'
  }
];

/* Merge all products collected from the 26 original category pages */
if (typeof ADMIN_PRODUCTS === 'undefined' && typeof CATEGORY_PRODUCTS !== 'undefined') {
  const byLink = new Map();
  PRODUCTS.forEach(p => {
    const m = /\/products\/([^/?#]+)/.exec(p.link || '');
    if (m) byLink.set(m[1], p);
  });
  const defs = typeof CATEGORY_DEFS !== 'undefined' ? CATEGORY_DEFS : [];
  Object.entries(CATEGORY_PRODUCTS).forEach(([slug, group]) => {
    const def = defs.find(c => c.slug === slug);
    const arabic = def ? def.name : '';
    (group.products || []).forEach(item => {
      const existing = byLink.get(String(item.id));
      if (existing) {
        existing.price = item.price;
        existing.category = arabic || existing.category;
        existing.slug = slug;
        if (!existing.image) existing.image = IMG(item.image);
        if (item.oldPrice) existing.oldPrice = item.oldPrice;
        if (item.brand && !existing.brand) existing.brand = item.brand;
        if (item.images?.length && !existing.images?.length) existing.images = item.images;
        if (item.desc && !existing.desc) existing.desc = item.desc;
        if (item.features?.length > (existing.features?.length || 0)) existing.features = item.features;
        if (item.specs && Object.keys(existing.specs || {}).length <= 1) {
          existing.specs = { ...(existing.specs || {}), ...item.specs };
        }
        return;
      }
      const clean = String(item.name || '').trim();
      const bits = clean.split(/\s+-\s+|\s+\|\s+/).filter(Boolean);
      const p = {
        id: String(item.id),
        name: clean,
        nameEn: item.nameEn || '',
        category: arabic || item.label || '',
        slug,
        brand: item.brand || '',
        price: item.price,
        oldPrice: item.oldPrice || 0,
        image: IMG(item.image),
        images: item.images || [],
        desc: item.desc || `${item.label || arabic} — ${clean.slice(0, 130)}${clean.length > 130 ? '…' : ''}. متوفر لدى ربيع للتجارة مع إمكانية الطلب المباشر عبر واتساب.`,
        features: item.features?.length ? item.features : bits.slice(0, 4),
        specs: item.specs && Object.keys(item.specs).length ? item.specs : { type: item.label || arabic },
        stock: item.stock || 0,
        featured: !!item.featured,
        deal: !!item.deal,
        link: `/products/${item.id}`,
        fetched: true
      };
      PRODUCTS.push(p);
      byLink.set(String(item.id), p);
    });
  });
}

const CATEGORIES = (typeof CATEGORY_DEFS !== 'undefined' ? CATEGORY_DEFS : []).map(c => ({
  name: c.name, icon: c.icon, slug: c.slug, en: c.en
}));

const BRANDS = ['ASUS','MSI','Dell','HP','MAJESTY','LovingCool','FANTECH','REDRAGON','Attack Shark','Hyper X','Logitech','MEETION','Sony','LENOVO','AMD','ACER','Intel','Corsair','Gigabyte','Lexar','G Tech','R8','ARZOPA','SteelSeries','NVIDIA','LG','SAMSUNG','AOC','FUJITSU','DARK FLASH','THERMAL RIGHT','microsoft','HUAWEL','TOSHIBA','CERTER','apple','LED','philips','E-YOOSO','JEDEL','HAVIT','T-WOLF','JARTECH','DeepCool','JIESHUO','Asetek','COOLMOON','ROG','COOLER MASTER','PNY','ZOTAC','SAPPHIRE','idealink','FSP','KINGSTONE','RAZER'];

const PC_PARTS = ['كمبيوترات','كروت شاشة','اللوحة الام','معالج','رام','تخزين SSD / HDD','بور سبلاي','مبرد معالج','كيس كمبيوتر','مراوح كيس'];

const COMPARE_TABS = [
  { id: 'all', label: 'الكل — قارن أي شيئين', icon: 'fa-solid fa-layer-group', filter: () => true },
  { id: 'pcs', label: 'كمبيوترات', icon: 'fa-solid fa-desktop', filter: (p) => PC_PARTS.includes(p.category) },
  { id: 'laptops', label: 'لابتوبات', icon: 'fa-solid fa-laptop', filter: (p) => p.category === 'لابتوبات' },
  { id: 'components', label: 'مكونات وإكسسوارات', icon: 'fa-solid fa-microchip', filter: (p) => !PC_PARTS.includes(p.category) && p.category !== 'لابتوبات' }
];

/* ---------------- HELPERS ---------------- */
function esc(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
function waLink(p) {
  const text = `مرحباً، أرغب بشراء ${p.name} بسعر $${p.price}.\n${SITE}${p.link}`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}
function catWaLink(category) {
  const text = `مرحباً، أرغب بالاستفسار عن قسم ${category}.`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}
function catCount(name) {
  const def = CATEGORIES.find(c => c.name === name);
  return PRODUCTS.filter(p => def ? (p.slug === def.slug || p.category === name) : p.category === name).length;
}
function countLabel(n) {
  if (n === 0) return 'اطلب حسب الطلب';
  if (n === 1) return 'منتج واحد متوفر';
  if (n === 2) return 'منتجان متوفران';
  if (n >= 3 && n <= 10) return `${n} منتجات متوفرة`;
  return `${n} منتج متوفر`;
}
function priceLabel(p) { return p.price === 0 ? 'السعر عند الطلب' : `$${p.price}`; }
function shortName(name, max = 62) { return name.length > max ? name.slice(0, max).trim() + '…' : name; }

/* Arabic-aware search: unifies spelling variants and searches specs/brand/category too */
function normText(value) {
  return String(value || '').toLowerCase()
    .replace(/[\u064b-\u065f\u0670]/g, '')
    .replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
    .replace(/[،,؛;:()\[\]{}"'\-_/\\|•·+]+/g, ' ')
    .replace(/\s+/g, ' ').trim();
}
function searchIndex(p) {
  if (!p._searchIndex) {
    p._searchIndex = {
      name: normText(p.name),
      category: normText(p.category),
      text: normText([p.name, p.nameEn, p.category, p.brand, p.id, p.desc,
        ...Object.values(p.specs || {}), ...(p.features || [])].join(' '))
    };
  }
  return p._searchIndex;
}
const SEARCH_SLUG_BOOST = {
  laptop: 'laptops', laptops: 'laptops', 'لابتوب': 'laptops', 'لابتوبات': 'laptops',
  gpu: 'gpu', 'كروت شاشة': 'gpu', cpu: 'cpu', 'معالج': 'cpu',
  monitor: 'monitor', 'شاشة': 'monitor', mouse: 'mouse', 'ماوس': 'mouse',
  keyboard: 'keyboard', 'كيبورد': 'keyboard', ssd: 'storage', 'تخزين': 'storage', ps4: 'playstations'
};
function searchProducts(query) {
  const q = normText(query);
  if (!q) return [];
  const tokens = q.split(' ').filter(Boolean);
  const boostSlug = SEARCH_SLUG_BOOST[q];
  return PRODUCTS.map(p => {
    const idx = searchIndex(p);
    let score = 0;
    if (idx.name === q) score += 120;
    else if (idx.name.startsWith(q)) score += 80;
    else if (idx.name.includes(q)) score += 60;
    const nameHits = tokens.filter(t => idx.name.includes(t)).length;
    const textHits = tokens.filter(t => idx.text.includes(t)).length;
    const catHits = tokens.filter(t => idx.category.includes(t)).length;
    if (nameHits === tokens.length) score += 40 + nameHits * 4;
    else score += nameHits * 6;
    if (textHits === tokens.length) score += 24 + textHits * 3;
    else score += textHits * 2;
    if (catHits) score += 10 + catHits * 3;
    if (boostSlug && p.slug === boostSlug) score += 150;
    if (!nameHits && textHits < Math.ceil(tokens.length / 2) && !catHits && p.slug !== boostSlug) score = 0;
    if (score && (p.deal || p.featured)) score += 3;
    return { p, score };
  }).filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score || a.p.name.length - b.p.name.length)
    .map(x => x.p);
}

/* Accessories have no meaningful performance metric — never invent a number for them */
const NO_PERF_CATEGORIES = [
  'كراسي وطاولات', 'حقيبة لاب توب', 'كيبورد', 'ماوس', 'كبلات', 'سماعات',
  'سبيكرات', 'مايكروفونات', 'اكسسوارات', 'طابعة', 'مزود طاقة احتياطي موفر للطاقة',
  'بلايستيشن', 'كونسول العاب', 'تابلت'
];

/* Approximate PassMark-equivalent marks for common parts missing from the exact table */
const ESTIMATE_MARKS = [
  { type:'gpu', re:/rtx\s?5090\b/i, mark:39033 }, { type:'gpu', re:/rtx\s?5080\b/i, mark:35652 },
  { type:'gpu', re:/rtx\s?4090\b/i, mark:38013 }, { type:'gpu', re:/rtx\s?4080\b/i, mark:34442 },
  { type:'gpu', re:/rtx\s?4070\b/i, mark:26852 }, { type:'gpu', re:/rtx\s?4060\s?ti\b/i, mark:22597 },
  { type:'gpu', re:/rtx\s?4060\b/i, mark:19477 }, { type:'gpu', re:/rtx\s?3090\b/i, mark:26456 },
  { type:'gpu', re:/rtx\s?3080\b/i, mark:24966 }, { type:'gpu', re:/rtx\s?3070\b/i, mark:22059 },
  { type:'gpu', re:/rtx\s?3060\s?ti\b/i, mark:20206 }, { type:'gpu', re:/rtx\s?2060\b/i, mark:14068 },
  { type:'gpu', re:/gtx\s?1660\b/i, mark:12539 }, { type:'gpu', re:/gtx\s?1650\b/i, mark:9000 },
  { type:'gpu', re:/gtx\s?1080\b/i, mark:15608 }, { type:'gpu', re:/gtx\s?1070\b/i, mark:13510 },
  { type:'gpu', re:/gtx\s?1060\b/i, mark:9800 }, { type:'gpu', re:/gtx\s?1050\b/i, mark:7200 },
  { type:'gpu', re:/rx\s?7900\s?xtx\b/i, mark:31469 }, { type:'gpu', re:/rx\s?7900\s?xt\b/i, mark:29127 },
  { type:'gpu', re:/rx\s?7800\s?xt\b/i, mark:24482 }, { type:'gpu', re:/rx\s?7700\s?xt\b/i, mark:22797 },
  { type:'gpu', re:/rx\s?7600\b/i, mark:16429 }, { type:'gpu', re:/rx\s?6700\s?xt\b/i, mark:19712 },
  { type:'gpu', re:/rx\s?6600\b/i, mark:15030 }, { type:'gpu', re:/rx\s?580\b/i, mark:7800 },
  { type:'cpu', re:/ryzen\s?9\s?9950x/i, mark:65000 }, { type:'cpu', re:/ryzen\s?9\s?7950x/i, mark:62000 },
  { type:'cpu', re:/ryzen\s?7\s?9800x3d/i, mark:48000 }, { type:'cpu', re:/ryzen\s?7\s?7800x3d/i, mark:40000 },
  { type:'cpu', re:/ryzen\s?7\s?7700/i, mark:32000 }, { type:'cpu', re:/ryzen\s?5\s?7600/i, mark:28000 },
  { type:'cpu', re:/ryzen\s?7\s?5800x/i, mark:26000 }, { type:'cpu', re:/ryzen\s?5\s?5600/i, mark:22000 },
  { type:'cpu', re:/ryzen\s?5\s?3600/i, mark:20000 }, { type:'cpu', re:/i9[\s-]?14900k/i, mark:59000 },
  { type:'cpu', re:/i7[\s-]?14700k/i, mark:50000 }, { type:'cpu', re:/i7[\s-]?13700k/i, mark:45000 },
  { type:'cpu', re:/i5[\s-]?13600k/i, mark:38000 }, { type:'cpu', re:/i7[\s-]?12700k/i, mark:40000 },
  { type:'cpu', re:/i5[\s-]?12600k/i, mark:34000 }, { type:'cpu', re:/i7[\s-]?11700/i, mark:26000 },
  { type:'cpu', re:/i5[\s-]?11400/i, mark:20000 }, { type:'cpu', re:/i7[\s-]?10700/i, mark:23000 },
  { type:'cpu', re:/i5[\s-]?10400/i, mark:17000 }, { type:'cpu', re:/i7[\s-]?9700/i, mark:17000 },
  { type:'cpu', re:/i5[\s-]?9600k/i, mark:13000 }, { type:'cpu', re:/i7[\s-]?8700/i, mark:18000 },
  { type:'cpu', re:/i5[\s-]?8500/i, mark:10500 }, { type:'cpu', re:/i3[\s-]?10100/i, mark:11000 },
  { type:'cpu', re:/i3[\s-]?8100/i, mark:7500 }
];

function estimateHit(src, type) {
  return ESTIMATE_MARKS.find(e => e.type === type && e.re.test(src)) || null;
}

/* Real specs -> a clearly-labelled estimate, not a fabricated PassMark number */
function componentSpecScore(p, src) {
  const U = String(src || '').toUpperCase();
  const cat = p.category || '';
  let s = 20;
  if (/شاشة|شاشات|MONITOR/.test(cat)) {
    const hz = Number((U.match(/(\d{2,3})\s?(?:HZ|هرتز)/) || [])[1]) || 0;
    if (hz >= 240) s += 55; else if (hz >= 165) s += 42; else if (hz >= 144) s += 36;
    else if (hz >= 120) s += 28; else if (hz >= 75) s += 12;
    if (/4K|UHD/.test(U)) s += 22; else if (/2K|QHD|1440/.test(U)) s += 14;
    if (/OLED/.test(U)) s += 14; else if (/IPS|RAPID/.test(U)) s += 7;
  } else if (/رام|DDR|MEMORY/.test(cat + U)) {
    const cap = Number((U.match(/(\d{1,3})\s?GB/) || [])[1]) || 0;
    const speed = Number((U.match(/(\d{3,4})\s?MHZ/) || [])[1]) || 0;
    s += Math.min(35, cap * 1.1);
    if (/DDR5/.test(U)) s += 22; else if (/DDR4/.test(U)) s += 10;
    if (speed >= 7000) s += 18; else if (speed >= 6000) s += 13; else if (speed >= 4800) s += 8;
  } else if (/تخزين|SSD|HDD|NVME/.test(cat + U)) {
    const tb = Number((U.match(/(\d+(?:\.\d+)?)\s?TB/) || [])[1]) || 0;
    const gb = Number((U.match(/(\d{3,4})\s?GB/) || [])[1]) || 0;
    s += Math.min(40, (tb || gb / 1000) * 16);
    if (/NVME|PCIE|M\.2/.test(U)) s += 30; else if (/SSD/.test(U)) s += 16;
  } else if (/بور سبلاي|POWER SUPPLY| PSU/.test(cat + U)) {
    const w = Number((U.match(/(\d{3,4})\s?W(?:ATT)?\b/) || [])[1]) || 0;
    s += Math.min(55, Math.max(0, (w - 400) / 12));
    if (/PLATINUM/.test(U)) s += 20; else if (/GOLD/.test(U)) s += 15; else if (/BRONZE/.test(U)) s += 8;
    if (/MODULAR/.test(U)) s += 6;
  } else if (/مبرد|COOLER/.test(cat + U)) {
    const mm = Number((U.match(/(\d{3})\s?MM/) || [])[1]) || 0;
    if (mm >= 360) s += 45; else if (mm >= 280) s += 35; else if (mm >= 240) s += 28;
    if (/AIO|LIQUID|مائي|سائل/.test(U)) s += 12;
    if (/LCD|RGB/.test(U)) s += 5;
  } else if (/اللوحة الام|لوحة أم|MOTHERBOARD/.test(cat + U)) {
    if (/Z790|X670|B850|X870/.test(U)) s += 45;
    else if (/B760|B650|B550/.test(U)) s += 32;
    else if (/H610|A620/.test(U)) s += 12;
    if (/DDR5/.test(U)) s += 12;
    if (/WIFI/.test(U)) s += 5;
  } else if (/كيس|CASE/.test(cat)) {
    if (/ATX|MID/.test(U)) s += 18;
    if (/GLASS|TEMPERED|ARGB/.test(U)) s += 10;
  } else if (/مراوح|FAN/.test(cat)) {
    const cnt = Number((U.match(/(\d+)\s?(?:FAN|مروحة)/) || [])[1]) || 1;
    s += Math.min(20, cnt * 6);
    if (/ARGB|LCD/.test(U)) s += 8;
  } else if (/تجميعة|كمبيوترات|GAMING PC/.test(cat + U)) {
    const gpu = estimateHit(U, 'gpu');
    const cpu = estimateHit(U, 'cpu');
    if (gpu) s += Math.round(gpu.mark / BENCHMARK_MAX.gpu * 60);
    if (cpu) s += Math.round(cpu.mark / BENCHMARK_MAX.cpu * 35);
    if (/1440P|4K/.test(U)) s += 5;
  } else if (/لابتوبات|LAPTOP|NOTEBOOK/.test(cat + U)) {
    /* Laptops without an exact CPU/Match entry still get a clearly-labelled spec estimate */
    const genWord = U.match(/الجيل\s+(الأول|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع|العاشر)/);
    const words = ['الأول','الثاني','الثالث','الرابع','الخامس','السادس','السابع','الثامن','التاسع','العاشر'];
    if (genWord && genWord[1]) s += Math.min(30, (words.indexOf(genWord[1]) + 1) * 3);
    if (/CORE\s?I9|RYZEN\s?9/.test(U)) s += 26;
    else if (/CORE\s?I7|RYZEN\s?7/.test(U)) s += 20;
    else if (/CORE\s?I5|RYZEN\s?5/.test(U)) s += 14;
    else if (/CORE\s?I3/.test(U)) s += 8;
    else if (/CELERON|PENTIUM/.test(U)) s += 3;
    const ram = Number((U.match(/(\d{1,2})\s?GB/) || [])[1]) || 0;
    s += Math.min(15, ram);
    if (/SSD|NVME/.test(U)) s += 6;
    if (/2K|QHD|1440P|4K/.test(U)) s += 5;
  } else {
    return null;
  }
  return Math.max(1, Math.min(100, Math.round(s)));
}

/* Returns null when the product has no meaningful performance metric */
function estimatePowerScore(p) {
  const src = `${p.name || ''} ${Object.values(p.specs || {}).join(' ')} ${(p.features || []).join(' ')}`;
  const U = String(src).toUpperCase();
  if (NO_PERF_CATEGORIES.includes(p.category || '')) return null;
  const gpu = estimateHit(U, 'gpu');
  const cpu = estimateHit(U, 'cpu');
  if (gpu || cpu) {
    const g = gpu ? Math.round(gpu.mark / BENCHMARK_MAX.gpu * 100) : 0;
    const c = cpu ? Math.round(cpu.mark / BENCHMARK_MAX.cpu * 100) : 0;
    return Math.max(1, Math.min(100, g && c ? Math.round(g * .6 + c * .4) : (g || c)));
  }
  return componentSpecScore(p, src);
}
function estimatePowerDetail(p) {
  const U = String(`${p.name || ''} ${Object.values(p.specs || {}).join(' ')}`).toUpperCase();
  const gpu = estimateHit(U, 'gpu');
  const cpu = estimateHit(U, 'cpu');
  if (gpu || cpu) {
    return [gpu && `${gpu.mark.toLocaleString('en-US')} G3D (تقديري)`, cpu && `${cpu.mark.toLocaleString('en-US')} CPU Mark (تقديري)`].filter(Boolean).join(' • ');
  }
  return 'تقييم تقديري من المواصفات (السعة / السرعة / المقاس) — ليس رقماً مخبرياً';
}

function benchmarkMatches(p) {
  const src = `${p.name || ''} ${Object.values(p.specs || {}).join(' ')} ${(p.features || []).join(' ')}`;
  const found = [];
  BENCHMARKS.forEach(b => {
    if (found.some(x => x.type === b.type)) return;
    if (b.id && p.id !== b.id) return;
    if (b.re && !b.re.test(src)) return;
    found.push(b);
  });
  return found;
}

function normalizedMark(b) {
  return Math.max(1, Math.min(100, Math.round((b.mark / BENCHMARK_MAX[b.type]) * 100)));
}

function benchmarkInfo(p) {
  const matches = benchmarkMatches(p);
  if (!matches.length) {
    const score = estimatePowerScore(p);
    if (score === null) {
      return {
        score: null, real: false, kind: 'none',
        source: 'بدون قياس أداء', url: '',
        detail: 'هذا المنتج ملحق أو إكسسوار ولا يوجد له رقم أداء قابل للمقارنة',
        short: 'بدون قياس أداء'
      };
    }
    return {
      score, real: false, kind: 'spec',
      source: 'تقدير حسب المواصفات', url: '',
      detail: estimatePowerDetail(p),
      short: `تقدير حسب المواصفات — ${estimatePowerDetail(p)}`
    };
  }
  const cpu = matches.find(m => m.type === 'cpu');
  const gpu = matches.find(m => m.type === 'gpu');
  const score = cpu && gpu
    ? Math.round(normalizedMark(gpu) * .6 + normalizedMark(cpu) * .4)
    : normalizedMark(gpu || cpu);
  const parts = matches.map(m => `${m.model}: ${m.mark.toLocaleString('en-US')}`).join(' • ');
  const note = matches.find(m => m.note)?.note || '';
  const source = cpu && gpu
    ? 'PassMark CPU Mark + G3D Mark'
    : BENCHMARK_SOURCES[matches[0].type].label;
  return {
    score,
    real: true,
    kind: cpu && gpu ? 'combo' : (gpu ? 'gpu' : 'cpu'),
    source,
    url: BENCHMARK_SOURCES[(gpu || cpu).type].url,
    detail: `${parts}${note ? ` — ${note}` : ''}`,
    short: `${source} — ${parts}`
  };
}

/* Real PassMark-derived power score (0-100), a labelled estimate, or null for accessories */
function powerScore(p) { return benchmarkInfo(p).score; }

/* Price-to-power value, normalised 0-100 inside the given comparison set */
function valueScore(p, set) {
  const score = powerScore(p);
  if (!p.price || score === null) return 0;
  const ratio = score / p.price;
  const best = set.reduce((max, x) => {
    const s = powerScore(x);
    return Math.max(max, x.price && s !== null ? s / x.price : 0);
  }, 0);
  return best > 0 ? Math.max(1, Math.min(100, Math.round((ratio / best) * 100))) : 0;
}
function scoreBar(score, label, detail = '') {
  if (score === null || score === undefined) {
    return `<span class="score-badge score-none" title="لا يوجد قياس أداء قابل للمقارنة لهذا المنتج"><i class="fa-solid fa-minus"></i> —</span>`;
  }
  const title = detail ? `${label} — ${detail}` : label;
  return `<span class="score-badge" title="${esc(title)}"><i class="fa-solid fa-bolt"></i> ${score}<span class="score-track"><span style="width:${score}%"></span></span></span>`;
}

/* ---------------- RENDER ---------------- */
function renderBrands() {
  const track = document.getElementById('brandTrack');
  if (!track) return;
  const items = [...BRANDS, ...BRANDS].map(b => `<span class="marquee-item">${esc(b)}</span>`).join('');
  track.innerHTML = items;
}

function renderCategories() {
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  grid.innerHTML = CATEGORIES.map((c, i) => {
    const count = catCount(c.name);
    return `
      <a class="cat-card reveal-up" href="category.html?cat=${encodeURIComponent(c.slug)}" data-nav aria-label="${esc(c.name)}" style="--d:${(i % 6) * .035}s">
        <span class="cat-icon"><i class="${c.icon}"></i></span>
        <span class="cat-name">${esc(c.name)}</span>
        <span class="cat-count">${countLabel(count)}</span>
        <span class="cat-arrow"><i class="fa-solid fa-arrow-left"></i></span>
      </a>`;
  }).join('');
  const pill = document.getElementById('catCountPill');
  if (pill) pill.textContent = CATEGORIES.length;
}

function productCard(p, i) {
  const wa = waLink(p);
  const name = esc(p.name);
  return `
    <article class="product-card reveal-up" data-product="${p.id}" style="--d:${(i % 4) * .06}s" tabindex="0" role="button" aria-label="عرض تفاصيل ${name}">
      ${p.badge ? `<span class="discount-badge">${esc(p.badge)}</span>` : ''}
      <div class="product-media">
        <img class="product-img" src="${p.image}" alt="${name}" loading="lazy">
        <span class="quick-view"><i class="fa-solid fa-expand"></i> عرض سريع</span>
        <button class="zoom-btn" type="button" data-zoom="${p.image}" data-zoom-name="${name}" aria-label="تكبير صورة ${name}"><i class="fa-solid fa-magnifying-glass-plus"></i></button>
      </div>
      <p class="product-cat">${esc(p.category)}</p>
      <h3 class="product-name">${name}</h3>
      <div class="product-prices">
        <span class="price-now">${priceLabel(p)}</span>
        ${p.oldPrice ? `<span class="price-old">$${p.oldPrice}</span>` : ''}
      </div>
      <a class="btn-wa-product" href="${wa}" target="_blank" rel="noopener" data-wa aria-label="اطلب ${name} عبر واتساب">
        <i class="fa-brands fa-whatsapp"></i> اطلب عبر واتساب
      </a>
    </article>`;
}

function renderProducts() {
  const deals = document.getElementById('dealsGrid');
  const featured = document.getElementById('featuredGrid');
  if (deals) deals.innerHTML = PRODUCTS.filter(p => p.deal).slice(0, 8).map(productCard).join('');
  if (featured) featured.innerHTML = PRODUCTS.filter(p => p.featured).slice(0, 8).map(productCard).join('');
}

function showcaseTile(p, i) {
  return `
    <button class="showcase-tile reveal-piece" type="button" data-product="${p.id}" style="--d:${.06 + i * .05}s">
      <span class="tile-no">${String(i + 1).padStart(2, '0')}</span>
      <span class="tile-media"><img src="${p.image}" alt="${esc(p.name)}" loading="lazy"></span>
      <span class="tile-info">
        <span class="tile-name">${esc(shortName(p.name, 72))}</span>
        <span class="tile-price">${priceLabel(p)}</span>
      </span>
      <span class="tile-open"><i class="fa-solid fa-arrow-left"></i></span>
    </button>`;
}

function renderShowcases() {
  const groups = {
    pcsGrid: (p) => p.category === 'كمبيوترات' || PC_PARTS.includes(p.category),
    laptopsGrid: (p) => p.category === 'لابتوبات',
    asusGrid: (p) => p.brand === 'ASUS',
    msiGrid: (p) => p.brand === 'MSI'
  };
  Object.entries(groups).forEach(([id, filter]) => {
    const el = document.getElementById(id);
    if (!el) return;
    const items = PRODUCTS.filter(filter).slice(0, 8);
    el.innerHTML = items.map(showcaseTile).join('');
  });
}

/* ---------------- MODAL ---------------- */
const overlay = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');
const modalEl = overlay ? overlay.querySelector('.modal') : null;
let lastFocus = null;
let stopCompareSpin = null;

function openModal(html, wide = false) {
  lastFocus = document.activeElement;
  modalBody.innerHTML = html;
  if (modalEl) modalEl.classList.toggle('wide', wide);
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  if (modalEl) modalEl.scrollTop = 0;
  requestAnimationFrame(() => {
    const focusEl = modalBody.querySelector('[data-autofocus]');
    if (focusEl) focusEl.focus({ preventScroll: true });
  });
}

function closeModal() {
  if (stopCompareSpin) { stopCompareSpin(); stopCompareSpin = null; }
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (modalEl) modalEl.classList.remove('wide');
  if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus({ preventScroll: true });
}

function openProduct(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const wa = waLink(p);
  const bench = benchmarkInfo(p);
  const name = esc(p.name);
  openModal(`
    <div class="pm-grid">
      <div class="pm-media">
        ${p.badge ? `<span class="discount-badge">${esc(p.badge)}</span>` : ''}
        <img src="${p.image}" alt="${name}">
        <button class="zoom-btn zoom-btn-lg" type="button" data-zoom="${p.image}" data-zoom-name="${name}" aria-label="تكبير الصورة"><i class="fa-solid fa-magnifying-glass-plus"></i></button>
      </div>
      <div class="pm-info">
        <span class="pm-cat">${esc(p.category)}</span>
        <h2 class="pm-name">${name}</h2>
        <div class="pm-prices">
          <span class="pm-price">${priceLabel(p)}</span>
          ${p.oldPrice ? `<span class="pm-old">$${p.oldPrice}</span>` : ''}
          ${p.oldPrice ? `<span class="pm-save">وفّر $${p.oldPrice - p.price}</span>` : ''}
        </div>
        <p class="pm-desc">${esc(p.desc)}</p>
        <ul class="pm-features">${p.features.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
        <p class="bench-note" title="${esc(bench.short)}">
          <i class="fa-solid fa-chart-line"></i>
          <span>${bench.real ? `<a class="bench-link" href="${bench.url}" target="_blank" rel="noopener">${esc(bench.source)}</a>` : `<b>${esc(bench.source)}</b>`} — ${esc(bench.detail)}</span>
        </p>
        <div class="pm-actions">
          <a class="btn-primary" href="${wa}" target="_blank" rel="noopener" data-autofocus>
            <i class="fa-brands fa-whatsapp"></i> اطلب عبر واتساب
          </a>
          <button class="btn-secondary" type="button" data-add-compare="${p.id}">
            <i class="fa-solid fa-scale-balanced"></i> أضف للمقارنة
          </button>
        </div>
      </div>
    </div>
  `);
}

function miniProduct(p, opts = {}) {
  const name = esc(p.name);
  return `
    <button class="mini-product" type="button" data-open-product="${p.id}">
      <img src="${p.image}" alt="${name}" loading="lazy">
      ${opts.category ? `<span class="mini-cat">${esc(p.category)}</span>` : ''}
      <span class="mini-name">${name}</span>
      <span class="mini-price">${priceLabel(p)}</span>
    </button>`;
}

function openCategory(name) {
  const cat = CATEGORIES.find(c => c.name === name);
  const items = PRODUCTS.filter(p => p.category === name);
  const icon = cat ? cat.icon : 'fa-solid fa-box';
  const wa = catWaLink(name);
  const grid = items.length
    ? items.map(miniProduct).join('')
    : `<p class="cm-empty">لا توجد منتجات معروضة حالياً في هذا القسم — راسلنا وسنوفرها لك حسب الطلب.</p>`;
  openModal(`
    <div class="cm-head">
      <div class="cm-icon"><i class="${icon}"></i></div>
      <div>
        <h2>${esc(name)}</h2>
        <p>${countLabel(items.length)}</p>
      </div>
    </div>
    <div class="cm-grid">${grid}</div>
    <div class="cm-cta">
      <p>تحتاج مساعدة في الاختيار؟ راسلنا مباشرة.</p>
      <a class="btn-primary" href="${wa}" target="_blank" rel="noopener">
        <i class="fa-brands fa-whatsapp"></i> استفسر عن القسم
      </a>
    </div>
  `);
}

function openAllProducts() {
  openModal(`
    <div class="cm-head">
      <div class="cm-icon"><i class="fa-solid fa-grip"></i></div>
      <div>
        <h2>كل المنتجات</h2>
        <p>${countLabel(PRODUCTS.length)}</p>
      </div>
    </div>
    <div class="cm-grid">${PRODUCTS.map(miniProduct).join('')}</div>
    <div class="cm-cta">
      <p>لم تجد ما تبحث عنه؟ أخبرنا بالمواصفات والميزانية.</p>
      <a class="btn-primary" href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('مرحباً، أبحث عن منتج معين — هل يمكنكم مساعدتي؟')}" target="_blank" rel="noopener">
        <i class="fa-brands fa-whatsapp"></i> راسلنا على واتساب
      </a>
    </div>
  `);
}

function openSearchResults(query, items) {
  const grid = items.length
    ? items.map(p => miniProduct(p, { category: true })).join('')
    : `<p class="cm-empty">لا توجد نتائج مطابقة — جرّب كلمة أقصر أو راسلنا وسنساعدك بالبحث.</p>`;
  openModal(`
    <div class="cm-head">
      <div class="cm-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
      <div>
        <h2>نتائج البحث: ${esc(query)}</h2>
        <p>${items.length ? `${countLabel(items.length)} — مرتبة حسب الأقرب لبحثك` : countLabel(0)}</p>
      </div>
    </div>
    <div class="cm-grid">${grid}</div>
    <div class="cm-cta">
      <p>لم تجد ما تبحث عنه؟ أخبرنا بالمواصفات والميزانية.</p>
      <a class="btn-primary" href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('مرحباً، أبحث عن منتج معين — هل يمكنكم مساعدتي؟')}" target="_blank" rel="noopener">
        <i class="fa-brands fa-whatsapp"></i> راسلنا على واتساب
      </a>
    </div>
  `);
}

/* ---------------- 3D COMPARE ---------------- */
const compare = { tab: 'all', selected: [], query: '', rx: -6, ry: 0, auto: true };

function tabProducts(tabId) {
  const tab = COMPARE_TABS.find(t => t.id === tabId) || COMPARE_TABS[0];
  return PRODUCTS.filter(tab.filter);
}
function groupForProduct(p) {
  if (p.category === 'لابتوبات') return 'laptops';
  if (PC_PARTS.includes(p.category)) return 'pcs';
  return 'components';
}
function syncDock() {
  const dockCount = document.getElementById('dockCount');
  if (!dockCount) return;
  dockCount.textContent = compare.selected.length
    ? `${compare.selected.length} منتجات مختارة للمقارنة`
    : 'اختر منتجين أو ثلاثة';
  document.getElementById('compareDock')?.classList.toggle('active', compare.selected.length > 0);
}

function compareSpecRows(tabId, items) {
  const scoreRows = [
    { label: 'السعر', get: p => p.price === 0 ? 'عند الطلب' : `$${p.price}`, low: true },
    {
      label: 'الأداء (0-100)',
      get: p => powerScore(p) === null ? '—' : powerScore(p),
      high: true, score: true,
      detail: p => benchmarkInfo(p).short
    },
    {
      label: 'القيمة مقابل السعر (0-100)',
      get: p => powerScore(p) === null ? '—' : valueScore(p, items),
      high: true, score: true,
      detail: p => powerScore(p) === null ? 'لا يوجد قياس أداء لهذا المنتج' : `الأداء: ${powerScore(p)}/100 — ${benchmarkInfo(p).short}`
    },
    { label: 'مصدر التقييم', get: p => benchmarkInfo(p).source }
  ];
  /* Dynamic spec rows: compare ANY categories, not just a fixed set */
  const keys = [];
  items.forEach(p => Object.keys(p.specs || {}).forEach(k => { if (!keys.includes(k)) keys.push(k); }));
  const labels = {
    type: 'النوع', gpu: 'كرت الشاشة', cpu: 'المعالج', ram: 'الرام',
    storage: 'التخزين', screen: 'الشاشة', os: 'نظام التشغيل', extra: 'تفاصيل إضافية'
  };
  const specRows = keys.slice(0, 8).map(k => ({
    label: labels[k] || k,
    get: p => (p.specs && p.specs[k]) || '—'
  }));
  return [
    ...scoreRows,
    { label: 'القسم', get: p => p.category || '—' },
    ...specRows,
    { label: 'أبرز المزايا', get: p => p.features?.slice(0, 2).join(' • ') || '—' }
  ];
}

function renderCompare() {
  const picker = document.getElementById('cmpPicker');
  const stageCards = document.getElementById('cmpCards');
  const table = document.getElementById('cmpTable');
  const totalEl = document.getElementById('cmpTotal');
  const waBtn = document.getElementById('cmpWa');
  if (!picker || !stageCards || !table) return;

  const tab = COMPARE_TABS.find(t => t.id === compare.tab);
  const products = tabProducts(compare.tab);
  compare.selected = compare.selected.filter(id => products.some(p => p.id === id)).slice(0, 3);

  document.querySelectorAll('[data-cmp-tab]').forEach(btn => {
    const active = btn.dataset.cmpTab === compare.tab;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  const query = (compare.query || '').trim().toLowerCase();
  const visible = products.filter(p => !query || `${p.name} ${p.category} ${p.brand || ''}`.toLowerCase().includes(query));
  picker.innerHTML = visible.slice(0, 40).map(p => {
    const on = compare.selected.includes(p.id);
    const bench = benchmarkInfo(p);
    const noScore = bench.score === null;
    const score = noScore ? '—' : valueScore(p, products);
    return `<button class="cmp-chip${on ? ' selected' : ''}" type="button" data-cmp-pick="${p.id}" aria-pressed="${on}">
      <img src="${p.image}" alt="" loading="lazy">
      <span>${esc(shortName(p.name, 42))}</span>
      <b>${priceLabel(p)}</b>
      <em class="chip-score${noScore ? ' score-none' : ''}" title="${noScore ? esc(bench.short) : `القيمة مقابل السعر: ${score}/100 — ${esc(bench.short)}`}">${score}</em>
      <i class="fa-solid fa-check"></i>
    </button>`;
  }).join('') || `<p class="cmp-no-results">لا توجد نتائج مطابقة — جرّب كلمة أخرى.</p>`;

  const selected = compare.selected.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  stageCards.innerHTML = selected.length
    ? selected.map((p, i) => {
        const bench = benchmarkInfo(p);
        const score = bench.score === null ? null : valueScore(p, selected);
        return `
        <div class="cmp-slot" style="--offset:${(i - (selected.length - 1) / 2).toFixed(1)}">
          <div class="cmp-pedestal"><span></span><span></span></div>
          <div class="cmp-card">
            <span class="cmp-card-no">0${i + 1}</span>
            <img src="${p.image}" alt="${esc(p.name)}" class="cmp-img-zoom" data-zoom="${p.image}" data-zoom-name="${esc(p.name)}">
            <span class="cmp-card-cat">${esc(p.category)}</span>
            <strong>${esc(shortName(p.name, 46))}</strong>
            <span class="cmp-card-price">${priceLabel(p)}</span>
            <span class="cmp-card-score">${scoreBar(score, 'القيمة مقابل السعر', bench.short)}</span>
            <span class="cmp-card-spec">${esc(p.specs?.gpu || p.specs?.cpu || p.specs?.type || p.features[0] || '')}</span>
          </div>
        </div>`;
      }).join('')
    : `<div class="cmp-empty-stage"><i class="fa-solid fa-scale-balanced"></i><p>اختر منتجين أو ثلاثة من الشريط أعلاه لعرضهم في مشهد ثلاثي الأبعاد.</p></div>`;

  table.style.setProperty('--cols', Math.max(1, selected.length));
  if (selected.length >= 2) {
    const rows = compareSpecRows(compare.tab, selected);
    table.innerHTML = `
      <div class="cmp-row cmp-row-head">
        <span>المواصفة</span>
        ${selected.map(p => `<span>${esc(shortName(p.name, 26))}</span>`).join('')}
      </div>
      ${rows.map(row => {
        let best = -1;
        if (row.low) {
          const priced = selected.filter(p => p.price > 0);
          if (priced.length) best = selected.indexOf(priced.reduce((a, b) => a.price < b.price ? a : b));
        } else if (row.high) {
          const num = v => { const n = Number(v); return Number.isFinite(n) ? n : -1; };
          best = selected.indexOf(selected.reduce((a, b) => num(row.get(a)) >= num(row.get(b)) ? a : b));
        }
        return `<div class="cmp-row">
          <span class="cmp-row-label">${row.label}</span>
          ${selected.map((p, i) => {
            const value = row.get(p);
            const width = Number.isFinite(Number(value)) ? Number(value) : 0;
            const content = row.score
              ? `<span class="cmp-score-cell${value === '—' ? ' score-none' : ''}" title="${esc(row.detail ? row.detail(p) : '')}">${value}<span class="score-track"><span style="width:${width}%"></span></span></span>`
              : esc(value);
            return `<span class="${i === best ? 'cmp-best' : ''}">${content}</span>`;
          }).join('')}
        </div>`;
      }).join('')}`;
  } else {
    table.innerHTML = `<p class="cmp-empty-table">أضف منتجاً آخر على الأقل لعرض جدول المقارنة.</p>`;
  }

  const total = selected.reduce((sum, p) => sum + p.price, 0);
  if (totalEl) totalEl.textContent = total ? `$${total}` : '—';
  if (waBtn) {
    const message = selected.length
      ? `مرحباً، أرغب بالاستفسار عن المقارنة التالية:\n${selected.map(p => `• ${p.name} — ${priceLabel(p)}`).join('\n')}\nالإجمالي: ${total ? '$' + total : 'عند الطلب'}`
      : 'مرحباً، أرغب بمساعدتك في اختيار منتج مناسب.';
    waBtn.href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    waBtn.disabled = selected.length === 0;
  }
  syncDock();
  applyStageTransform();
}

function applyStageTransform() {
  const cards = document.getElementById('cmpCards');
  if (!cards) return;
  cards.style.transform = `rotateX(${compare.rx}deg) rotateY(${compare.ry}deg)`;
}

function startCompareSpin() {
  if (!compare.auto) return;
  let raf;
  const loop = () => {
    compare.ry = (compare.ry + 0.22) % 360;
    applyStageTransform();
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  stopCompareSpin = () => cancelAnimationFrame(raf);
}

function openCompare(tabId, presetIds) {
  if (tabId) compare.tab = tabId;
  if (presetIds && presetIds.length) compare.selected = presetIds.slice(0, 3);
  openModal(`
    <div class="cmp">
      <div class="cmp-head">
        <div>
          <p class="section-eyebrow">Comparetor 3D</p>
          <h2>قارن واختر بثقة</h2>
          <p class="cmp-sub">أدر المشهد باسحاب الفأرة أو الإصبع، وقارن المواصفات والأسعار جنباً إلى جنب.</p>
        </div>
        <div class="cmp-head-icon"><i class="fa-solid fa-scale-balanced"></i></div>
      </div>
      <div class="cmp-tabs" role="tablist">
        ${COMPARE_TABS.map(t => `<button type="button" role="tab" data-cmp-tab="${t.id}"><i class="${t.icon}"></i> ${t.label}</button>`).join('')}
      </div>
      <div class="cmp-picker-top">
        <div class="cmp-picker-label"><i class="fa-solid fa-list-check"></i> اختر حتى 3 منتجات من أي قسم — القيمة من PassMark أو تقدير موثّق من المواصفات</div>
        <input type="search" id="cmpSearch" class="cmp-search" placeholder="ابحث عن منتج للمقارنة..." aria-label="ابحث عن منتج للمقارنة">
      </div>
      <div class="cmp-picker" id="cmpPicker"></div>
      <div class="cmp-stage" id="cmpStage">
        <div class="cmp-floor"></div>
        <div class="cmp-orbit orbit-a"></div>
        <div class="cmp-orbit orbit-b"></div>
        <div class="cmp-cards" id="cmpCards"></div>
        <span class="cmp-hint"><i class="fa-solid fa-rotate"></i> اسحب لتدوير المشهد</span>
      </div>
      <div class="cmp-controls">
        <button type="button" data-cmp-rotate="-25" aria-label="تدوير يسار"><i class="fa-solid fa-rotate-left"></i></button>
        <button type="button" id="cmpAuto" class="active" aria-pressed="true"><i class="fa-solid fa-play"></i> دوران تلقائي</button>
        <button type="button" data-cmp-rotate="25" aria-label="تدوير يمين"><i class="fa-solid fa-rotate-right"></i></button>
        <button type="button" id="cmpReset" aria-label="إعادة الضبط"><i class="fa-solid fa-arrows-rotate"></i> إعادة</button>
      </div>
      <div class="cmp-table" id="cmpTable"></div>
      <div class="cmp-foot">
        <div><span>الإجمالي</span><b id="cmpTotal">—</b></div>
        <a class="btn-primary" id="cmpWa" href="#" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> أرسل المقارنة على واتساب</a>
      </div>
    </div>
  `, true);
  const search = document.getElementById('cmpSearch');
  if (search) {
    search.value = compare.query;
    search.addEventListener('input', () => {
      compare.query = search.value;
      renderCompare();
    });
  }
  renderCompare();
  compare.auto = true;
  startCompareSpin();
}

function initCompareEvents() {
  overlay.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-cmp-tab]');
    if (tab) {
      compare.tab = tab.dataset.cmpTab;
      compare.selected = [];
      compare.auto = true;
      renderCompare();
      return;
    }
    const pick = e.target.closest('[data-cmp-pick]');
    if (pick) {
      const id = pick.dataset.cmpPick;
      const at = compare.selected.indexOf(id);
      if (at >= 0) compare.selected.splice(at, 1);
      else if (compare.selected.length < 3) compare.selected.push(id);
      else compare.selected = [compare.selected[1], compare.selected[2], id];
      renderCompare();
      return;
    }
    const rotate = e.target.closest('[data-cmp-rotate]');
    if (rotate) {
      compare.ry += Number(rotate.dataset.cmpRotate);
      applyStageTransform();
      return;
    }
    if (e.target.closest('#cmpAuto')) {
      const btn = document.getElementById('cmpAuto');
      compare.auto = !compare.auto;
      if (btn) {
        btn.classList.toggle('active', compare.auto);
        btn.setAttribute('aria-pressed', String(compare.auto));
        btn.innerHTML = compare.auto ? '<i class="fa-solid fa-play"></i> دوران تلقائي' : '<i class="fa-solid fa-pause"></i> دوران متوقف';
      }
      if (compare.auto) startCompareSpin();
      else if (stopCompareSpin) { stopCompareSpin(); stopCompareSpin = null; }
      return;
    }
    if (e.target.closest('#cmpReset')) {
      compare.rx = -6; compare.ry = 0; applyStageTransform();
    }
  });

  // drag to rotate the 3D stage
  let dragging = false, lastX = 0, lastY = 0;
  overlay.addEventListener('pointerdown', (e) => {
    if (!e.target.closest('#cmpStage')) return;
    dragging = true; lastX = e.clientX; lastY = e.clientY;
    e.target.closest('#cmpStage').setPointerCapture?.(e.pointerId);
  });
  overlay.addEventListener('pointermove', (e) => {
    if (!dragging || !document.getElementById('cmpStage')) return;
    compare.ry += (e.clientX - lastX) * 0.45;
    compare.rx = Math.max(-24, Math.min(24, compare.rx - (e.clientY - lastY) * 0.3));
    lastX = e.clientX; lastY = e.clientY;
    applyStageTransform();
  });
  const endDrag = () => { dragging = false; };
  overlay.addEventListener('pointerup', endDrag);
  overlay.addEventListener('pointercancel', endDrag);
}

/* ---------------- MODAL EVENTS ---------------- */
if (overlay) {
  document.getElementById('modalClose').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  document.addEventListener('click', (e) => {
    const zoom = e.target.closest('[data-zoom]');
    if (zoom) {
      e.preventDefault(); e.stopPropagation();
      openZoom(zoom.dataset.zoom, zoom.dataset.zoomName || '');
      return;
    }
    if (e.target.closest('[data-wa]')) return;
    const add = e.target.closest('[data-add-compare]');
    if (add) {
      const p = PRODUCTS.find(x => x.id === add.dataset.addCompare);
      if (p) openCompare('all', [p.id]);
      return;
    }
    const card = e.target.closest('.product-card, .showcase-tile');
    if (card) { openProduct(card.dataset.product); return; }
    const mini = e.target.closest('[data-open-product]');
    if (mini) { openProduct(mini.dataset.openProduct); return; }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.product-card');
    if (card && e.target === card) {
      e.preventDefault();
      openProduct(card.dataset.product);
    }
  });
}

/* ---------------- COMPARE BUTTONS ---------------- */
function initCompareButtons() {
  const openers = [
    'compareNavBtn', 'compareHeroBtn', 'compareStripBtn', 'compareDock'
  ].map(id => document.getElementById(id)).filter(Boolean);
  openers.forEach(btn => btn.addEventListener('click', () => openCompare(compare.tab)));

  document.querySelectorAll('[data-compare-group]').forEach(btn => {
    btn.addEventListener('click', () => openCompare(btn.dataset.compareGroup));
  });
  initCompareEvents();
  syncDock();
}

/* ---------------- COUNTDOWN ---------------- */
function tickCountdown() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  const diff = Math.max(0, end - now);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = String(val).padStart(2, '0'); };
  set('cdH', h); set('cdM', m); set('cdS', s);
}
tickCountdown();
setInterval(tickCountdown, 1000);

/* ---------------- THEME ---------------- */
(function initTheme() {
  const root = document.documentElement;
  const saved = localStorage.getItem('rt-theme');
  if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  const btn = document.getElementById('themeToggle');
  const icon = btn ? btn.querySelector('i') : null;
  function syncIcon() {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (icon) icon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
  syncIcon();
  if (btn) {
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('rt-theme', next);
      syncIcon();
    });
  }
})();

/* ---------------- MOBILE NAV ---------------- */
(function mobileNav() {
  const btn = document.getElementById('navMobileBtn');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;
  btn.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
})();

/* ---------------- SEARCH ---------------- */
(function initSearch() {
  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');
  const panel = document.getElementById('searchSuggestions');
  const wrap = document.querySelector('.search-wrap');
  if (!form || !input || !panel) return;

  let suggestions = [];
  let active = -1;

  function hide() {
    panel.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    active = -1;
  }

  function setActive(index) {
    const options = [...panel.querySelectorAll('.suggest-item, .suggest-all')];
    if (!options.length) return;
    active = (index + options.length) % options.length;
    options.forEach((el, i) => {
      const on = i === active;
      el.classList.toggle('active', on);
      if (el.dataset.sugIndex !== undefined) el.setAttribute('aria-selected', String(on));
    });
    options[active].scrollIntoView({ block: 'nearest' });
  }

  function render() {
    const q = input.value.trim();
    if (!q) { hide(); return; }
    const all = searchProducts(q);
    suggestions = all.slice(0, 6);
    if (!all.length) {
      panel.innerHTML = `
        <p class="suggest-empty">لا توجد نتائج سريعة لـ «${esc(q)}» — جرّب كلمة أقصر أو راسلنا وسنساعدك.</p>
        <a class="suggest-wa" href="https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`مرحباً، أبحث عن: ${q}`)}" target="_blank" rel="noopener">
          <i class="fa-brands fa-whatsapp"></i> اسألنا على واتساب
        </a>`;
    } else {
      panel.innerHTML = suggestions.map((p, i) => `
        <button type="button" class="suggest-item" role="option" aria-selected="false" data-sug-index="${i}">
          <img src="${esc(p.image)}" alt="" loading="lazy">
          <span class="suggest-info">
            <b>${esc(shortName(p.name, 58))}</b>
            <small>${esc(p.category)} <span class="suggest-sep">•</span> <span class="suggest-price">${priceLabel(p)}</span></small>
          </span>
          <i class="fa-solid fa-arrow-left"></i>
        </button>`).join('') + `
        <button type="button" class="suggest-all" data-sug-all>
          عرض كل النتائج (${all.length}) <i class="fa-solid fa-arrow-left"></i>
        </button>`;
    }
    panel.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    active = -1;
  }

  function pick(index) {
    const p = suggestions[index];
    if (!p) return;
    hide();
    openProduct(p.id);
  }

  input.addEventListener('focus', () => { if (input.value.trim()) render(); });
  input.addEventListener('input', render);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (panel.hidden) render(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Escape') hide();
    else if (e.key === 'Enter' && !panel.hidden && active >= 0) { e.preventDefault(); pick(active); }
  });

  panel.addEventListener('click', (e) => {
    const item = e.target.closest('[data-sug-index]');
    if (item) { pick(Number(item.dataset.sugIndex)); return; }
    if (e.target.closest('[data-sug-all]')) {
      const q = input.value.trim();
      hide();
      openSearchResults(q, searchProducts(q));
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) { hide(); input.focus(); return; }
    hide();
    openSearchResults(q, searchProducts(q));
  });

  document.addEventListener('pointerdown', (e) => {
    if (wrap && !wrap.contains(e.target)) hide();
  });
})();

/* ---------------- SCROLL PROGRESS / RAIL / BACK TOP ---------------- */
const progress = document.getElementById('scrollProgress');
const backTop = document.getElementById('backTop');
const railProgress = document.getElementById('railProgress');
function onScroll() {
  const h = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = h > 0 ? Math.min(1, window.scrollY / h) : 0;
  if (progress) progress.style.width = (ratio * 100) + '%';
  if (railProgress) railProgress.style.height = (ratio * 100) + '%';
  if (backTop) backTop.classList.toggle('show', window.scrollY > 600);
  setActiveLink();
}
window.addEventListener('scroll', onScroll, { passive: true });
if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
document.querySelectorAll('.rail-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    document.getElementById(dot.dataset.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ---------------- CURSOR GLOW ---------------- */
const glow = document.getElementById('cursorGlow');
if (glow && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
}

/* ---------------- SECTION OPENING ANIMATION ---------------- */
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('opened');
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -6% 0px' });

function observeSections() {
  document.querySelectorAll('.section-anim:not(.opened)').forEach(s => sectionObserver.observe(s));
}

/* ---------------- REVEAL ---------------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

function observeReveals() {
  document.querySelectorAll('.reveal-up:not(.visible), .reveal-piece:not(.visible)').forEach(el => revealObserver.observe(el));
}

/* ---------------- STATS COUNTER ---------------- */
function animateStat(el) {
  if (el.dataset.done) return;
  el.dataset.done = '1';
  const target = Number(el.dataset.count);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) { animateStat(entry.target); statObserver.unobserve(entry.target); } });
}, { threshold: 0.5 });

/* ---------------- 3D TILT ---------------- */
function initHeroTilt() {
  const card = document.getElementById('hero3d');
  if (!card || window.matchMedia('(max-width: 820px)').matches) return;
  const wrap = card.closest('.hero-visual') || card.parentElement;
  wrap.addEventListener('mousemove', (e) => {
    const r = wrap.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    card.style.transform = `perspective(900px) rotateX(${(py - .5) * -10}deg) rotateY(${(px - .5) * 10}deg)`;
  });
  wrap.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  });
}

function initMapTilt() {
  const inner = document.querySelector('.map-3d-inner');
  const scene = document.getElementById('map3d');
  if (!inner || !scene || window.matchMedia('(max-width: 820px)').matches) return;
  scene.addEventListener('mousemove', (e) => {
    const r = scene.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    inner.style.transform = `rotateX(${(py - .5) * -7}deg) rotateY(${(px - .5) * 7}deg)`;
  });
  scene.addEventListener('mouseleave', () => { inner.style.transform = 'rotateX(0deg) rotateY(0deg)'; });
}

function initProductTilt() {
  if (window.matchMedia('(max-width: 820px)').matches) return;
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.transform = `perspective(900px) rotateX(${(py - .5) * -4}deg) rotateY(${(px - .5) * 4}deg) translateY(-9px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ---------------- NAV SPY ---------------- */
function setActiveLink() {
  const sections = document.querySelectorAll('main section[id]');
  const links = document.querySelectorAll('.nav-link');
  const dots = document.querySelectorAll('.rail-dot');
  let cur = 'hero';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 150) cur = s.id; });
  links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
  dots.forEach(d => d.classList.toggle('active', d.dataset.target === cur));
}

/* ---------------- IMAGE ZOOM VIEWER ---------------- */
const zoomState = { scale: 1, x: 0, y: 0, dragging: false, lastX: 0, lastY: 0 };

function applyZoomTransform() {
  const img = document.getElementById('zoomImg');
  const label = document.getElementById('zoomLevel');
  if (!img) return;
  img.style.transform = `translate(${zoomState.x}px, ${zoomState.y}px) scale(${zoomState.scale})`;
  if (label) label.textContent = Math.round(zoomState.scale * 100) + '%';
  const overlay = document.getElementById('zoomOverlay');
  if (overlay) overlay.classList.toggle('zoomed', zoomState.scale > 1);
}

function openZoom(src, alt) {
  const overlay = document.getElementById('zoomOverlay');
  const img = document.getElementById('zoomImg');
  if (!overlay || !img || !src) return;
  img.src = src;
  img.alt = alt || 'صورة المنتج';
  const title = document.getElementById('zoomTitle');
  if (title) title.textContent = alt || 'صورة المنتج';
  zoomState.scale = 1; zoomState.x = 0; zoomState.y = 0;
  applyZoomTransform();
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.getElementById('zoomClose')?.focus({ preventScroll: true });
}

function closeZoom() {
  const overlay = document.getElementById('zoomOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = (overlay.ownerDocument.getElementById('modalOverlay')?.classList.contains('open')) ? 'hidden' : '';
}

function setZoomScale(next) {
  zoomState.scale = Math.max(1, Math.min(5, next));
  if (zoomState.scale === 1) { zoomState.x = 0; zoomState.y = 0; }
  applyZoomTransform();
}

function initZoom() {
  const overlay = document.getElementById('zoomOverlay');
  const stage = document.getElementById('zoomStage');
  if (!overlay || !stage) return;
  const img = document.getElementById('zoomImg');
  document.getElementById('zoomClose')?.addEventListener('click', closeZoom);
  document.getElementById('zoomIn')?.addEventListener('click', () => setZoomScale(zoomState.scale + .4));
  document.getElementById('zoomOut')?.addEventListener('click', () => setZoomScale(zoomState.scale - .4));
  document.getElementById('zoomReset')?.addEventListener('click', () => { zoomState.scale = 1; zoomState.x = 0; zoomState.y = 0; applyZoomTransform(); });
  overlay.addEventListener('click', (e) => { if (e.target === overlay || e.target === stage) closeZoom(); });
  overlay.addEventListener('wheel', (e) => {
    if (!overlay.classList.contains('open')) return;
    e.preventDefault();
    setZoomScale(zoomState.scale * (e.deltaY > 0 ? .88 : 1.12));
  }, { passive: false });
  stage.addEventListener('pointerdown', (e) => {
    if (e.target !== img || zoomState.scale <= 1) return;
    zoomState.dragging = true;
    zoomState.lastX = e.clientX; zoomState.lastY = e.clientY;
    stage.setPointerCapture?.(e.pointerId);
    stage.classList.add('dragging');
  });
  stage.addEventListener('pointermove', (e) => {
    if (!zoomState.dragging) return;
    zoomState.x += e.clientX - zoomState.lastX;
    zoomState.y += e.clientY - zoomState.lastY;
    zoomState.lastX = e.clientX; zoomState.lastY = e.clientY;
    applyZoomTransform();
  });
  const stop = () => { zoomState.dragging = false; stage.classList.remove('dragging'); };
  stage.addEventListener('pointerup', stop);
  stage.addEventListener('pointercancel', stop);
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') { e.stopPropagation(); closeZoom(); }
    if (e.key === '+' || e.key === '=') setZoomScale(zoomState.scale + .4);
    if (e.key === '-') setZoomScale(zoomState.scale - .4);
  }, true);
}

/* ---------------- ANIMATED PAGE TRANSITIONS ---------------- */
function initPageTransitions() {
  const overlay = document.getElementById('pageTransition');
  if (!overlay) return;
  const reveal = () => {
    overlay.classList.remove('covering');
    overlay.classList.add('revealing');
    setTimeout(() => overlay.classList.remove('revealing'), 900);
  };
  requestAnimationFrame(reveal);
  window.addEventListener('pageshow', (e) => { if (e.persisted) reveal(); });

  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (a.target === '_blank' || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('wa.me')) return;
    a.setAttribute('data-nav', '');
    a.addEventListener('click', (e) => {
      e.preventDefault();
      if (overlay.classList.contains('covering')) return;
      overlay.classList.remove('revealing');
      overlay.classList.add('covering');
      setTimeout(() => { window.location.href = href; }, 430);
    });
  });
}

/* ---------------- CATEGORY PAGE ---------------- */
let categoryProducts = [];

function categoryProductCard(p, i, set) {
  const score = valueScore(p, set);
  const bench = benchmarkInfo(p);
  const power = bench.score;
  const noScore = power === null;
  const name = esc(p.name);
  return `
    <article class="cat-product-card reveal-up" data-product="${p.id}" style="--d:${(i % 6) * .05}s" tabindex="0" role="button" aria-label="عرض تفاصيل ${name}">
      <div class="product-media">
        <img class="product-img" src="${p.image}" alt="${name}" loading="lazy">
        <span class="value-chip${noScore ? ' score-none' : ''}" title="${noScore ? esc(bench.short) : `القيمة مقابل السعر: ${score}/100 — ${esc(bench.short)}`}"><i class="fa-solid fa-bolt"></i> ${noScore ? '—' : score}</span>
        <button class="zoom-btn" type="button" data-zoom="${p.image}" data-zoom-name="${name}" aria-label="تكبير صورة ${name}"><i class="fa-solid fa-magnifying-glass-plus"></i></button>
      </div>
      <p class="product-cat">${esc(p.category)}</p>
      <h3 class="product-name">${name}</h3>
      <div class="product-prices">
        <span class="price-now">${priceLabel(p)}</span>
        ${p.oldPrice ? `<span class="price-old">$${p.oldPrice}</span>` : ''}
      </div>
      <div class="card-power"><span>الأداء</span>${scoreBar(power, `الأداء: ${bench.source}`, bench.detail)}</div>
      <a class="btn-wa-product" href="${waLink(p)}" target="_blank" rel="noopener" data-wa aria-label="اطلب ${name} عبر واتساب">
        <i class="fa-brands fa-whatsapp"></i> اطلب عبر واتساب
      </a>
    </article>`;
}

function initCategoryPage() {
  const grid = document.getElementById('catProductGrid');
  if (!grid) return;
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('cat') || 'pcs';
  const def = CATEGORY_DEFS.find(c => c.slug === slug) || CATEGORY_DEFS[0];
  categoryProducts = PRODUCTS.filter(p => p.slug === def.slug || p.category === def.name);
  if (!categoryProducts.length && typeof CATEGORY_PRODUCTS !== 'undefined') categoryProducts = (CATEGORY_PRODUCTS[def.slug]?.products || []).map(item => ({
    id: String(item.id), name: item.name, price: item.price,
    image: IMG(item.image), category: def.name, slug: def.slug,
    link: `/products/${item.id}`, features: [], specs: {}, desc: item.name
  }));

  document.getElementById('catTitle').textContent = def.name;
  document.getElementById('catEn').textContent = def.en;
  document.getElementById('catBreadcrumb').textContent = def.name;
  document.getElementById('catMeta').textContent = countLabel(categoryProducts.length);
  const icon = document.getElementById('catIcon');
  if (icon) icon.className = def.icon;
  document.title = `${def.name} | ربيع للتجارة`;

  const chips = document.getElementById('catChips');
  if (chips) chips.innerHTML = CATEGORY_DEFS.map(c => `
    <a class="cat-chip${c.slug === def.slug ? ' active' : ''}" href="category.html?cat=${encodeURIComponent(c.slug)}" data-nav>
      <i class="${c.icon}"></i> ${esc(c.name)}
    </a>`).join('');

  const search = document.getElementById('catSearch');
  const sort = document.getElementById('catSort');
  const resultMeta = document.getElementById('catResultMeta');
  function render() {
    const q = (search?.value || '').trim().toLowerCase();
    let items = categoryProducts.filter(p => !q || `${p.name} ${p.category}`.toLowerCase().includes(q));
    const mode = sort?.value || 'default';
    if (mode === 'price-asc') items = [...items].sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
    if (mode === 'price-desc') items = [...items].sort((a, b) => b.price - a.price);
    if (mode === 'value') items = [...items].sort((a, b) => valueScore(b, categoryProducts) - valueScore(a, categoryProducts));
    if (mode === 'power') items = [...items].sort((a, b) => (powerScore(b) ?? -1) - (powerScore(a) ?? -1));
    grid.innerHTML = items.length
      ? items.map((p, i) => categoryProductCard(p, i, categoryProducts)).join('')
      : `<p class="cat-empty">لا توجد منتجات مطابقة — جرّب كلمة أخرى أو <a href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener">راسلنا على واتساب</a>.</p>`;
    if (resultMeta) resultMeta.textContent = `${items.length} من ${categoryProducts.length} منتج`;
    observeReveals();
    initProductTilt();
  }
  search?.addEventListener('input', render);
  sort?.addEventListener('change', render);
  render();

  document.getElementById('catCompareBtn')?.addEventListener('click', () => {
    const tab = def.name === 'لابتوبات' ? 'laptops' : (PC_PARTS.includes(def.name) ? 'pcs' : 'components');
    openCompare(tab, categoryProducts.slice(0, 2).map(p => p.id));
  });
}

/* ---------------- HERO RECOMMENDATIONS CAROUSEL ---------------- */
const ADMIN_CFG = (typeof ADMIN_CONFIG !== 'undefined' && ADMIN_CONFIG && typeof ADMIN_CONFIG === 'object') ? ADMIN_CONFIG : {};
const HERO_PICKS = (Array.isArray(ADMIN_CFG.heroPicks) && ADMIN_CFG.heroPicks.length)
  ? ADMIN_CFG.heroPicks.slice(0, 4)
  : ['gpu', 'laptops', 'monitor', 'cpu'];
const HERO_PRODUCT_IDS = Array.isArray(ADMIN_CFG.heroProductIds)
  ? ADMIN_CFG.heroProductIds.filter(Boolean).map(String).slice(0, 4)
  : [];
let heroIndex = 0;
let heroTimer = null;
let heroUserStopped = false;
let heroRAF = null;

function heroRecommendations() {
  const picks = [];
  const used = new Set();
  const prefer = /5060|5070|9060|rtx|ryzen|i7|144|165|gaming/i;
  HERO_PRODUCT_IDS.forEach(id => {
    const p = PRODUCTS.find(x => String(x.id) === id && x.image && x.price > 0 && !used.has(x.id));
    if (p) { picks.push(p); used.add(p.id); }
  });
  HERO_PICKS.forEach(slug => {
    const pool = PRODUCTS.filter(p => p.slug === slug && p.image && p.price > 0 && !used.has(p.id));
    const p = pool.find(x => prefer.test(x.name)) || pool[0];
    if (p) { picks.push(p); used.add(p.id); }
  });
  PRODUCTS.forEach(p => {
    if (picks.length >= 4) return;
    if (p.image && p.price > 0 && !used.has(p.id)) { picks.push(p); used.add(p.id); }
  });
  return picks.slice(0, 4);
}

function heroSlideHTML(p, i) {
  const specLabels = { gpu: 'كرت الشاشة', cpu: 'المعالج', ram: 'الرام', storage: 'التخزين', screen: 'الشاشة', os: 'النظام', extra: 'تفاصيل' };
  const specs = Object.entries(p.specs || {})
    .filter(([k]) => k !== 'type')
    .slice(0, 2)
    .map(([k, v]) => `${specLabels[k] || k}: ${v}`);
  const chips = specs.length ? specs : (p.features || []).slice(0, 2);
  return `
    <article class="hero-slide" role="group" aria-roledescription="slide" aria-label="${i + 1} من 4">
      <div class="hf-head">
        <span class="hf-ref">REF · ${esc(p.id)}</span>
        <span class="hf-cat">${esc(p.category)}</span>
      </div>
      <div class="hf-media">
        <img src="${esc(p.image)}" alt="${esc(p.name)}" loading="eager">
      </div>
      <div class="hf-body">
        <h2 class="hf-name">${esc(shortName(p.name, 78))}</h2>
        <div class="hf-specs">${chips.map(s => `<span>${esc(s)}</span>`).join('')}</div>
        <div class="hf-foot">
          <span class="hf-price">${priceLabel(p)}</span>
          <a class="hf-order" href="${waLink(p)}" target="_blank" rel="noopener">
            اطلب الآن <i class="fa-brands fa-whatsapp"></i>
          </a>
        </div>
      </div>
    </article>`;
}

function updateHeroUI() {
  const slides = document.querySelectorAll('#heroTrack .hero-slide');
  const count = slides.length;
  const counter = document.getElementById('heroSlideCounter');
  if (counter) counter.textContent = `${heroIndex + 1} / ${count}`;
  document.querySelectorAll('#heroDots .hf-dot').forEach((dot, i) => {
    const active = i === heroIndex;
    dot.classList.toggle('active', active);
    dot.setAttribute('aria-selected', String(active));
  });
  slides.forEach((s, i) => s.setAttribute('aria-hidden', String(i !== heroIndex)));
}

function goHeroSlide(index, manual = false) {
  const viewport = document.getElementById('heroViewport');
  const count = document.querySelectorAll('#heroTrack .hero-slide').length;
  if (!viewport || !count) return;
  if (manual) {
    heroUserStopped = true;
    if (heroTimer) { clearInterval(heroTimer); heroTimer = null; }
  }
  heroIndex = ((index % count) + count) % count;
  updateHeroUI();

  const target = -heroIndex * viewport.clientWidth;
  if (!manual) {
    if (heroRAF) cancelAnimationFrame(heroRAF);
    viewport.style.scrollSnapType = '';
    viewport.scrollLeft = target;
    return;
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    viewport.scrollLeft = target;
    return;
  }
  if (heroRAF) cancelAnimationFrame(heroRAF);
  const start = viewport.scrollLeft;
  const distance = target - start;
  if (!distance) return;
  const snap = viewport.style.scrollSnapType;
  viewport.style.scrollSnapType = 'none';
  const began = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - began) / 420);
    const eased = 1 - Math.pow(1 - p, 3);
    viewport.scrollLeft = start + distance * eased;
    if (p < 1) heroRAF = requestAnimationFrame(step);
    else {
      heroRAF = null;
      viewport.style.scrollSnapType = snap;
      viewport.scrollLeft = target;
    }
  };
  heroRAF = requestAnimationFrame(step);
}

function renderHeroFeature() {
  const track = document.getElementById('heroTrack');
  if (!track) return;
  const items = heroRecommendations();
  if (!items.length) return;
  track.innerHTML = items.map(heroSlideHTML).join('');

  const dots = document.getElementById('heroDots');
  if (dots) {
    dots.innerHTML = items.map((_, i) => `<button type="button" class="hf-dot" data-hero-dot="${i}" role="tab" aria-label="المنتج ${i + 1}" aria-selected="false"></button>`).join('');
    dots.addEventListener('click', (e) => {
      const dot = e.target.closest('[data-hero-dot]');
      if (dot) goHeroSlide(Number(dot.dataset.heroDot), true);
    });
  }

  document.getElementById('heroPrev')?.addEventListener('click', () => goHeroSlide(heroIndex - 1, true));
  document.getElementById('heroNext')?.addEventListener('click', () => goHeroSlide(heroIndex + 1, true));

  const viewport = document.getElementById('heroViewport');
  viewport.addEventListener('scroll', () => {
    if (heroRAF) return;
    const next = Math.round(-viewport.scrollLeft / viewport.clientWidth);
    if (next !== heroIndex && next >= 0 && next < items.length) { heroIndex = next; updateHeroUI(); }
  }, { passive: true });
  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goHeroSlide(heroIndex - 1, true); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goHeroSlide(heroIndex + 1, true); }
  });

  let drag = null;
  viewport.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button')) return;
    drag = { x: e.clientX, left: viewport.scrollLeft, moved: false };
    viewport.setPointerCapture?.(e.pointerId);
  });
  viewport.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 5) drag.moved = true;
    viewport.scrollLeft = drag.left - dx;
  });
  const endDrag = () => {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    if (moved) goHeroSlide(Math.round(-viewport.scrollLeft / viewport.clientWidth), true);
  };
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', () => { drag = null; });

  if (items.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const box = document.getElementById('heroCarousel');
    const stop = () => { if (heroTimer) clearInterval(heroTimer); heroTimer = null; };
    const start = () => { if (heroUserStopped) return; stop(); heroTimer = setInterval(() => goHeroSlide(heroIndex + 1), 6000); };
    box?.addEventListener('pointerdown', () => { heroUserStopped = true; stop(); });
    box?.addEventListener('mouseenter', stop);
    box?.addEventListener('mouseleave', start);
    box?.addEventListener('focusin', stop);
    box?.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start(); });
    start();
  }
  updateHeroUI();
}

/* ---------------- INIT ---------------- */
function init() {
  renderBrands();
  renderCategories();
  renderProducts();
  renderShowcases();
  renderHeroFeature();
  initCompareButtons();
  observeSections();
  observeReveals();
  document.querySelectorAll('[data-count]').forEach(el => statObserver.observe(el));
  initHeroTilt();
  initMapTilt();
  initProductTilt();
  initZoom();
  initPageTransitions();
  initCategoryPage();
  onScroll();
}
init();