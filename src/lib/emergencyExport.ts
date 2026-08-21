import { BloodDonor, AmbulanceService, EmergencyHotline } from "@/data/emergencyData";
import { exportToCsv } from "./exportUtils";

export function exportEmergencyData(
  activeSubTab: "donors" | "ambulances" | "hotlines",
  donors: BloodDonor[],
  ambulances: AmbulanceService[],
  hotlines: EmergencyHotline[]
) {
  if (activeSubTab === "donors") {
    exportToCsv(donors, "healthclub_blood_donors", [
      { header: "ID", accessor: "id" },
      { header: "Name", accessor: "name" },
      { header: "Blood Group", accessor: "bloodGroup" },
      { header: "Upazila", accessor: "upazila" },
      { header: "Phone", accessor: "phone" },
      { header: "Last Donated", accessor: "lastDonated" },
      { header: "Available", accessor: (d) => (d.isAvailable ? "Yes" : "No") },
    ]);
  } else if (activeSubTab === "ambulances") {
    exportToCsv(ambulances, "healthclub_ambulances", [
      { header: "ID", accessor: "id" },
      { header: "Name", accessor: "name" },
      { header: "Type", accessor: "type" },
      { header: "Location", accessor: "location" },
      { header: "Phone", accessor: "phone" },
      { header: "Hours", accessor: "availableHours" },
    ]);
  } else {
    exportToCsv(hotlines, "healthclub_emergency_hotlines", [
      { header: "ID", accessor: "id" },
      { header: "Title (BN)", accessor: "titleBn" },
      { header: "Title (EN)", accessor: "titleEn" },
      { header: "Category", accessor: "category" },
      { header: "Phone", accessor: "phone" },
      { header: "Description", accessor: "descriptionBn" },
    ]);
  }
}
