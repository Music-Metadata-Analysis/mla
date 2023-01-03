import type nextAuthConfiguration from "./config/next-auth";
import type { Profile } from "next-auth";

export type VendorConfigType = typeof nextAuthConfiguration;

export type VendorProfileType = Profile;
