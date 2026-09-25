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
}

export function BlogSpecialtyPriceTables({
  post,
}: BlogSpecialtyPriceTablesProps) {
  return (
    <>
      {post.dentalProcedurePricingBn && (
        <DentalPriceTable
          pricingData={post.dentalProcedurePricingBn}
        />
      )}
      {post.physiotherapyTreatmentPricingBn && (
        <PhysiotherapyPriceTable
          pricingData={post.physiotherapyTreatmentPricingBn}
        />
      )}
      {post.maternityCarePricingBn && (
        <MaternityPriceTable
          pricingData={post.maternityCarePricingBn}
        />
      )}
      {post.cardiacCarePricingBn && (
        <CardiacPriceTable
          pricingData={post.cardiacCarePricingBn}
        />
      )}
      {post.kidneyCarePricingBn && (
        <KidneyPriceTable
          pricingData={post.kidneyCarePricingBn}
        />
      )}
      {post.pediatricCarePricingBn && (
        <PediatricPriceTable
          pricingData={post.pediatricCarePricingBn}
        />
      )}
      {post.skinCarePricingBn && (
        <SkinPriceTable
          pricingData={post.skinCarePricingBn}
        />
      )}
      {post.eyeCarePricingBn && (
        <EyePriceTable
          pricingData={post.eyeCarePricingBn}
        />
      )}
      {post.orthopedicCarePricingBn && (
        <OrthopedicPriceTable
          pricingData={post.orthopedicCarePricingBn}
        />
      )}
      {post.entCarePricingBn && (
        <EntPriceTable
          pricingData={post.entCarePricingBn}
        />
      )}
      {post.surgicalCarePricingBn && (
        <SurgeryPriceTable
          pricingData={post.surgicalCarePricingBn}
        />
      )}
      {post.neurologyCarePricingBn && (
        <NeurologyPriceTable
          pricingData={post.neurologyCarePricingBn}
        />
      )}
      {post.diabetesCarePricingBn && (
        <DiabetesPriceTable
          pricingData={post.diabetesCarePricingBn}
        />
      )}
      {post.psychiatryCarePricingBn && (
        <PsychiatryPriceTable
          pricingData={post.psychiatryCarePricingBn}
        />
      )}
      {post.sadarHospitalPricingBn && (
        <SadarHospitalPriceTable
          pricingData={post.sadarHospitalPricingBn}
        />
      )}
      {post.diabeticHospitalPricingBn && (
        <DiabeticHospitalPriceTable
          pricingData={post.diabeticHospitalPricingBn}
        />
      )}
      {post.upazilaCarePricingBn && (
        <UpazilaPriceTable
          pricingData={post.upazilaCarePricingBn}
        />
      )}
      {post.criticalCarePricingBn && (
        <CriticalCarePriceTable
          pricingData={post.criticalCarePricingBn}
        />
      )}
      {post.strokeCardiacPricingBn && (
        <StrokeCardiacPriceTable
          pricingData={post.strokeCardiacPricingBn}
        />
      )}
      {post.homeCarePricingBn && (
        <HomeCarePriceTable
          pricingData={post.homeCarePricingBn}
        />
      )}
      {post.oxygenPricingBn && (
        <OxygenPriceTable
          pricingData={post.oxygenPricingBn}
        />
      )}
      {post.dengueTyphoidPricingBn && (
        <DengueTyphoidPriceTable
          pricingData={post.dengueTyphoidPricingBn}
        />
      )}
    </>
  );
}
