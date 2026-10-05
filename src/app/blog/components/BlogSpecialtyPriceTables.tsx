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
  pricingNum?: number;
}

export function BlogSpecialtyPriceTables({
  post,
  pricingNum,
}: BlogSpecialtyPriceTablesProps) {
  return (
    <>
      {post.dentalProcedurePricingBn && (
        <DentalPriceTable
          pricingData={post.dentalProcedurePricingBn}
          pricingNum={pricingNum}
        />
      )}
      {post.physiotherapyTreatmentPricingBn && (
        <PhysiotherapyPriceTable
          pricingData={post.physiotherapyTreatmentPricingBn}
          pricingNum={pricingNum}
        />
      )}
      {post.maternityCarePricingBn && (
        <MaternityPriceTable
          pricingData={post.maternityCarePricingBn}
          pricingNum={pricingNum}
        />
      )}
      {post.cardiacCarePricingBn && (
        <CardiacPriceTable
          pricingData={post.cardiacCarePricingBn}
          pricingNum={pricingNum}
        />
      )}
      {post.kidneyCarePricingBn && (
        <KidneyPriceTable
          pricingData={post.kidneyCarePricingBn}
          pricingNum={pricingNum}
        />
      )}
      {post.pediatricCarePricingBn && (
        <PediatricPriceTable
          pricingData={post.pediatricCarePricingBn}
          pricingNum={pricingNum}
        />
      )}
      {post.skinCarePricingBn && (
        <SkinPriceTable
          pricingData={post.skinCarePricingBn}
          pricingNum={pricingNum}
        />
      )}
      {post.eyeCarePricingBn && (
        <EyePriceTable
          pricingData={post.eyeCarePricingBn}
          pricingNum={pricingNum}
        />
      )}
      {post.orthopedicCarePricingBn && (
        <OrthopedicPriceTable
          pricingData={post.orthopedicCarePricingBn}
          pricingNum={pricingNum}
        />
      )}
      {post.entCarePricingBn && (
        <EntPriceTable
          pricingData={post.entCarePricingBn}
          pricingNum={pricingNum}
        />
      )}
      {post.surgicalCarePricingBn && (
        <SurgeryPriceTable
          pricingData={post.surgicalCarePricingBn}
          pricingNum={pricingNum}
        />
      )}
      {post.neurologyCarePricingBn && (
        <NeurologyPriceTable
          pricingData={post.neurologyCarePricingBn}
          pricingNum={pricingNum}
        />
      )}
      {post.diabetesCarePricingBn && (
        <DiabetesPriceTable
          pricingData={post.diabetesCarePricingBn}
          pricingNum={pricingNum}
        />
      )}
      {post.psychiatryCarePricingBn && (
        <PsychiatryPriceTable
          pricingData={post.psychiatryCarePricingBn}
          pricingNum={pricingNum}
        />
      )}
      {post.sadarHospitalPricingBn && (
        <SadarHospitalPriceTable
          pricingData={post.sadarHospitalPricingBn}
          pricingNum={pricingNum}
        />
      )}
      {post.diabeticHospitalPricingBn && (
        <DiabeticHospitalPriceTable
          pricingData={post.diabeticHospitalPricingBn}
          pricingNum={pricingNum}
        />
      )}
      {post.upazilaCarePricingBn && (
        <UpazilaPriceTable
          pricingData={post.upazilaCarePricingBn}
          pricingNum={pricingNum}
        />
      )}
      {post.criticalCarePricingBn && (
        <CriticalCarePriceTable
          pricingData={post.criticalCarePricingBn}
          pricingNum={pricingNum}
        />
      )}
      {post.strokeCardiacPricingBn && (
        <StrokeCardiacPriceTable
          pricingData={post.strokeCardiacPricingBn}
          pricingNum={pricingNum}
        />
      )}
      {post.homeCarePricingBn && (
        <HomeCarePriceTable
          pricingData={post.homeCarePricingBn}
          pricingNum={pricingNum}
        />
      )}
      {post.oxygenPricingBn && (
        <OxygenPriceTable
          pricingData={post.oxygenPricingBn}
          pricingNum={pricingNum}
        />
      )}
      {post.dengueTyphoidPricingBn && (
        <DengueTyphoidPriceTable
          pricingData={post.dengueTyphoidPricingBn}
          pricingNum={pricingNum}
        />
      )}
    </>
  );
}
