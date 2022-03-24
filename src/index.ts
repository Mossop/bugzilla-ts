import { URL, URLSearchParams } from "url";

import type { DateTime } from "luxon";

import type { BugzillaLink, SearchParams } from "./link";
import { PublicLink, params, PasswordLink, ApiKeyLink } from "./link";
import { FilteredQuery } from "./query";
import type { Bug, User, History, Comment } from "./types";
import {
  HistoryLookupSpec,
  BugSpec,
  UserSpec,
  VersionSpec,
  CommentsSpec,
  CreatedCommentSpec,
  CreateCommentContent,
  CreatedBugSpec,
  CreateBugContent,
  UpdatedBugTemplateSpec,
  UpdateBugContent,
  UpdatedBugTemplate,
} from "./types";
import { array, object } from "./validators";

export type { Bug, User, History, Change, Flag, Comment } from "./types";

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
    let url = instance instanceof URL ? instance : new URL(instance);

    if (!user) {
      this.link = new PublicLink(url);
    } else if (password !== undefined) {
      this.link = new PasswordLink(url, user, password, restrictLogin);
    } else {
      this.link = new ApiKeyLink(url, user);
    }
  }

  public async version(): Promise<string> {
    let version = await this.link.get("version", object(VersionSpec));

    return version.version;
  }

  public whoami(): Promise<User> {
    return this.link.get("whoami", object(UserSpec));
  }

  public async bugHistory(
    bugId: number | string,
    since?: DateTime,
  ): Promise<History[]> {
    let searchParams: URLSearchParams | undefined;

    if (since) {
      searchParams = new URLSearchParams();
      searchParams.set("new_since", since.toISODate());
    }

    let bugs = await this.link.get(
      `bug/${bugId}/history`,
      object(HistoryLookupSpec),
      searchParams,
    );

    let [bug] = bugs.bugs;
    if (!bug) {
      throw new Error("Bug not found.");
    }

    return bug.history;
  }

  public searchBugs(query: SearchParams): FilteredQuery<Bug> {
    return new FilteredQuery(
      async (
        includes: string[] | undefined,
        excludes: string[] | undefined,
      ): Promise<Bug[]> => {
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
    query:
      | string
      | URL
      | Record<string, string>
      | [string, string][]
      | URLSearchParams,
  ): FilteredQuery<Bug> {
    let searchParams: URLSearchParams;

    if (query instanceof URL) {
      searchParams = query.searchParams;
    } else if (typeof query == "string" && query.startsWith("http")) {
      searchParams = new URL(query).searchParams;
    } else if (query instanceof URLSearchParams) {
      searchParams = query;
    } else {
      searchParams = new URLSearchParams(query);
    }

    searchParams.delete("list_id");

    return this.searchBugs(searchParams);
  }

  public async getComment(commentId: number): Promise<Comment | undefined> {
    let comment = await this.link.get(
      `bug/comment/${commentId}`,
      object(CommentsSpec),
    );

    if (!comment) {
      throw new Error(`Failed to get comment #${commentId}.`);
    }

    return comment.comments.get(commentId);
  }

  public async getBugComments(bugId: number): Promise<Comment[] | undefined> {
    let comments = await this.link.get(
      `bug/${bugId}/comment`,
      object(CommentsSpec),
    );

    if (!comments) {
      throw new Error(`Failed to get comments of bug #${bugId}.`);
    }

    return comments.bugs.get(bugId)?.comments;
  }

  public async createComment(
    bugId: number,
    comment: string,
    options: Partial<Omit<CreateCommentContent, "comment">> = {},
  ): Promise<number> {
    const content = {
      comment,
      is_private: options.is_private ?? false,
    };

    let commentStatus = await this.link.post(
      `bug/${bugId}/comment`,
      object(CreatedCommentSpec),
      content,
    );

    if (!commentStatus) {
      throw new Error("Failed to create comment.");
    }

    return commentStatus.id;
  }

  public async createBug(bug: CreateBugContent): Promise<number> {
    let bugStatus = await this.link.post("bug", object(CreatedBugSpec), bug);

    if (!bugStatus) {
      throw new Error("Failed to create bug.");
    }

    return bugStatus.id;
  }

  public async updateBug(
    bugIdOrAlias: number | string,
    data: UpdateBugContent,
  ): Promise<UpdatedBugTemplate> {
    let bugStatus = await this.link.put(
      `bug/${bugIdOrAlias}`,
      object(UpdatedBugTemplateSpec),
      data,
    );

    if (!bugStatus) {
      throw new Error(`Failed to update bug #${bugIdOrAlias}.`);
    }

    return bugStatus;
  }
}
