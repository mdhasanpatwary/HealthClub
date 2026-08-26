"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Doctor } from "@/services/db";
import {
  getPaginatedDoctorsAdminAction,
  updateDoctorAction,
  addDoctorAction,
  deleteDoctorAction,
} from "@/app/actions/doctorActions";
import { useDebounce } from "@/hooks/useDebounce";

export function useAdminDoctors() {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [doctorSearch, setDoctorSearch] = useState("");
  const debouncedSearch = useDebounce(doctorSearch, 300);

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
    upazila: "feni-sadar",
    availableToday: true,
    onLeaveUntil: "",
    notice: "",
  });

  const loadDoctors = useCallback(async () => {
    try {
      const res = await getPaginatedDoctorsAdminAction({
        page,
        pageSize,
        search: debouncedSearch,
      });
      setDoctors(res.data);
      setTotalItems(res.totalItems);
      setTotalPages(res.totalPages);
    } catch {
      // Ignore load doctors errors silently
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch]);

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
  }, [loadDoctors]);


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
      upazila: "feni-sadar",
      availableToday: true,
      onLeaveUntil: "",
      notice: "",
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
      upazila: doc.upazila || "feni-sadar",
      availableToday: doc.availableToday !== false,
      onLeaveUntil: doc.onLeaveUntil ? doc.onLeaveUntil.slice(0, 10) : "",
      notice: doc.notice || "",
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
        const res = await updateDoctorAction(editingDoctor.id, newDoctor);
        if (res.success) {
          toast.success("ডাক্তারের তথ্য সফলভাবে আপডেট হয়েছে!");
          setIsDoctorOpen(false);
          await loadDoctors();
        } else {
          toast.error(res.error || "আপডেট ব্যর্থ হয়েছে।");
        }
      } else {
        const res = await addDoctorAction({
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
    } catch {
      toast.error("প্রক্রিয়াটি সম্পন্ন করতে সমস্যা হয়েছে।");
    }
  };

  const handleDeleteDoctor = async (id: string, name: string) => {
    if (!confirm(`আপনি কি নিশ্চিতভাবে "${name}" ডাক্তারকে ডিলিট করতে চান?`)) return;

    try {
      const res = await deleteDoctorAction(id);
      if (res.success) {
        toast.success("ডাক্তার সফলভাবে ডিলিট হয়েছে!");
        await loadDoctors();
      } else {
        toast.error(res.error || "ডিলিট ব্যর্থ হয়েছে।");
      }
    } catch {
      toast.error("ডিলিট করতে সমস্যা হয়েছে।");
    }
  };

  return {
    loading,
    doctors,
    totalItems,
    totalPages,
    page,
    setPage,
    pageSize,
    setPageSize,
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
    loadDoctors,
  };
}

