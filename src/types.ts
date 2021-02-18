/* eslint-disable @typescript-eslint/naming-convention */

import { number, string } from "./validators";

export interface Version {
  version: string;
}

export const VersionSpec = {
  version: string,
};

export interface Whoami {
  id: number;
  name: string;
  real_name: string;
}

export const WhoamiSpec = {
  id: number,
  name: string,
  real_name: string,
};
