import { URLSearchParams, URL } from "url";

import type { RequestInit, Response } from "node-fetch";
import fetch from "node-fetch";

import type { Validator } from "./validators";

export type SearchParams = Record<string, string> | [string, string][] | string | URLSearchParams;
export function params(search: SearchParams): URLSearchParams {
  if (search instanceof URLSearchParams) {
    return search;
  }

  return new URLSearchParams(search);
}

/**
 * Responsible for requesting data from the bugzilla instance handling any
 * necessary authentication and error handling that must happen. The chief
 * access is through the `get` and `post` methods.
 */
export abstract class BugzillaLink {
  protected readonly instance: URL;

  public constructor(instance: URL) {
    this.instance = new URL("/rest/", instance);
  }

  protected abstract request(url: URL, options: RequestInit): Promise<Response>;

  protected buildURL(path: string, query?: SearchParams): URL {
    let url = new URL(path, this.instance);
    if (query) {
      url.search = params(query).toString();
    }
    return url;
  }

  protected async processResponse<T>(response: Response, validator: Validator<T>): Promise<T> {
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    let body = await response.json();
    if (body.error) {
      throw new Error(body.message);
    }

    return validator(body);
  }

  public async get<T>(
    path: string,
    validator: Validator<T>,
    params?: SearchParams,
  ): Promise<T> {
    let response = await this.request(
      this.buildURL(path, params),
      {
        method: "GET",
        redirect: "follow",
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Accept: "application/json",
        },
      },
    );

    return this.processResponse(response, validator);
  }

  public async post<R, T>(
    path: string,
    validator: Validator<T>,
    content: R,
    params?: SearchParams,
  ): Promise<T> {
    let response = await this.request(
      this.buildURL(path, params),
      {
        method: "POST",
        body: JSON.stringify(content),
        redirect: "follow",
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          "Accept": "application/json",
          // eslint-disable-next-line @typescript-eslint/naming-convention
          "Content-Type": "application/json",
        },
      },
    );

    return this.processResponse(response, validator);
  }
}

/**
 * Handles authentication using an API key.
 */
export class ApiKeyLink extends BugzillaLink {
  public constructor(instance: URL, private readonly apiKey: string) {
    super(instance);
  }

  protected async request(url: URL, options: RequestInit): Promise<Response> {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers ?? {},
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "X-BUGZILLA-API-KEY": this.apiKey,
      },
    });
  }
}

/**
 * Handles authentication using a username and password.
 */
export class PasswordLink extends BugzillaLink {
  private token: string | null = "bad";

  public constructor(
    instance: URL,
    private readonly username: string,
    private readonly password: string,
    private readonly restrictLogin: boolean,
  ) {
    super(instance);
  }

  /* eslint-disable @typescript-eslint/naming-convention */
  private async login(): Promise<string> {
    let response = await fetch(
      this.buildURL("/rest/login", {
        restrict_login: String(this.restrictLogin),
      }),
      {
        method: "GET",
        redirect: "follow",
        headers: {
          "Accept": "application/json",
          "X-BUGZILLA-LOGIN": this.username,
          "X-BUGZILLA-PASSWORD": this.password,
        },
      },
    );

    if (!response.ok) {
      let body = await response.json();
      throw new Error(body.message);
    }

    throw new Error("Block");
  }
  /* eslint-enable @typescript-eslint/naming-convention */

  protected async request(url: URL, options: RequestInit): Promise<Response> {
    if (!this.token) {
      this.token = await this.login();
    }

    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers ?? {},
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "X-BUGZILLA-TOKEN": this.token,
      },
    });
    console.log(response.ok, response.status, response.statusText);
    console.log(await response.json());

    return response;
  }
}
