import type { LastFMImageDataInterface } from "./image.data.types";

export interface LastFMUserProfileInterface {
  image: LastFMImageDataInterface[];
  playcount: number;
}
