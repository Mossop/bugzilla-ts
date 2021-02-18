/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export type Validator<T> = (val: any) => T;

export interface EmptyFilter {
  include?: null;
  exclude?: null;
}

export interface IncludeFilter<T, I extends keyof T> {
  include: I[];
  exclude?: null;
}

export interface ExcludeFilter<T, E extends keyof T> {
  include?: null;
  exclude: E[];
}

export interface IncludeExcludeFilter<T, I extends keyof T, E extends keyof T> {
  include: I[];
  exclude: E[];
}

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

      if (!(field in val)) {
        throw new Error(`Response was missing field '${field}'`);
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
    if (!Array.isArray(val)) {
      throw new Error(`Expected an array but received '${val}'`);
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

export const bool = typedValidator<boolean>("boolean");
export const number = typedValidator<number>("number");
export const string = typedValidator<string>("string");
