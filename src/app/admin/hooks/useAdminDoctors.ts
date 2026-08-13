"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { dbStore } from "@/services/dbStore";
import { Doctor } from "@/services/db";

export function useAdminDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [isDoctorOpen, setIsDoctorOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialty: "",
    department: "medicine",
    degrees: "",
    designation: "",
    chamberName: "",
    chamberAddress: "",
    roomNo: "",
    visitingDays: "",
    visitingHours: "",
    serialPhone: "",
    consultationFee: "",
    imageUrl: "",
  });

  const loadDoctors = async () => {
    try {
      const data = await dbStore.getAllDoctorsAdmin();
      setDoctors(data);
    } catch (err) {
      console.error("Failed to load doctors:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (isMounted) {
        loadDoctors();
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredDoctors = doctors.filter((d) => {
    const q = doctorSearch.toLowerCase().trim();
    return (
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.specialty.toLowerCase().includes(q) ||
      d.department.toLowerCase().includes(q) ||
      d.chamberName.toLowerCase().includes(q)
    );
  });

  const handleOpenNewDoctor = () => {
    setEditingDoctor(null);
    setNewDoctor({
      name: "",
      specialty: "",
      department: "medicine",
      degrees: "",
      designation: "",
      chamberName: "",
      chamberAddress: "",
      roomNo: "",
      visitingDays: "",
      visitingHours: "",
      serialPhone: "",
      consultationFee: "",
      imageUrl: "",
    });
    setIsDoctorOpen(true);
  };

  const handleEditDoctor = (doc: Doctor) => {
    setEditingDoctor(doc);
    setNewDoctor({
      name: doc.name,
      specialty: doc.specialty,
      department: doc.department,
      degrees: doc.degrees,
      designation: doc.designation,
      chamberName: doc.chamberName,
      chamberAddress: doc.chamberAddress,
      roomNo: doc.roomNo || "",
      visitingDays: doc.visitingDays,
      visitingHours: doc.visitingHours,
      serialPhone: doc.serialPhone,
      consultationFee: doc.consultationFee || "",
      imageUrl: doc.imageUrl || "",
    });
    setIsDoctorOpen(true);
  };

  const handleSaveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctor.name || !newDoctor.specialty || !newDoctor.chamberName || !newDoctor.serialPhone) {
      toast.error("সবগুলো আবশ্যক তথ্য পূরণ করুন।");
      return;
    }

    try {
      if (editingDoctor) {
        const res = await dbStore.updateDoctor(editingDoctor.id, newDoctor);
        if (res.success) {
          toast.success("ডাক্তারের তথ্য সফলভাবে আপডেট হয়েছে!");
          setIsDoctorOpen(false);
          await loadDoctors();
        } else {
          toast.error(res.error || "আপডেট ব্যর্থ হয়েছে।");
        }
      } else {
        const res = await dbStore.addDoctor({
          ...newDoctor,
          isActive: true,
        });
        if (res.success) {
          toast.success("নতুন ডাক্তার সফলভাবে যুক্ত হয়েছে!");
          setIsDoctorOpen(false);
          await loadDoctors();
        } else {
          toast.error(res.error || "যুক্ত করা ব্যর্থ হয়েছে।");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("প্রক্রিয়াটি সম্পন্ন করতে সমস্যা হয়েছে।");
    }
  };

  const handleDeleteDoctor = async (id: string, name: string) => {
    if (!confirm(`আপনি কি নিশ্চিতভাবে "${name}" ডাক্তারকে ডিলিট করতে চান?`)) return;

    try {
      const res = await dbStore.deleteDoctor(id);
      if (res.success) {
        toast.success("ডাক্তার সফলভাবে ডিলিট হয়েছে!");
        await loadDoctors();
      } else {
        toast.error(res.error || "ডিলিট ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      console.error(err);
      toast.error("ডিলিট করতে সমস্যা হয়েছে।");
    }
  };

  return {
    doctors,
    doctorSearch,
    setDoctorSearch,
    filteredDoctors,
    isDoctorOpen,
    setIsDoctorOpen,
    editingDoctor,
    newDoctor,
    setNewDoctor,
    handleOpenNewDoctor,
    handleEditDoctor,
    handleSaveDoctor,
    handleDeleteDoctor,
    loadDoctors,
  };
}
