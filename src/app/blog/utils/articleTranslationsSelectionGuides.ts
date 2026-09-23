import { SPECIALIST_SELECTION_GUIDES } from "./articleTranslationsSpecialistGuides";
import { OXYGEN_SELECTION_GUIDE } from "./articleTranslationsOxygen";
import { DENGUE_TYPHOID_SELECTION_GUIDE } from "./articleTranslationsDengueTyphoid";

export const ARTICLE_SELECTION_GUIDES: Record<
  string,
  { title: string; points: { title: string; desc: string }[] }
> = {
  "dengue-and-typhoid-test-cost-management-guide-feni": DENGUE_TYPHOID_SELECTION_GUIDE,
  "feni-oxygen-cylinder-refill-and-home-rent-guide": OXYGEN_SELECTION_GUIDE,
  "home-sample-collection-and-nursing-service-in-feni": {
    title: "4 Golden Rules for Choosing Home Phlebotomy & Nursing Services in Feni",
    points: [
      {
        title: "1. Certified Phlebotomists & Cold-Chain Specimen Cooler Boxes",
        desc: "Ensure that the visiting technician is a qualified medical laboratory technologist who transports blood and urine vacutainers in insulated ice-gel cooler boxes (2°C-8°C) to prevent cellular hemolysis.",
      },
      {
        title: "2. Government-Registered Diploma/BSc Nursing Credentials",
        desc: "Verify that clinical procedures such as Foley catheterization and IV infusion are performed by licensed BNMC/BMDC-registered nurses rather than untrained retail assistants.",
      },
      {
        title: "3. Factory-Sealed Sterile Single-Use Medical Supplies",
        desc: "Ensure all catheters, IV cannulas, syringes, and wound dressing packs are opened from sealed manufacturer packaging in your presence to eliminate healthcare-associated infections.",
      },
      {
        title: "4. Direct Tertiary Hospital Backup & Emergency Ambulance Access",
        desc: "Confirm that the home care agency or diagnostic center is backed by an accredited hospital and ambulance dispatch network in case the patient experiences unexpected physiological deterioration.",
      },
    ],
  },
  "stroke-and-heart-attack-emergency-protocol-feni": {
    title: "4 Golden Rules for Choosing Emergency Stroke & Cardiac Facilities in Feni",
    points: [
      {
        title: "1. 24/7 Operational Emergency Department & Rapid Triage Capability",
        desc: "Ensure the hospital operates round-the-clock emergency triage staffed by certified medical officers and continuous central oxygen, prepared to initiate immediate cardiopulmonary resuscitation.",
      },
      {
        title: "2. Immediate In-House 12-Lead ECG, STAT Troponin-I & Emergency Brain CT",
        desc: "Verify that the facility provides 10-minute door-to-ECG capability, rapid cardiac biomarker quantification, and accessible non-contrast CT scanning to differentiate ischemic from hemorrhagic stroke.",
      },
      {
        title: "3. Dedicated Coronary Care Unit (CCU), Defibrillators & ICU Backup",
        desc: "Confirm the presence of biphasic cardiac defibrillators, continuous hemodynamic telemetry, emergency thrombolytic management (Streptokinase), and mechanical life support backup.",
      },
      {
        title: "4. Advanced Life Support (ALS) Ambulance Network & Tertiary Referral Protocol",
        desc: "Ensure the center maintains coordination with ICU-equipped ambulance fleets with transport ventilators and paramedics for safe inter-hospital transfer to tertiary centers in Chittagong or Dhaka.",
      },
    ],
  },
  "feni-icu-ccu-nicu-bed-charges-and-facilities-guide": {
    title: "4 Golden Rules for Choosing Critical Care & ICU Facilities in Feni",
    points: [
      {
        title: "1. Functional Mechanical Ventilators & Dedicated Uninterrupted Power Backup",
        desc: "Ensure the hospital operates modern microprocessor servo ventilators backed by dedicated online UPS and automatic diesel generators, ensuring zero life support interruptions during electrical outages.",
      },
      {
        title: "2. Bulk Central Pipeline Medical Oxygen & Dual Manifold Security",
        desc: "Prioritize facilities equipped with bulk Liquid Medical Oxygen (LMO) tanks or dual-bank central pipeline manifolds, eliminating dangerous pressure drops associated with switching standalone cylinders.",
      },
      {
        title: "3. 24/7 Certified Intensivist, Anesthesiologist & 1:1 Nursing Care",
        desc: "Confirm that certified anesthesiologists and critical care medical officers are physically on-duty round-the-clock, supported by ICU-trained nurses delivering dedicated 1:1 patient care and airway suctioning.",
      },
      {
        title: "4. In-House Point-of-Care Arterial Blood Gas (ABG) & Digital Imaging",
        desc: "Verify that the facility maintains an operational blood gas analyzer and portable bedside digital radiography, enabling rapid minute-by-minute titration of ventilator oxygenation and acid-base parameters.",
      },
    ],
  },
  "full-body-health-checkup-packages-in-feni": {
    title: "4 Golden Rules for Choosing Full Body Checkup & Diagnostic Labs in Feni",
    points: [
      {
        title: "1. International Standard Fully Automated Clinical Chemistry Analyzers",
        desc: "Ensure the center is equipped with world-class robotic analyzer platforms (such as Roche Cobas, Sysmex, or Beckman Coulter) to guarantee precise, operator-error-free hematological and biochemical quantification.",
      },
      {
        title: "2. Daily Internal & External Quality Control (QC) Calibration",
        desc: "Verify that the diagnostic laboratory routinely runs multi-level control sera and participates in national/international quality assurance schemes before processing patient samples.",
      },
      {
        title: "3. Consultant Pathologist & Clinical Biochemist Oversight",
        desc: "Confirm that every abnormal parameter and organ profile is critically evaluated, validated, and signed by verified BMDC-registered consultant clinical pathologists rather than unmonitored technicians.",
      },
      {
        title: "4. Integrated Multi-Disciplinary Diagnostics Under One Roof",
        desc: "Select diagnostic facilities that house phlebotomy, high-frequency digital radiography, 12-lead ECG, and whole abdomen ultrasonography within the same building, ensuring seamless same-day evaluation.",
      },
    ],
  },
  "pregnancy-ultrasonography-4d-anomaly-scan-in-feni": {
    title: "4 Golden Rules for Choosing 4D Pregnancy Ultrasound & Anomaly Scan Centers in Feni",
    points: [
      {
        title: "1. GE Voluson 4D HD-Live Technology & Advanced Probes",
        desc: "Ensure the center is equipped with world-class 4D imaging systems (such as GE Voluson E8/E10) with HD-Live surface rendering to capture sharp anatomical details of the fetal heart, facial features, and spine.",
      },
      {
        title: "2. Certified Sonologists & BMDC-Registered Consultant Radiologists",
        desc: "Verify that scans are performed and officially signed by certified sonologists with dedicated fetal anomaly training (DMU / DMRD / FCPS) rather than unmonitored technicians.",
      },
      {
        title: "3. Dedicated Female Sonologist Availability & Complete Modesty",
        desc: "Select facilities that guarantee privacy, dignity, and cultural comfort for expectant mothers by providing experienced female sonologists and female clinical attendants.",
      },
      {
        title: "4. Comprehensive Anatomical Checklist & High-Definition Color Prints",
        desc: "Confirm that the final diagnostic report includes a structured anatomical organ checklist (cerebral ventricles, 4-chamber heart, kidneys, spine, amniotic fluid, umbilical Doppler) with color prints.",
      },
    ],
  },
  "feni-ct-scan-and-mri-test-price-guide": {
    title: "4 Golden Rules for Choosing CT Scan & MRI Centers in Feni",
    points: [
      {
        title: "1. 1.5 Tesla Superconducting Magnet vs. Low-Field Open Scanners",
        desc: "Confirm that the diagnostic center operates a high-field 1.5 Tesla closed superconducting magnet rather than a weak 0.3-0.4 Tesla open scanner, ensuring sharp diagnostic resolution for subtle brain tumors, micro-infarcts, and spinal disc prolapse (PLID).",
      },
      {
        title: "2. 128-Slice Multi-Detector Helical CT with Low-Dose Protocols",
        desc: "Verify that the facility utilizes modern multi-detector helical CT systems that complete full body scans in seconds, delivering high-resolution 3D reconstructions with minimal radiation exposure compared to outdated low-slice systems.",
      },
      {
        title: "3. Rigorous Contrast Renal Screening & Anaphylaxis Preparedness",
        desc: "Ensure the center strictly verifies serum creatinine clearance prior to intravenous iodinated or gadolinium contrast, maintaining an emergency crash cart, oxygen supply, and anesthesiology backup for adverse drug reaction management.",
      },
      {
        title: "4. Certified Consultant Radiologist (FCPS / MD) Reporting",
        desc: "Select imaging centers where scans are interpreted, validated, and signed by verified BMDC-registered consultant radiologists with tertiary university hospital experience, complete with full digital DICOM film archives.",
      },
    ],
  },
  "kidney-stone-laser-treatment-and-urology-guide-feni": {
    title: "4 Golden Rules for Choosing Kidney Stone Laser & Urology Surgery Clinics in Feni",
    points: [
      {
        title: "1. Verified BMDC Credentials & Endourology Fellowship Training",
        desc: "Ensure your operating urologist holds accredited postgraduate qualifications (MS Urology / FCPS Surgery) with dedicated endourology training in laser lithotripsy (URS/RIRS) and PCNL.",
      },
      {
        title: "2. C-Arm Fluoroscopy Guidance & Precision Holmium/Thulium Laser Units",
        desc: "Confirm that the surgical theater is equipped with high-resolution C-arm fluoroscopy imaging and authentic laser lithotripsy machines rather than unmonitored blind instrumentation.",
      },
      {
        title: "3. Full-Time Anesthesiologist, HDU Monitoring & Emergency Dialysis Backup",
        desc: "Verify 24/7 coverage by certified anesthesiologists, sterile laminar airflow OT suites, and immediate access to intensive monitoring or nephrology hemodialysis backup.",
      },
      {
        title: "4. Transparent OT Packages & 10-30% Health Club Member Savings",
        desc: "Request all-inclusive package estimates covering OT, laser fibers, DJ stent insertion/removal, and cabin stay upfront, and present your Health Club card for guaranteed 10-30% savings.",
      },
    ],
  },
  "laparoscopic-gallstone-and-hernia-surgery-guide-feni": {
    title: "4 Golden Rules for Choosing Laparoscopic Gallbladder & Hernia Surgery Clinics in Feni",
    points: [
      {
        title: "1. Verified BMDC Credentials & Minimal Access Fellowship Training",
        desc: "Ensure your operating surgeon holds accredited postgraduate credentials (FCPS/MS) with dedicated fellowship training in laparoscopic and minimal access surgery (FMS/SELSB).",
      },
      {
        title: "2. Modern 4K / Full-HD Laparoscopic Tower & Advanced Energy Devices",
        desc: "Verify that the hospital operates state-of-the-art high-definition camera towers and ultrasonic harmonic or bipolar dissecting instruments for bloodless, precise tissue dissection.",
      },
      {
        title: "3. Full-Time Anesthesiologist, HDU Backup & HEPA-Filtered Sterile OT",
        desc: "Confirm 24/7 coverage by certified anesthesiologists, certified Class-B autoclaving, and high-dependency recovery monitoring to safeguard patient stability during and after general anesthesia.",
      },
      {
        title: "4. All-Inclusive OT Packages & 10-30% Health Club Member Savings",
        desc: "Request comprehensive package quotes covering OT, cabin stay, and post-op medicines prior to admission, and use your Health Club digital membership for 10-30% savings at partner hospitals.",
      },
    ],
  },
  "laser-piles-fissure-fistula-treatment-cost-in-feni": {
    title: "4 Golden Rules for Choosing Laser Piles & Fistula Clinics in Feni",
    points: [
      {
        title: "1. Verified BMDC Credentials & Colorectal Fellowship Training",
        desc: "Confirm that your surgeon holds accredited postgraduate credentials (FCPS/MS/MRCS) with dedicated fellowship training in colorectal proctology rather than generic practice.",
      },
      {
        title: "2. Authentic 1470nm Diode Radial Fiber Laser Technology",
        desc: "Ensure the hospital utilizes true dual-radial diode lasers (LHP/FiLaC) that coagulate submucosal tissue without cutting, rather than conventional electrocautery falsely marketed as laser.",
      },
      {
        title: "3. Sterile Operating Theater Standards & Professional Anesthesiology",
        desc: "Verify that the hospital maintains laminar airflow OT filtration, certified Class-B autoclaves, and full-time anesthesiologist coverage for painless, infection-free procedures.",
      },
      {
        title: "4. Transparent OT Packages & 10-30% Health Club Member Savings",
        desc: "Request all-inclusive package breakdowns prior to admission to prevent surprise pharmacy or bed markups, and present your Health Club card for 10-30% savings at partner hospitals.",
      },
    ],
  },
  "feni-normal-delivery-and-cesarean-cost-guide": {
    title: "4 Golden Rules for Choosing Normal Delivery Clinics & Maternity Hospitals in Feni",
    points: [
      {
        title: "1. Prioritize Clinicians Dedicated to Patient-Centric Normal Vaginal Delivery",
        desc: "Select obstetricians and maternity clinics that actively encourage physiological labor, practice structured partograph tracking, and avoid hurried, non-medically indicated cesarean deliveries.",
      },
      {
        title: "2. Verify In-House Neonatal ICU (NICU) and Pediatrician On-Call Readiness",
        desc: "Ensure the delivery facility maintains functioning neonatal incubators and phototherapy units to avoid precarious emergency transit during unexpected birth asphyxia or jaundice.",
      },
      {
        title: "3. Confirm 24/7 Anesthesiology Coverage and Sterile Surgical OT Standards",
        desc: "Ensure round-the-clock availability of a certified anesthesiologist to facilitate emergency C-section within 15-20 minutes should maternal or fetal vitals deteriorate.",
      },
      {
        title: "4. Clarify Transparent Package Rates & Leverage Health Club Member Savings",
        desc: "Request all-inclusive package breakdowns prior to admission to avoid unexpected pharmacy or cabin markups, and present your Health Club membership for 10-30% savings.",
      },
    ],
  },
  "parshuram-fulgazi-healthcare-guide": {
    title: "4 Critical Guidelines for Receiving Healthcare & Choosing Clinics in Northern Feni",
    points: [
      {
        title: "1. Utilize Government Upazila Health Complexes for Primary Care & Normal Deliveries",
        desc: "For routine ailments, institutional normal deliveries, infant immunizations, and free NCD blood pressure/glucose medications, Parshuram and Fulgazi 50-bed Upazila Health Complexes provide exceptional 24/7 care for only ৳3-৳10.",
      },
      {
        title: "2. Be Vigilant with Monsoon Floods, Waterborne Diseases & Snakebites",
        desc: "Due to the Muhuri river basin's flash flood vulnerabilities, sudden waterborne diarrheal outbreaks and venomous snakebites can occur. Parshuram and Fulgazi Health Complexes maintain free polyvalent antivenom (ASV) and IV rehydration fluids.",
      },
      {
        title: "3. Bypass Hospital Middlemen & Unlicensed Village Bonesetters",
        desc: "Avoid aggressive middlemen touting uncertified private labs or traditional bonesetters whose crude splints cause limb gangrene. Seek accredited digital imaging and BMDC-registered doctor prescriptions.",
      },
      {
        title: "4. Rapidly Dispatch Emergency Ambulances to Feni Sadar for Severe Traumas",
        desc: "In acute myocardial infarctions (heart attacks), cerebral strokes, or multi-organ polytrauma, do not delay at local clinics. Arrange an immediate 20-50 minute ambulance transfer to Feni 250-Bed General Hospital or top tertiary ICUs.",
      },
    ],
  },
  "daganbhuiyan-chagalnaiya-sonagazi-healthcare-guide": {
    title: "4 Critical Guidelines for Navigating Upazila Healthcare & Choosing Specialist Chambers",
    points: [
      {
        title: "1. Distinguish Primary Upazila Health Complex Capabilities from Secondary Centers",
        desc: "For emergency normal deliveries, immunization, initial snakebite anti-venom, and minor lacerations, Upazila Health Complexes (UHCs) provide 24/7 care. However, for acute myocardial infarction, severe polytrauma, or premature neonates, stabilize the patient and arrange immediate referral to Feni 250-Bed District Hospital or Chittagong Medical College.",
      },
      {
        title: "2. Confirm Specialist Visiting Schedules and Chamber Tokens in Advance",
        desc: "Visiting specialist professors and consultants from Chittagong and Dhaka practice in Daganbhuiyan, Chhagalnaiya, and Sonagazi primarily on Thursdays, Fridays, or select weekday afternoons. Confirm doctor serial numbers by phone in the morning to avoid wasted travel.",
      },
      {
        title: "3. Verify Ultrasound & Diagnostic Imaging Equipment Calibration",
        desc: "Ensure prenatal 4D ultrasounds and cardiac Echo Doppler screenings are performed on digital color Doppler ultrasound machines operated by certified sonologists or radiologists, rather than unaccredited technician interpretations.",
      },
      {
        title: "4. Prevent Middlemen Exploitation & Utilize Health Club Privileges in Feni Sadar",
        desc: "Never pay unauthorized commissions to ambulance drivers or clinic touts. When referred to partner hospitals in Feni Sadar, present your Health Club digital membership card to claim 10-30% diagnostic and cabin savings.",
      },
    ],
  },
  "feni-ambulance-and-oxygen-service-guide": {
    title: "4 Critical Guidelines for Hiring Emergency Ambulance & Oxygen Services in Feni",
    points: [
      {
        title: "1. Match Ambulance Specifications to the Patient's Clinical Condition",
        desc: "For routine orthopedic fractures or stabilized patients, a standard air-conditioned ambulance is adequate. For comatose, cardiac, or stroke patients requiring life support, verify mechanical ventilator, cardiac monitor, and paramedic availability.",
      },
      {
        title: "2. Inspect On-Board Oxygen Pressure Gauges and Backup Tanks",
        desc: "On 2-to-5-hour highway journeys to Dhaka or Chittagong, confirm with the driver that main oxygen cylinders are full and that an auxiliary backup cylinder is secured to prevent in-transit hypoxia.",
      },
      {
        title: "3. Agree on All-Inclusive Fares Before Departure (Zero Hidden Charges)",
        desc: "Clarify upfront whether highway bridge tolls (Meghna, Gumti, or Karnaphuli), fuel (CNG/Diesel), and city waiting charges are included in the negotiated fare to prevent mid-journey disputes.",
      },
      {
        title: "4. Bypass Hospital Broker Rings and Dial Verified Helplines Directly",
        desc: "Never engage intermediaries hanging around hospital emergency gates who charge 30% to 50% commissions. Dial verified drivers directly via Health Club's emergency portal for transparent public rates and direct driver booking.",
      },
    ],
  },
  "feni-blood-bank-and-donors-guide": {
    title: "4 Critical Guidelines for Safe Blood Transfusion & Donor Eligibility in Feni",
    points: [
      {
        title: "1. Demand Mandatory 5-Point TTI Infectious Disease Screening",
        desc: "Before any blood unit is transfused, insist on receiving a certified laboratory report confirming non-reactive screening for HIV, Hepatitis B, Hepatitis C, Syphilis, and Malaria.",
      },
      {
        title: "2. Strictly Reject Commercial Paid Donors and Hospital Middlemen",
        desc: "Never purchase blood from hospital brokers or paid commercial donors who frequently carry blood-borne infections. Always utilize verified voluntary donor networks and institutional blood centers.",
      },
      {
        title: "3. Confirm Major and Minor Compatibility Cross-Matching",
        desc: "Identical blood grouping alone does not guarantee transfusion safety; pre-transfusion cross-matching between recipient serum and donor red cells is essential to prevent fatal hemolytic reactions.",
      },
      {
        title: "4. Verify Donor Health Status and Safe 4-Month Interval",
        desc: "Ensure voluntary donors are between 18 and 60 years old, weigh at least 45-50 kg, possess normal hemoglobin levels (12.0 g/dL+), and have completed a minimum 120-day recovery interval since their last donation.",
      },
    ],
  },
  "24-hour-pharmacy-in-feni": {
    title: "4 Essential Precautions for Safe Pharmacy Selection & Emergency Medicine Purchase",
    points: [
      {
        title: "1. Prioritize DGDA-Licensed Model Pharmacies",
        desc: "Purchase medications from pharmacies officially accredited by the Directorate General of Drug Administration (DGDA) where full-time licensed Grade-A Pharmacists supervise storage and dispensing in air-conditioned environments.",
      },
      {
        title: "2. Verify 2°C–8°C Cold-Chain Storage for Insulin and Vaccines",
        desc: "Inspect the digital temperature display on pharmaceutical refrigerators when purchasing insulin or biological vaccines, and insist on icebox cool-packs for transit home.",
      },
      {
        title: "3. Never Purchase Antibiotics or Sedatives Without a Prescription",
        desc: "Strictly avoid over-the-counter antibiotic purchases without a registered doctor's prescription. Inappropriate antibiotic use fosters antimicrobial resistance (AMR) and risks severe health complications.",
      },
      {
        title: "4. Cross-Check Packaging Seals, Batch Numbers, and Expiry Dates",
        desc: "Upon receiving home deliveries, inspect blister foils, batch numbers, manufacturer security holograms, and maximum retail prices (MRP) printed on computerized VAT invoices before payment.",
      },
    ],
  },
  "feni-medical-test-price-list": {
    title: "5 Essential Guidelines for Choosing a Quality Diagnostic Lab & Test Preparation in Feni",
    points: [
      {
        title: "1. Strictly Adhere to Overnight Fasting (8-12h) for Glucose and Lipids",
        desc: "For accurate fasting blood sugar (FBS) and complete lipid profiles, fast overnight for 8 to 12 hours with only plain water permitted; avoid excessive fasting beyond 14 hours which distorts lipid markers.",
      },
      {
        title: "2. Ensure Full Bladder (Acoustic Window) for Pelvic & Pregnancy Ultrasounds",
        desc: "Drink 3 to 4 glasses of water 30 minutes before lower abdominal, pelvic, or early pregnancy sonograms; a full bladder serves as a vital acoustic window to visualize uterine and ovarian structures.",
      },
      {
        title: "3. Verify Barcode Tube Labeling at the Phlebotomy Station",
        desc: "Ensure the phlebotomist applies computer-printed barcode labels with your unique patient ID directly on blood collection tubes to eliminate cross-sample contamination and diagnostic errors.",
      },
      {
        title: "4. Confirm Consultant Pathologist and Radiologist Signature Verification",
        desc: "Never rely on automated printouts signed solely by technicians; demand verified reports reviewed and signed by BMDC-registered clinical pathologists and consultant radiologists.",
      },
      {
        title: "5. Avoid Intermediary Dalal Markups via Direct Health Club Member Discounts",
        desc: "Bypass hospital broker commissions by presenting your digital Health Club card directly at reception billing counters for instant, transparent 10% to 30% printed receipt savings.",
      },
    ],
  },
  "feni-diabetic-hospital-guide": {
    title: "5 Essential Clinical Guidelines for Receiving Care at Feni Diabetic Association Hospital",
    points: [
      {
        title: "1. Maintain Longitudinal Tracking via the Association Guide Book",
        desc: "Even if your glucose feels controlled, never discontinue medications without specialist advice; attend regular follow-up visits every 1 to 3 months with your registered green book.",
      },
      {
        title: "2. Undergo Annual Dilated Eye Exams for Diabetic Retinopathy",
        desc: "Early diabetic retinal microvascular damage produces zero initial pain or symptoms; an annual dilated fundoscopy exam is critical to detect lesions before vision is permanently compromised.",
      },
      {
        title: "3. Inspect Feet Daily to Prevent Neuropathic Diabetic Ulcers",
        desc: "Examine the soles of your feet using a handheld mirror, wear cushioned footwear, never walk barefoot, and get annual 10g monofilament sensory screenings to prevent amputations.",
      },
      {
        title: "4. Target a 3-Month Average Glucose (HbA1c) Below 7.0%",
        desc: "Day-to-day fingerstick readings fluctuate; achieving an automated HPLC HbA1c below 7% provides the definitive medical benchmark to safeguard your heart, kidneys, and peripheral nerves.",
      },
      {
        title: "5. Leverage Health Club 10-30% Savings on Outside Referral Care",
        desc: "If advanced cardiac echocardiograms, 1.5T MRI, continuous glucose monitoring (CGM), or inpatient surgical admissions are referred outside, present your Health Club card for 10-30% guaranteed savings.",
      },
    ],
  },
  "feni-sadar-hospital-guide": {
    title: "5 Essential Guidelines for Receiving Seamless Care at Feni 250-Bed Sadar Hospital",
    points: [
      {
        title: "1. Arrive Early for Outdoor OPD Ticket Counters (8:00 AM - 11:00 AM)",
        desc: "OPD consultation tickets cost only ৳10; arriving between 8:00 AM and 11:00 AM ensures priority doctor consultation and timely sample submission at the pathology lab.",
      },
      {
        title: "2. Immediate 24/7 Emergency Room (ER) Triage for Trauma & Highway Accidents",
        desc: "For severe accidents, chest pain, or head trauma, proceed straight to the 24/7 Emergency Room at the ground floor for immediate triage, wound dressing, and life-saving resuscitation.",
      },
      {
        title: "3. Free Snake Antivenom & Rabies Vaccine Protocols",
        desc: "In snakebite or dog/animal bite emergencies, free polyvalent antivenom and anti-rabies vaccines (ARV) are stocked round-the-clock at the emergency pharmacy counter; never seek unscientific quack remedies.",
      },
      {
        title: "4. Government Subsidized Hemodialysis & Indoor Bed Admission",
        desc: "Dialysis sessions cost only ৳400-৳500 under government subsidy with registered nephrology oversight; indoor general beds cost ৳15 admission with free medicine and meals provided.",
      },
      {
        title: "5. Health Club 10-30% Discounts for Outside Referral Diagnostic Tests",
        desc: "If high-end diagnostic tests (1.5T MRI, 128-slice CT, Holter ECG, specialized hormone assays) are unavailable internally, use your Health Club card for guaranteed 10-30% savings at nearby partner labs.",
      },
    ],
  },
  ...SPECIALIST_SELECTION_GUIDES,
  default: {
    title: "Guidelines for Choosing Quality Healthcare in Feni",
    points: [
      {
        title: "1. Certified Medical Professionals",
        desc: "Ensure practitioners hold recognized BMDC degrees and active credentials in their respective specialties.",
      },
      {
        title: "2. Modern Clinical Equipment",
        desc: "Verify the clinic uses updated medical technologies and hygienic sterilizing procedures.",
      },
      {
        title: "3. Convenient Booking & Punctuality",
        desc: "Prioritize chambers with verified serial hotlines to minimize waiting times and crowded conditions.",
      },
      {
        title: "4. Save with Health Club Membership",
        desc: "Show your digital Health Club card at partner centers to receive guaranteed member discounts on consultations and diagnostics.",
      },
    ],
  },
};
