/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { DateTime } from "luxon";

export type Validator<T> = (val: any) => T;

type ObjectValidator<T> = {
  [K in keyof T]: Validator<T[K]>;
};

export function object<T>(
  validator: ObjectValidator<T>,
  includes: string[] = Object.keys(validator),
  excludes: string[] = [],
): Validator<T> {
  return (val: any): T => {
    if (!val || typeof val != "object") {
      throw new Error(`Expected an object but received '${val}'`);
    }

    let result: any = {};

    for (let field of includes) {
      if (excludes.includes(field)) {
        continue;
      }

      if (!(field in validator)) {
        continue;
      }

      let fieldValidator: Validator<any> = validator[field];
      try {
        result[field] = fieldValidator(val[field]);
      } catch (e) {
        throw new Error(`Error validating field '${field}': ${e.message}`);
      }
    }

    return result;
  };
}

export function array<T>(validator: Validator<T>): Validator<T[]> {
  return (val: any): T[] => {
    // Empty arrays are returned as null.
    if (val === null) {
      return [];
    }

    if (!Array.isArray(val)) {
      return [validator(val)];
    }

    try {
      return val.map(validator);
    } catch (e) {
      throw new Error(`Error validating array: ${e.message}`);
    }
  };
}

function typedValidator<T>(type: string): Validator<T> {
  return (val: any): T => {
    if (val === null || typeof val != type) {
      throw new Error(`Expected a ${type} but received '${val}'`);
    }

    return val;
  };
}

export function datetime(val: any): DateTime {
  if (typeof val != "string") {
    throw new Error(`Expected a string but received '${val}'`);
  }

  return DateTime.fromISO(val);
}

export const boolean = typedValidator<boolean>("boolean");
export const int = typedValidator<number>("number");
export const double = typedValidator<number>("number");
export const string = typedValidator<string>("string");

export function nullable<T>(validator: Validator<T>): Validator<T | null>;
export function nullable<T>(validator: Validator<T>, result: T): Validator<T>;
export function nullable<T>(
  validator: Validator<T>,
  result?: T,
): Validator<T | null> {
  return (val: any): T | null => {
    if (val === null) {
      return result ?? null;
    }

    return validator(val);
  };
}

export function optional<T>(validator: Validator<T>): Validator<T | undefined>;
export function optional<T>(validator: Validator<T>, result: T): Validator<T>;
export function optional<T>(
  validator: Validator<T>,
  result?: T,
): Validator<T | undefined> {
  return (val: any): T | undefined => {
    if (val === undefined) {
      return result;
    }

    return validator(val);
  };
}
