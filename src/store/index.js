import { create } from "zustand";
import { createAuthSlice } from "./slice/auth-slice";

export const userAppStore = create((set, get) => ({
  ...createAuthSlice(set, get),
}));