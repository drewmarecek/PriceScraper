"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { trackBookingIntent } from "../lib/track";
import BookingModal from "./BookingModal";

type BookingModalContextValue = {
  isBookingModalOpen: boolean;
  /** Open the booking modal. Pass a source label for analytics attribution. */
  openBookingModal: (source?: string) => void;
  closeBookingModal: () => void;
};

const BookingModalContext = createContext<BookingModalContextValue | null>(null);

export function useBookingModal() {
  const ctx = useContext(BookingModalContext);
  if (!ctx) {
    throw new Error("useBookingModal must be used within <BookingModalProvider>");
  }
  return ctx;
}

export default function BookingModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const openBookingModal = useCallback((source = "cta") => {
    trackBookingIntent(source);
    setIsBookingModalOpen(true);
  }, []);

  const closeBookingModal = useCallback(() => setIsBookingModalOpen(false), []);

  return (
    <BookingModalContext.Provider
      value={{ isBookingModalOpen, openBookingModal, closeBookingModal }}
    >
      {children}
      {/* Strict conditional mount: when closed, the modal isn't in the DOM at
          all, so it can never trap the viewport with a scroll lock. Remounting
          on open also naturally resets the two-step flow to step 1. */}
      {isBookingModalOpen && <BookingModal />}
    </BookingModalContext.Provider>
  );
}
