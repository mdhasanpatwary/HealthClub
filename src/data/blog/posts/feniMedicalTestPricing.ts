import { DiagnosticTestPriceItem } from "@/types/blog";
import { FENI_LAB_TEST_PRICING } from "./feniLabTestPricing";
import { FENI_RADIOLOGY_TEST_PRICING } from "./feniRadiologyPricing";

export const FENI_MEDICAL_TEST_PRICING: DiagnosticTestPriceItem[] = [
  ...FENI_LAB_TEST_PRICING,
  ...FENI_RADIOLOGY_TEST_PRICING,
];

export { FENI_LAB_TEST_PRICING, FENI_RADIOLOGY_TEST_PRICING };
