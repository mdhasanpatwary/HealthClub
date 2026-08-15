"use client";

import { useLanguage } from "@/components/layout/LanguageProvider";
import { useAdminDoctors } from "../hooks/useAdminDoctors";
import { DoctorsTab } from "../components/DoctorsTab";
import { DoctorDialog } from "../components/DoctorDialog";

export default function AdminDoctorsPage() {
  const { t, locale } = useLanguage();
  const {
    filteredDoctors,
    doctorSearch,
    setDoctorSearch,
    isDoctorOpen,
    setIsDoctorOpen,
    editingDoctor,
    newDoctor,
    setNewDoctor,
    handleOpenNewDoctor,
    handleEditDoctor,
    handleSaveDoctor,
    handleDeleteDoctor,
  } = useAdminDoctors();

  const onSave = async (e: React.FormEvent) => {
    await handleSaveDoctor(e);
    window.dispatchEvent(new Event("admin-data-change"));
  };

  const onDelete = async (id: string, name: string) => {
    await handleDeleteDoctor(id, name);
    window.dispatchEvent(new Event("admin-data-change"));
  };

  return (
    <div className="space-y-6">
      <DoctorsTab
        filteredDoctors={filteredDoctors}
        doctorSearch={doctorSearch}
        setDoctorSearch={setDoctorSearch}
        onNewDoctorClick={handleOpenNewDoctor}
        onEditClick={handleEditDoctor}
        onDeleteClick={onDelete}
        locale={locale}
        t={t}
      />

      {isDoctorOpen && (
        <DoctorDialog
          isOpen={isDoctorOpen}
          onClose={() => setIsDoctorOpen(false)}
          editingDoctor={editingDoctor}
          newDoctor={newDoctor}
          setNewDoctor={setNewDoctor}
          onSubmit={onSave}
          t={t}
        />
      )}
    </div>
  );
}
