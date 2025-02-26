import { atom } from "recoil";

type user = {
    id: string;
    email: string;
    name: string;
    profileImage: string;
    // Add other fields as needed
};

export const authAtom = atom<{isAuthenticated: boolean; user: user | null}>({
  key: 'authAtom',
  default: {
    isAuthenticated: false,
    user: null,
  }
});