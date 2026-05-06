import type { Option } from '@/utils/option';

export type Generation = '2026' | '2027' | '2028' | '2029';

export const Generation: Record<Generation, Option<Generation>> = {
  '2026': { value: '2026', label: '2026' },
  '2027': { value: '2027', label: '2027' },
  '2028': { value: '2028', label: '2028' },
  '2029': { value: '2029', label: '2029' },
};

export const GenerationOpts = Object.values(Generation);
