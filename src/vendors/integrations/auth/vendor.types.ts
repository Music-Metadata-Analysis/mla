import type nextAuthConfiguration from "./backend/config/next-auth";
import type { Profile, Session } from "next-auth";

export type VendorStateType = Session;

export type VendorConfigType = typeof nextAuthConfiguration;

export type VendorProfileType = Profile;
