export const getInitial = (str?: string, limit = 2) => {
  return str
    ? str
        .split(' ')
        .filter(Boolean)
        .map((word) => word[0])
        .join('')
        .slice(0, limit)
        .toUpperCase()
    : '-';
};

export const toSlug = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const isURL = (str: string): boolean => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

export const isUUID = (value: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

export const getRandomString = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const formatMoney = (
  number?: number | null | string,
  { locale = 'id-ID', currency = 'IDR', shorten = false } = {}
) => {
  if (!number) return 'Rp 0';
  try {
    number = +number;
  } catch {
    return 'Rp 0';
  }

  let formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(number);

  if (formatted.includes(',')) formatted = formatted.replace(/,00$/, '');

  if (shorten) formatted = 'Rp ' + shortenNumber(number);

  return formatted;
};

export const shortenNumber = (
  number: number,
  { fixed = 2 }: { fixed?: number } = {}
) => {
  let formatted = number.toString();

  // Triliun
  if (number >= 1_000_000_000_000)
    formatted = `${(number / 1_000_000_000_000).toFixed(fixed).replace(/\.0+$/, '')}T`;
  // Miliar
  else if (number >= 1_000_000_000)
    formatted = `${(number / 1_000_000_000).toFixed(fixed).replace(/\.0+$/, '')}M`;
  // Juta
  else if (number >= 1_000_000)
    formatted = `${(number / 1_000_000).toFixed(fixed).replace(/\.0+$/, '')}jt`;
  // Ribu
  else if (number >= 1_000) formatted = `${(number / 1_000).toFixed(fixed)}rb`;

  return formatted;
};

export const greet = (name?: string): string => {
  const now = new Date();
  const hour = now.getHours();

  let greeting: string;

  if (hour >= 5 && hour < 12) greeting = 'Good morning';
  else if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17 && hour < 21) greeting = 'Good evening';
  else greeting = 'Good night';

  return name ? `${greeting}, ${name}!` : `${greeting}!`;
};

export const numberToWords = (number: string): string => {
  const units: string[] = [
    'nol',
    'satu',
    'dua',
    'tiga',
    'empat',
    'lima',
    'enam',
    'tujuh',
    'delapan',
    'sembilan',
  ];
  const str: string = number.toString();
  let word: string = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '.') {
      word += 'koma ';
    } else {
      word += units[parseInt(str[i])] + ' ';
    }
  }
  return word.trim();
};

export const getRandomColor = () =>
  `hsl(${Math.floor(Math.random() * 360)}, 70%, 55%)`;
