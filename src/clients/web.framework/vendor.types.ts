import type nextUtilities from "./utils/next";
import type { NextApiRequest, NextApiResponse } from "next";
import type { AppProps } from "next/app";

export type VendorAppComponentProps = AppProps;

export type VendorApiRequest = NextApiRequest;

export type VendorApiResponse = NextApiResponse;

export type VendorUtilities = typeof nextUtilities;
