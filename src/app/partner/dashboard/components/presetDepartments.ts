export interface PresetDepartment {
  nameKey: string;
  discount: string;
  descKey: string;
}

export const PRESET_DEPARTMENTS: PresetDepartment[] = [
  { nameKey: "partner.profile.presetPathology", discount: "25%", descKey: "partner.profile.presetPathologyDesc" },
  { nameKey: "partner.profile.presetRadiology", discount: "20%", descKey: "partner.profile.presetRadiologyDesc" },
  { nameKey: "partner.profile.presetCabin", discount: "10%", descKey: "partner.profile.presetCabinDesc" },
  { nameKey: "partner.profile.presetPharmacy", discount: "5%", descKey: "partner.profile.presetPharmacyDesc" },
  { nameKey: "partner.profile.presetDoctor", discount: "15%", descKey: "partner.profile.presetDoctorDesc" },
  { nameKey: "partner.profile.presetAmbulance", discount: "10%", descKey: "partner.profile.presetAmbulanceDesc" },
  { nameKey: "partner.profile.presetDental", discount: "20%", descKey: "partner.profile.presetDentalDesc" },
  { nameKey: "partner.profile.presetSurgery", discount: "15%", descKey: "partner.profile.presetSurgeryDesc" },
];

export function createDepartmentDiscountId(prefix = "dept") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
}
