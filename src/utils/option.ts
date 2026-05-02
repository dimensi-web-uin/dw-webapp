export interface Option<V = string, M = Record<string, any>> {
  value: V;
  label: string;
  meta?: M;
}

export const getOption = <T extends Option>(
  list: T[],
  value?: string | null
): T | null => {
  return list.find((o) => o.value == (value ?? '')) ?? null;
};

export const toOptions = (obj: Record<string, string>): Option[] => {
  return Object.entries(obj).map(([k, v]) => ({
    label: v,
    value: k,
  }));
};
