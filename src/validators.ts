import { DateTime } from "luxon";

export type Validator<T> = (val: any) => T;

export type ObjectSpec<T> = Record<string, Validator<any>> & {
  [K in keyof T]: Validator<T[K]>;
};

function repr(val: any): string {
  return `\`${JSON.stringify(val)}\``;
}

export function object<T>(
  validator: ObjectSpec<T>,
  includes: string[] = Object.keys(validator),
  excludes: string[] = [],
): Validator<T> {
  return (val: any): T => {
    if (!val || typeof val != "object") {
      throw new Error(`Expected an object but received ${repr(val)}`);
    }

    let result: any = {};

    for (let field of includes) {
      if (excludes.includes(field)) {
        continue;
      }

      let fieldValidator = validator[field];

      if (!fieldValidator) {
        continue;
      }

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
    if (!Array.isArray(val)) {
      throw new Error(`Expected an array but received ${repr(val)}`);
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
      throw new Error(`Expected a ${type} but received ${repr(val)}`);
    }

    return val;
  };
}

export function datetime(val: any): DateTime {
  if (typeof val != "string") {
    throw new Error(`Expected an ISO-8601 string but received ${repr(val)}`);
  }

  let dt = DateTime.fromISO(val);
  if (!dt.isValid) {
    throw new Error(`Expected an ISO-8601 string but received ${repr(val)}`);
  }

  return dt;
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

export function maybeArray<T>(validator: Validator<T>): Validator<T | T[]> {
  return (val: any): T | T[] => {
    if (Array.isArray(val)) {
      try {
        return val.map(validator);
      } catch (e) {
        throw new Error(`Error validating array: ${e.message}`);
      }
    }

    return validator(val);
  };
}
