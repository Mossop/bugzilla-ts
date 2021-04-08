import { URL, URLSearchParams } from "url";

import type { DateTime } from "luxon";

import type { BugzillaLink, SearchParams } from "./link";
import { PublicLink, params, PasswordLink, ApiKeyLink } from "./link";
import { FilteredQuery } from "./query";
import type { Bug, Version, User, History } from "./types";
import { HistoryLookupSpec, BugSpec, UserSpec, VersionSpec } from "./types";
import { array, object } from "./validators";

export type { Bug };

export default class BugzillaAPI {
  private readonly link: BugzillaLink;

  public constructor(instance: URL | string);
  public constructor(instance: URL | string, apiKey: string);
  public constructor(
    instance: URL | string,
    username: string,
    password: string,
    restrictLogin?: boolean,
  );
  public constructor(
    instance: URL | string,
    user?: string,
    password?: string,
    restrictLogin: boolean = false,
  ) {
    if (!(instance instanceof URL)) {
      instance = new URL(instance);
    }

    if (!user) {
      this.link = new PublicLink(instance);
    } else if (password !== undefined) {
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

  public async bugHistory(bugId: number | string, since?: DateTime): Promise<History[]> {
    let params: URLSearchParams | undefined = undefined;

    if (since) {
      params = new URLSearchParams();
      params.set("new_since", since.toISODate());
    }

    let bugs = await this.link.get(`bug/${bugId}/history`, object(HistoryLookupSpec), params);

    if (bugs.bugs.length == 0) {
      throw new Error("Bug not found.");
    }

    return bugs.bugs[0].history;
  }

  public searchBugs(
    query: SearchParams,
  ): FilteredQuery<Bug> {
    return new FilteredQuery(
      async (includes: string[] | undefined, excludes: string[] | undefined): Promise<Bug[]> => {
        let search = params(query);
        if (includes) {
          search.set("include_fields", includes.join(","));
        }
        if (excludes) {
          search.set("exclude_fields", excludes.join(","));
        }

        let result = await this.link.get(
          "bug",
          object({
            bugs: array(object(BugSpec, includes, excludes)),
          }),
          search,
        );

        return result.bugs;
      },
    );
  }

  public getBugs(ids: (number | string)[]): FilteredQuery<Bug> {
    return this.searchBugs({
      id: ids.join(","),
    });
  }

  public quicksearch(query: string): FilteredQuery<Bug> {
    return this.searchBugs({
      quicksearch: query,
    });
  }

  public advancedSearch(
    query: string | URL | Record<string, string> | [string, string][] | URLSearchParams,
  ): FilteredQuery<Bug> {
    if (query instanceof URL) {
      query = query.searchParams;
    } else if (typeof query == "string" && query.startsWith("http")) {
      query = new URL(query).searchParams;
    }

    if (!(query instanceof URLSearchParams)) {
      query = new URLSearchParams(query);
    }

    query.delete("list_id");

    return this.searchBugs(query);
  }
}
