/* eslint-disable @typescript-eslint/naming-convention */

import type { DateTime } from "luxon";

import { int, string, array, object, boolean, datetime, nullable, optional } from "./validators";

type int = number;
type datetime = DateTime;

export interface Version {
  version: string;
}

export const VersionSpec = {
  version: string,
};

export interface User {
  id: number;
  name: string;
  real_name: string;
}

export const UserSpec = {
  id: int,
  name: string,
  real_name: string,
};

export interface Flag {
  id: int;
  name: string;
  type_id: int;
  creation_date: datetime;
  modification_date: datetime;
  status: string;
  setter: string;
  requestee: string | undefined;
}

export const FlagSpec = {
  id: int,
  name: string,
  type_id: int,
  creation_date: datetime,
  modification_date: datetime,
  status: string,
  setter: string,
  requestee: optional(string),
};

export interface Bug {
  alias: string[];
  assigned_to: string;
  assigned_to_detail: User;
  blocks: number[];
  cc: string[];
  cc_detail: User[];
  classification: string;
  component: string;
  creation_time: datetime;
  creator: string;
  creator_detail: User;
  depends_on: number[];
  dupe_of: int | null;
  flags: Flag[];
  groups: string[];
  id: int;
  is_cc_accessible: boolean;
  is_confirmed: boolean;
  is_open: boolean;
  is_creator_accessible: boolean;
  keywords: string[];
  last_change_time: datetime;
  op_sys: string;
  platform: string;
  priority: string;
  product: string;
  qa_contact: string;
  qa_contact_detail?: User[];
  resolution: string;
  see_also: string[];
  severity: string;
  status: string;
  summary: string;
  target_milestone: string;
  update_token?: string;
  url: string;
  version: string;
  whiteboard: string;
}

export const BugSpec = {
  alias: array(string),
  assigned_to: string,
  assigned_to_detail: object(UserSpec),
  blocks: array(int),
  cc: array(string),
  cc_detail: array(object(UserSpec)),
  classification: string,
  component: string,
  creation_time: datetime,
  creator: string,
  creator_detail: object(UserSpec),
  depends_on: array(int),
  dupe_of: nullable(int),
  flags: array(object(FlagSpec)),
  groups: array(string),
  id: int,
  is_cc_accessible: boolean,
  is_confirmed: boolean,
  is_open: boolean,
  is_creator_accessible: boolean,
  keywords: array(string),
  last_change_time: datetime,
  op_sys: string,
  platform: string,
  priority: string,
  product: string,
  qa_contact: string,
  qa_contact_detail: optional(array(object(UserSpec))),
  resolution: string,
  see_also: array(string),
  severity: string,
  status: string,
  summary: string,
  target_milestone: string,
  update_token: optional(string),
  url: string,
  version: string,
  whiteboard: string,
};

export interface Change {
  field_name: string;
  removed: string;
  added: string;
  attachment_id?: int;
}

export const ChangeSpec = {
  field_name: string,
  removed: string,
  added: string,
  attachment_id: optional(int),
};

export interface History {
  when: datetime;
  who: string;
  changes: Change[];
}

export const HistorySpec = {
  when: datetime,
  who: string,
  changes: array(object(ChangeSpec)),
};

export interface BugHistory {
  id: int;
  alias: string[];
  history: History[];
}

export const BugHistorySpec = {
  id: int,
  alias: array(string),
  history: array(object(HistorySpec)),
};

export interface HistoryLookup {
  bugs: BugHistory[];
}

export const HistoryLookupSpec = {
  bugs: array(object(BugHistorySpec)),
};
