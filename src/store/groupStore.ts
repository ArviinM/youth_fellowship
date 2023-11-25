import {create} from 'zustand';
import {Group} from "../types/Group.ts";

type GroupStore = {
    selectedGroup: Group | null;
    setSelectedGroup: (group: Group | null) => void;
    activeGroup: number | null;
    setActiveGroup: (id: number | null) => void;
    clearActiveGroup: () => void;
};

export const useGroupStore = create<GroupStore>((set) => ({
    selectedGroup: null,
    setSelectedGroup: (group) => set({selectedGroup: group}),
    activeGroup: null,
    setActiveGroup: (id) => set({activeGroup: id}),
    clearActiveGroup: () => set({activeGroup: null}),
}));
