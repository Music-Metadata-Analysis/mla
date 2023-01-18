import type nextUtilities from "../ssr/utils/next";
import type { NextApiRequest, NextApiResponse } from "next";
import type { AppProps } from "next/app";

export type VendorAppComponentProps<T> = AppProps<T>;

export type VendorApiRequest = NextApiRequest;

export type VendorApiResponse = NextApiResponse;

export type VendorUtilities = typeof nextUtilities;
