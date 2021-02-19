import { URL } from "url";

import type { BugzillaLink } from "./link";
import { PasswordLink, ApiKeyLink } from "./link";
import { FilteredQuery } from "./query";
import type { Bug, Version, User } from "./types";
import { BugSpec, UserSpec, VersionSpec } from "./types";
import { array, object } from "./validators";

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

  public whoami(): Promise<User> {
    return this.link.get("whoami", object(UserSpec));
  }

  public getBug(id: number): FilteredQuery<Bug | null> {
    return new FilteredQuery(
      async (
        includes: string[] | undefined,
        excludes: string[] | undefined,
      ): Promise<Bug | null> => {
        let result = await this.link.get(
          "bug",
          object({
            bugs: array(object(BugSpec, includes, excludes)),
          }),
          {
            id: id.toString(),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            include_fields: includes?.join(","),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            exclude_fields: excludes?.join(","),
          },
        );

        return result.bugs.length ? result.bugs[0] : null;
      },
    );
  }

  public getBugs(ids: number[]): FilteredQuery<Bug[]> {
    return new FilteredQuery(
      async (includes: string[] | undefined, excludes: string[] | undefined): Promise<Bug[]> => {
        let result = await this.link.get(
          "bug",
          object({
            bugs: array(object(BugSpec, includes, excludes)),
          }),
          {
            id: ids.join(","),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            include_fields: includes?.join(","),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            exclude_fields: excludes?.join(","),
          },
        );

        return result.bugs;
      },
    );
  }
}
