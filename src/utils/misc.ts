import { clsx, type ClassValue } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function copyText(
  text: string,
  successText = 'Teks disalin',
  errorText = 'Gagal menyalin'
) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successText);
    return true;
  } catch {
    toast.error(errorText);
    return false;
  }
}
