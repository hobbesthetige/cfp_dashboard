
export const getEnumValues = <T>(enumObject: T): Array<T[keyof T]> => {
  return Object.values(enumObject as { [s: string]: T[keyof T] }) as Array<T[keyof T]>;
};