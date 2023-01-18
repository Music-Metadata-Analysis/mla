import type { NextConnect } from "next-connect";

export type ParameterizedVendorApiHandlerType<Req, Res> = NextConnect<Req, Res>;
