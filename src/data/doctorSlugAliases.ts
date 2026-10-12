/**
 * Central dictionary mapping legacy, review doctor variants, and English suffix slugs
 * to their verified canonical doctor slugs in Health Club database.
 */
export const DOCTOR_SLUG_ALIASES: Record<string, string> = {
  // Dental
  "dr-zahid-hossain-mazumder": "dr-jahid-hossain-mazumder",

  // Gynecology & Obstetrics
  "dr-kamrun-nahar-roli": "asst-prof-dr-kamrun-nahar-rli",
  "dr-salma-akter-gynecologist": "asst-prof-dr-kamrun-nahar-rli",
  "dr-rokeya-begum-gynecology": "asst-prof-dr-kamrun-nahar-rli",
  "dr-rokeya-begum-radiologist": "asst-prof-dr-kamrun-nahar-rli",
  "asst-prof-dr-asma-akter-2": "asst-prof-dr-asma-akter",
  "asst-prof-dr-mumtahena-amir-2": "asst-prof-dr-mumtahena-amir",

  // Orthopedics
  "dr-md-iqbal-hossain-orthopedic": "dr-md-iqbal-hossain",
  "dr-md-iqbal-hossain-2": "dr-md-iqbal-hossain",
  "dr-md-iqbal-hossain-nephrologist": "dr-saiful-ahsan-rana",
  "dr-md-mominul-islam-sohag-2": "dr-md-mominul-islam-sohag",

  // Medicine & Hepatology
  "dr-md-kamrul-hasan-medicine": "dr-md-kamrul-hasan",
  "dr-md-kamrul-hasan-2": "dr-md-kamrul-hasan",
  "dr-md-rashedul-hasan-2": "dr-md-rashedul-hasan",

  // Diabetes & Endocrinology
  "dr-md-kabir-hossain-endocrinologist": "dr-md-kabir-hossain",

  // Urology
  "dr-md-fahmidul-haque-rion": "dr-md-fahmidul-hoque-rion",
  "dr-md-fahmidul-hoque-rion-2": "dr-md-fahmidul-hoque-rion",

  // Dermatology
  "dr-fatematuz-zohra-antara": "dr-fatematuj-johra-ontra",

  // Gastroenterology
  "dr-ashim-kumar-saha": "assoc-prof-dr-osim-kumar-saha",

  // Psychiatry
  "dr-mohammad-shahadat-hossain": "asst-prof-dr-mohammad-shahadat-hossain",
  "dr-mohammad-shahadat-hossain-psychiatrist": "asst-prof-dr-mohammad-shahadat-hossain",

  // Cardiology
  "dr-md-nizam-uddin-cardiologist": "dr-muhammad-belal-hossain",

  // Neurology
  "dr-md-nazmul-hasan-neurologist": "dr-osim-kumar-chowdhury",
  "dr-osim-kumar-chowdhury-2": "dr-osim-kumar-chowdhury",
  "asst-prof-dr-deoyan-mushfikur-rahman-2": "asst-prof-dr-deoyan-mushfikur-rahman",

  // Nephrology
  "dr-e-ke-em-saifur-rahman-2": "dr-e-ke-em-saifur-rahman",

  // Surgery
  "dr-md-saiful-islam-surgeon": "dr-md-harun-or-rshid",

  // ENT
  "dr-md-saiful-islam-ent": "dr-asif-uddin",
  "dr-mohammad-zahirul-islam-ent": "dr-asif-uddin",
  "asst-prof-dr-sirajul-munir-ohi-2": "asst-prof-dr-sirajul-munir-ohi",

  // Eye
  "dr-md-rafiqul-islam-eye": "dr-brj-gopal-pal",
  "dr-champa-kundu-2": "dr-champa-kundu",
  "dr-shmishtha-de-2": "dr-shmishtha-de",

  // Pediatrics
  "dr-md-ziauddin-ahmed": "dr-piyas-kanti-pal",
  "dr-jannatul-ferdous-2": "dr-jannatul-ferdous",

  // Nutrition
  "sayma-akter-2": "sayma-akter",
};
