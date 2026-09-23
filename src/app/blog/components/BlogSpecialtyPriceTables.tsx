import { BlogPost } from "@/types/blog";
import { DentalPriceTable } from "./DentalPriceTable";
import { PhysiotherapyPriceTable } from "./PhysiotherapyPriceTable";
import { MaternityPriceTable } from "./MaternityPriceTable";
import { CardiacPriceTable } from "./CardiacPriceTable";
import { KidneyPriceTable } from "./KidneyPriceTable";
import { PediatricPriceTable } from "./PediatricPriceTable";
import { SkinPriceTable } from "./SkinPriceTable";
import { EyePriceTable } from "./EyePriceTable";
import { OrthopedicPriceTable } from "./OrthopedicPriceTable";
import { EntPriceTable } from "./EntPriceTable";
import { SurgeryPriceTable } from "./SurgeryPriceTable";
import { NeurologyPriceTable } from "./NeurologyPriceTable";
import { DiabetesPriceTable } from "./DiabetesPriceTable";
import { PsychiatryPriceTable } from "./PsychiatryPriceTable";
import { SadarHospitalPriceTable } from "./SadarHospitalPriceTable";
import { DiabeticHospitalPriceTable } from "./DiabeticHospitalPriceTable";
import { UpazilaPriceTable } from "./UpazilaPriceTable";
import { CriticalCarePriceTable } from "./CriticalCarePriceTable";
import { StrokeCardiacPriceTable } from "./StrokeCardiacPriceTable";
import { HomeCarePriceTable } from "./HomeCarePriceTable";
import { OxygenPriceTable } from "./OxygenPriceTable";
import { DengueTyphoidPriceTable } from "./DengueTyphoidPriceTable";

interface BlogSpecialtyPriceTablesProps {
  post: BlogPost;
  locale?: string;
}

export function BlogSpecialtyPriceTables({
  post,
  locale = "bn",
}: BlogSpecialtyPriceTablesProps) {
  return (
    <>
      {post.dentalProcedurePricingBn && (
        <DentalPriceTable
          pricingData={post.dentalProcedurePricingBn}
          locale={locale}
        />
      )}
      {post.physiotherapyTreatmentPricingBn && (
        <PhysiotherapyPriceTable
          pricingData={post.physiotherapyTreatmentPricingBn}
          locale={locale}
        />
      )}
      {post.maternityCarePricingBn && (
        <MaternityPriceTable
          pricingData={post.maternityCarePricingBn}
          locale={locale}
        />
      )}
      {post.cardiacCarePricingBn && (
        <CardiacPriceTable
          pricingData={post.cardiacCarePricingBn}
          locale={locale}
        />
      )}
      {post.kidneyCarePricingBn && (
        <KidneyPriceTable
          pricingData={post.kidneyCarePricingBn}
          locale={locale}
        />
      )}
      {post.pediatricCarePricingBn && (
        <PediatricPriceTable
          pricingData={post.pediatricCarePricingBn}
          locale={locale}
        />
      )}
      {post.skinCarePricingBn && (
        <SkinPriceTable
          pricingData={post.skinCarePricingBn}
          locale={locale}
        />
      )}
      {post.eyeCarePricingBn && (
        <EyePriceTable
          pricingData={post.eyeCarePricingBn}
          locale={locale}
        />
      )}
      {post.orthopedicCarePricingBn && (
        <OrthopedicPriceTable
          pricingData={post.orthopedicCarePricingBn}
          locale={locale}
        />
      )}
      {post.entCarePricingBn && (
        <EntPriceTable
          pricingData={post.entCarePricingBn}
          locale={locale}
        />
      )}
      {post.surgicalCarePricingBn && (
        <SurgeryPriceTable
          pricingData={post.surgicalCarePricingBn}
          locale={locale}
        />
      )}
      {post.neurologyCarePricingBn && (
        <NeurologyPriceTable
          pricingData={post.neurologyCarePricingBn}
          locale={locale}
        />
      )}
      {post.diabetesCarePricingBn && (
        <DiabetesPriceTable
          pricingData={post.diabetesCarePricingBn}
          locale={locale}
        />
      )}
      {post.psychiatryCarePricingBn && (
        <PsychiatryPriceTable
          pricingData={post.psychiatryCarePricingBn}
          locale={locale}
        />
      )}
      {post.sadarHospitalPricingBn && (
        <SadarHospitalPriceTable
          pricingData={post.sadarHospitalPricingBn}
          locale={locale}
        />
      )}
      {post.diabeticHospitalPricingBn && (
        <DiabeticHospitalPriceTable
          pricingData={post.diabeticHospitalPricingBn}
          locale={locale}
        />
      )}
      {post.upazilaCarePricingBn && (
        <UpazilaPriceTable
          pricingData={post.upazilaCarePricingBn}
          locale={locale}
        />
      )}
      {post.criticalCarePricingBn && (
        <CriticalCarePriceTable
          pricingData={post.criticalCarePricingBn}
          locale={locale}
        />
      )}
      {post.strokeCardiacPricingBn && (
        <StrokeCardiacPriceTable
          pricingData={post.strokeCardiacPricingBn}
          locale={locale}
        />
      )}
      {post.homeCarePricingBn && (
        <HomeCarePriceTable
          pricingData={post.homeCarePricingBn}
          locale={locale}
        />
      )}
      {post.oxygenPricingBn && (
        <OxygenPriceTable
          pricingData={post.oxygenPricingBn}
          locale={locale}
        />
      )}
      {post.dengueTyphoidPricingBn && (
        <DengueTyphoidPriceTable
          pricingData={post.dengueTyphoidPricingBn}
          locale={locale}
        />
      )}
    </>
  );
}
