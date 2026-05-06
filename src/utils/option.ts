export interface Option<V = string, M = Record<string, any>> {
  value: V;
  label: string;
  meta?: M;
}

export const getOption = <T extends Record<string, any>>(
  obj: T,
  key?: keyof T | null
) => {
  return key ? obj[key] : undefined;
};

export const toOptions = (obj: Record<string, string>): Option[] => {
  return Object.entries(obj).map(([k, v]) => ({
    label: v,
    value: k,
  }));
};
