// ======================================================
// Rust-style Result<T, E> implementation for TypeScript
// No throws
// All failures are represented as Err<E>
// ======================================================

import { ErrorCodes } from './Errors';

// --------------------------------------
// Variant Tags
// --------------------------------------

export const enum ResultKind {
  Ok,
  Err, // Fixed: renamed from 'Error' to 'Err' to match usage and removed invalid syntax
}

// --------------------------------------
// Variant Types
// --------------------------------------

export interface Ok<T> {
  readonly kind: ResultKind.Ok;
  readonly value: T;
}

// Updated: E now defaults to ErrorCodes from Errors.ts
export interface Err<E = ErrorCodes> {
  readonly kind: ResultKind.Err;
  readonly error: E;
}

// Updated: E now defaults to ErrorCodes from Errors.ts
export type Result<T, E = ErrorCodes> = Ok<T> | Err<E>;

// --------------------------------------
// Constructors
// --------------------------------------

export function Ok<T>(value: T): Ok<T> {
  return {
    kind: ResultKind.Ok,
    value,
  };
}

export function Err<E = ErrorCodes>(error: E): Err<E> {
  return {
    kind: ResultKind.Err,
    error
  };
}

// --------------------------------------
// Type Guards
// --------------------------------------

export function isOk<T, E>(
  result: Result<T, E>,
): result is Ok<T> {
  return result.kind === ResultKind.Ok;
}

export function isErr<T, E>(
  result: Result<T, E>,
): result is Err<E> {
  return result.kind === ResultKind.Err;
}

// --------------------------------------
// Extractors
// --------------------------------------

export function unwrapOr<T, E>(
  result: Result<T, E>,
  fallback: T,
): T {
  return isOk(result)
    ? result.value
    : fallback;
}

export function unwrapOrElse<T, E>(
  result: Result<T, E>,
  fn: (error: E) => T,
): T {
  return isOk(result)
    ? result.value
    : fn(result.error);
}

export function unwrap<T, E>(
  result: Result<T, E>,
): T | E {
  return isOk(result)
    ? result.value
    : result.error;
}

export function unwrapErrOr<T, E>(
  result: Result<T, E>,
  fallback: E,
): E {
  return isErr(result)
    ? result.error
    : fallback;
}

// --------------------------------------
// Transformations
// --------------------------------------

export function map<T, E, U>(
  result: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E> {
  return isOk(result)
    ? Ok(fn(result.value))
    : result as any as Result<U, E>;
}

export function mapErr<T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F
): Result<T, F> {
  return isErr(result)
    ? Err(fn(result.error))
    : result as any as Result<T, F>;
}

export function andThen<T, E, U>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> {
  return isOk(result)
    ? fn(result.value)
    : result as any as Result<U, E>;
}

export function orElse<T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => Result<T, F>,
): Result<T, F> {
  return isErr(result)
    ? fn(result.error)
    : result as any as Result<T, F>;
}

// --------------------------------------
// Utilities
// --------------------------------------

export function match<T, E, U>(
  result: Result<T, E>,
  branches: {
    ok: (value: T) => U;
    err: (error: E) => U;
  },
): U {
  return isOk(result)
    ? branches.ok(result.value)
    : branches.err(result.error);
}

export function contains<T, E>(
  result: Result<T, E>,
  value: T,
): boolean {
  return isOk(result)
    ? Object.is(result.value, value)
    : false;
}

export function containsErr<T, E>(
  result: Result<T, E>,
  error: E,
): boolean {
  return isErr(result)
    ? Object.is(result.error, error)
    : false;
}

// --------------------------------------
// Promise Helpers
// --------------------------------------

export async function fromPromise<T, E = ErrorCodes>(
  promise: Promise<T>,
  mapError: (error: unknown) => E
): Promise<Result<T, E>> {
  try {
    return Ok(await promise);
  } catch (error) {
    return Err(mapError(error));
  }
}

// --------------------------------------
// Example Usage
// --------------------------------------

// Function using the centralized ErrorCodes
// function findUser(id: number): Result<{ name: string }, ErrorCodes> {
//   if (id === 0) {
//     return Err(ErrorCodes.DbKeyNotFound);
//   }
//   return Ok({ name: "John Doe" });
// }

// const res = findUser(0);

// if (isErr(res)) {
//     console.log(`Failed with code: ${res.error}`); // Output: Failed with code: 2 (DbKeyNotFound)
// }