/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-redeclare */
import type { DateTime } from "luxon";

import {
  int,
  string,
  array,
  object,
  boolean,
  datetime,
  nullable,
  optional,
  maybeArray,
  ObjectSpec,
} from "./validators";

type int = number;
type datetime = DateTime;

export interface LoginResponse {
  id: int;
  token: string;
}

export const LoginResponseSpec: ObjectSpec<LoginResponse> = {
  id: int,
  token: string,
};

export interface Version {
  version: string;
}

export const VersionSpec: ObjectSpec<Version> = {
  version: string,
};

export interface User {
  id: int;
  name: string;
  real_name: string;
}

export const UserSpec: ObjectSpec<User> = {
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

export const FlagSpec: ObjectSpec<Flag> = {
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
  alias: string | string[];
  assigned_to: string;
  assigned_to_detail: User;
  blocks: number[];
  cc: string[];
  cc_detail: User[];
  classification: string;
  component: string | string[];
  creation_time: datetime;
  creator: string;
  creator_detail: User;
  depends_on: number[];
  dupe_of: int | null;
  flags: Flag[] | undefined;
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
  qa_contact_detail?: User;
  resolution: string;
  see_also: string[];
  severity: string;
  status: string;
  summary: string;
  target_milestone: string;
  update_token?: string;
  url: string;
  version: string | string[];
  whiteboard: string;
}

export const BugSpec: ObjectSpec<Bug> = {
  alias: nullable(maybeArray(string), []),
  assigned_to: string,
  assigned_to_detail: object(UserSpec),
  blocks: array(int),
  cc: array(string),
  cc_detail: array(object(UserSpec)),
  classification: string,
  component: maybeArray(string),
  creation_time: datetime,
  creator: string,
  creator_detail: object(UserSpec),
  depends_on: array(int),
  dupe_of: nullable(int),
  flags: optional(array(object(FlagSpec))),
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
  qa_contact_detail: optional(object(UserSpec)),
  resolution: string,
  see_also: array(string),
  severity: string,
  status: string,
  summary: string,
  target_milestone: string,
  update_token: optional(string),
  url: string,
  version: maybeArray(string),
  whiteboard: string,
};

export interface Change {
  field_name: string;
  removed: string;
  added: string;
  attachment_id?: int;
}

export const ChangeSpec: ObjectSpec<Change> = {
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

export const HistorySpec: ObjectSpec<History> = {
  when: datetime,
  who: string,
  changes: array(object(ChangeSpec)),
};

export interface BugHistory {
  id: int;
  alias: string[];
  history: History[];
}

export const BugHistorySpec: ObjectSpec<BugHistory> = {
  id: int,
  alias: array(string),
  history: array(object(HistorySpec)),
};

export interface HistoryLookup {
  bugs: BugHistory[];
}

export const HistoryLookupSpec: ObjectSpec<HistoryLookup> = {
  bugs: array(object(BugHistorySpec)),
};
