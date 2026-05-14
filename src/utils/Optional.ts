// ======================================================
// Rust-style Option<T> implementation for TypeScript
// Without string discriminators
// Uses unique enum-like symbols for runtime safety
// ======================================================

// --------------------------------------
// Variant Tags
// --------------------------------------

export const enum OptionKind {
  Some,
  None,
}

// --------------------------------------
// Base Types
// --------------------------------------

export interface Some<T> {
  readonly kind: OptionKind.Some;
  readonly value: T;
}

export interface None {
  readonly kind: OptionKind.None;
}

export type Option<T> = Some<T> | None;

// --------------------------------------
// Constructors
// --------------------------------------

export function Some<T>(value: T): Some<T> {
  return {
    kind: OptionKind.Some,
    value,
  };
}

export const None: None = {
  kind: OptionKind.None,
};

// --------------------------------------
// Type Guards
// --------------------------------------

export function isSome<T>(option: Option<T>): option is Some<T> {
  return option.kind === OptionKind.Some;
}

export function isNone<T>(option: Option<T>): option is None {
  return option.kind === OptionKind.None;
}

// --------------------------------------
// Core Methods
// --------------------------------------

export function unwrap<T>(option: Option<T>): T {
  if (isSome(option)) {
    return option.value;
  }

  throw new Error('Called unwrap on None');
}

export function unwrapOr<T>(
  option: Option<T>,
  fallback: T,
): T {
  return isSome(option)
    ? option.value
    : fallback;
}

export function unwrapOrElse<T>(
  option: Option<T>,
  fallback: () => T,
): T {
  return isSome(option)
    ? option.value
    : fallback();
}

export function expect<T>(
  option: Option<T>,
  message: string,
): T {
  if (isSome(option)) {
    return option.value;
  }

  throw new Error(message);
}

// --------------------------------------
// Transformations
// --------------------------------------

export function map<T, U>(
  option: Option<T>,
  fn: (value: T) => U,
): Option<U> {
  return isSome(option)
    ? Some(fn(option.value))
    : None;
}

export function mapOr<T, U>(
  option: Option<T>,
  fallback: U,
  fn: (value: T) => U,
): U {
  return isSome(option)
    ? fn(option.value)
    : fallback;
}

export function andThen<T, U>(
  option: Option<T>,
  fn: (value: T) => Option<U>,
): Option<U> {
  return isSome(option)
    ? fn(option.value)
    : None;
}

export function filter<T>(
  option: Option<T>,
  predicate: (value: T) => boolean,
): Option<T> {
  if (isSome(option) && predicate(option.value)) {
    return option;
  }

  return None;
}

// --------------------------------------
// Utilities
// --------------------------------------

export function contains<T>(
  option: Option<T>,
  value: T,
): boolean {
  return isSome(option)
    ? Object.is(option.value, value)
    : false;
}

export function flatten<T>(
  option: Option<Option<T>>,
): Option<T> {
  return isSome(option)
    ? option.value
    : None;
}

export function match<T, U>(
  option: Option<T>,
  branches: {
    some: (value: T) => U;
    none: () => U;
  },
): U {
  return isSome(option)
    ? branches.some(option.value)
    : branches.none();
}

// --------------------------------------
// Nullable Interop
// --------------------------------------

export function fromNullable<T>(
  value: T | null | undefined,
): Option<T> {
  return value == null
    ? None
    : Some(value);
}

export function toNullable<T>(
  option: Option<T>,
): T | null {
  return isSome(option)
    ? option.value
    : null;
}

// --------------------------------------
// Example Usage
// --------------------------------------

const a = Some(42);
const b = None;

console.log(isSome(a)); // true
console.log(isNone(b)); // true

console.log(unwrap(a)); // 42

console.log(
  unwrapOr(b, 100),
); // 100

const doubled = map(a, x => x * 2);

console.log(
  unwrap(doubled),
); // 84

const result = match(a, {
  some: v => `Value = ${v}`,
  none: () => 'No value',
});

console.log(result);