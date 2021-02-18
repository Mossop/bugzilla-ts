import { URL } from "url";

import type { BugzillaLink } from "./link";
import { PasswordLink, ApiKeyLink } from "./link";
import type { Version, Whoami } from "./types";
import { WhoamiSpec, VersionSpec } from "./types";
import { object } from "./validators";

export default class BugzillaAPI {
  private readonly link: BugzillaLink;

  public constructor(instance: URL | string, apiKey: string);
  public constructor(
    instance: URL | string,
    username: string,
    password: string,
    restrictLogin?: boolean,
  );
  public constructor(
    instance: URL | string,
    user: string,
    password?: string,
    restrictLogin: boolean = false,
  ) {
    if (!(instance instanceof URL)) {
      instance = new URL(instance);
    }

    if (password !== undefined) {
      this.link = new PasswordLink(instance, user, password, restrictLogin);
    } else {
      this.link = new ApiKeyLink(instance, user);
    }
  }

  public async version(): Promise<string> {
    let version: Version = await this.link.get("version", object(VersionSpec));

    return version.version;
  }

  public whoami(): Promise<Whoami> {
    return this.link.get("whoami", object(WhoamiSpec));
  }
}
