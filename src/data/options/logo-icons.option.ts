import type { Option } from '@/utils/option';

export type LogoIcon =
  | 'html'
  | 'css'
  | 'javascript'
  | 'tailwindcss'
  | 'react'
  | 'solidity';

export const LogoIcon: Record<LogoIcon, Option<LogoIcon, { logo: string }>> = {
  html: {
    value: 'html',
    label: 'html',
    meta: {
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
    },
  },
  css: {
    value: 'css',
    label: 'css',
    meta: {
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg',
    },
  },
  javascript: {
    value: 'javascript',
    label: 'javascript',
    meta: {
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
    },
  },
  tailwindcss: {
    value: 'tailwindcss',
    label: 'tailwindcss',
    meta: {
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
    },
  },
  react: {
    value: 'react',
    label: 'react',
    meta: {
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
    },
  },
  solidity: {
    value: 'solidity',
    label: 'solidity',
    meta: {
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/solidity/solidity-original.svg',
    },
  },
};

export const LogoIconOpts = Object.values(LogoIcon);
