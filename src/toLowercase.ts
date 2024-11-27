export function toLowercase<T extends string>(str: T) {
  return str.toLowerCase() as Lowercase<T>;
}
