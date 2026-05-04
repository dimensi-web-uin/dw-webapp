export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const romanMap: Array<[number, string]> = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

export const numberToRoman = (value: number): string => {
  if (!Number.isFinite(value) || value <= 0 || value >= 4000) return '';

  let num = Math.floor(value),
    result = '';

  for (const [unit, numeral] of romanMap)
    while (num >= unit) {
      result += numeral;
      num -= unit;
    }

  return result;
};

export const KB = 1024;

export const MB = 1024 * KB;

export const GB = 1024 * MB;

export function formatBytes(bytes: number = 2, decimals = 2): string {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);

  return `${value.toFixed(decimals)} ${units[i]}`;
}
