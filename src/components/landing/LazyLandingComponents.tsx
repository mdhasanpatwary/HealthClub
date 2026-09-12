"use client";

import dynamic from "next/dynamic";
import LazyHydrate from "@/components/common/LazyHydrate";
import {
  SavingsCalculatorSkeleton,
  TestimonialSkeleton,
  ContactFormSkeleton,
  PartnerGridSkeleton,
} from "@/components/ui/skeleton";
import type { Partner } from "@/services/db";
import type { PublicContactSettings } from "@/app/actions/systemSettingsActions";

const SavingsCalculator = dynamic(() => import("@/components/ui/SavingsCalculator"), {
  loading: () => <SavingsCalculatorSkeleton />,
  ssr: false,
});

const TestimonialCarousel = dynamic(() => import("@/components/ui/TestimonialCarousel"), {
  loading: () => <TestimonialSkeleton />,
  ssr: false,
});

const ContactForm = dynamic(() => import("@/components/landing/ContactForm"), {
  loading: () => <ContactFormSkeleton />,
  ssr: false,
});

const PartnerDirectory = dynamic(() => import("@/components/ui/PartnerDirectory"), {
  loading: () => <PartnerGridSkeleton count={3} />,
  ssr: false,
});

export function LazyPartnerDirectorySection({ partners }: { partners: Partner[] }) {
  return (
    <LazyHydrate fallback={<PartnerGridSkeleton count={3} />}>
      <PartnerDirectory partners={partners} limit={3} showFilters={false} />
    </LazyHydrate>
  );
}

export function LazySavingsCalculatorSection() {
  return (
    <LazyHydrate fallback={<SavingsCalculatorSkeleton />}>
      <SavingsCalculator />
    </LazyHydrate>
  );
}

export function LazyTestimonialsSection() {
  return (
    <LazyHydrate fallback={<TestimonialSkeleton />}>
      <TestimonialCarousel />
    </LazyHydrate>
  );
}

export function LazyContactFormSection({
  initialSettings,
}: {
  initialSettings?: PublicContactSettings;
}) {
  return (
    <LazyHydrate fallback={<ContactFormSkeleton />}>
      <ContactForm initialSettings={initialSettings} />
    </LazyHydrate>
  );
}
