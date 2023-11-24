import {create} from 'zustand';
import {Attendee} from "../types/Attendee.ts";

type AttendeeStore = {
    selectedAttendee: Attendee | null;
    setSelectedAttendee: (attendee: Attendee | null) => void;
    activeAttendee: number | null;
    setActiveAttendee: (id: number | null) => void;
    clearActiveAttendee: () => void;
};

export const useAttendeeStore = create<AttendeeStore>((set) => ({
    selectedAttendee: null,
    setSelectedAttendee: (attendee) => set({selectedAttendee: attendee}),
    activeAttendee: null,
    setActiveAttendee: (id) => set({activeAttendee: id}),
    clearActiveAttendee: () => set({activeAttendee: null}),
}));
