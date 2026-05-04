import { FileTextIcon, ImageIcon, type LucideIcon } from 'lucide-react';
import type { Option } from './option';
import { formatBytes } from './number';

export type FileType =
  | 'image/png'
  | 'image/jpeg'
  | 'image/jpg'
  | 'application/pdf';

export const FileExtension: Record<FileType, string> = {
  'image/jpeg': '.jpeg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'application/pdf': '.pdf',
};

export const FileType: Record<
  FileType,
  Option<FileType, { icon: LucideIcon }>
> = {
  'image/png': { value: 'image/png', label: 'PNG', meta: { icon: ImageIcon } },
  'image/jpeg': {
    value: 'image/jpeg',
    label: 'JPEG',
    meta: { icon: ImageIcon },
  },
  'image/jpg': { value: 'image/jpg', label: 'JPG', meta: { icon: ImageIcon } },
  'application/pdf': {
    value: 'application/pdf',
    label: 'PDF',
    meta: { icon: FileTextIcon },
  },
} as const;

export const isValidFileType = (file: File, types: FileType[]) => {
  return (types as string[]).includes(file.type);
};

export const notValidFileTypeMessage = (types: FileType[]) =>
  `Jenis file tidak valid. Hanya ${types.map((typ) => FileType[typ].label ?? '').join(', ')} yang diizinkan.`;

export const isUnderFileSize = (file: File, bytes: number) => {
  return file.size <= bytes;
};

export const notUnderFileSizeMessage = (bytes: number) =>
  `Ukuran file terlalu besar. Maksimum adalah ${formatBytes(bytes)}.`;

export const yupFileTypes = (
  types: FileType[]
): [string, string, (file?: File | null | '') => boolean] => {
  return [
    'fileTypes',
    notValidFileTypeMessage(types),
    (file) => (file ? isValidFileType(file, types) : true),
  ];
};

export const yupFileSizeUnder = (
  bytes: number
): [string, string, (file?: File | null | '') => boolean] => {
  return [
    'maxFileSize',
    notUnderFileSizeMessage(bytes),
    (file) => (file ? isUnderFileSize(file, bytes) : true),
  ];
};
