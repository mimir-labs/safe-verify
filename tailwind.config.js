// Copyright 2023-2024 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { heroui } = require('@heroui/react');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const defaultConfig = require('tailwindcss/defaultConfig');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.tsx', './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Sofia Sans Semi Condensed"', ...defaultConfig.theme.fontFamily.sans]
      },
      aspectRatio: {
        '1/1': '1 / 1'
      },
      screens: {
        '3xl': '1920px'
      }
    }
  },
  darkMode: 'class',
  plugins: [
    heroui({
      layout: {
        spacingUnit: 4,
        dividerWeight: 1,
        radius: {
          small: '5px',
          medium: '10px',
          large: '15px'
        },
        boxShadow: {
          small: '0px 0px 6px 0px rgba(21, 31, 52, 0.04)',
          medium: '0px 0px 10px 0px rgba(21, 31, 52, 0.06)',
          large: '0px 0px 14px 0px rgba(21, 31, 52, 0.08)'
        }
      },
      themes: {
        light: {
          extend: 'light',
          colors: {
            foreground: { DEFAULT: '#151F34' },
            divider: { DEFAULT: '#F5F3FF', 300: '#D9D9D9' },
            primary: {
              foreground: '#FFF',
              50: '#f4f0ff',
              100: '#eee8ff',
              200: '#cebfff',
              300: '#cebfff',
              400: '#866eff',
              500: '#5f45ff',
              600: '#4130d9',
              700: '#281eb3',
              800: '#15118c',
              900: '#0b0b66',
              DEFAULT: '#5F45FF'
            },
            secondary: {
              foreground: '#5F45FF',
              DEFAULT: '#F5F3FF'
            },
            success: {
              foreground: '#FFF',
              50: '#e6fff4',
              100: '#a3ffdc',
              200: '#7affd1',
              300: '#4ef5c0',
              400: '#25e8b1',
              500: '#00dba6',
              600: '#00b58e',
              700: '#008f75',
              800: '#006959',
              900: '#00423b',
              DEFAULT: '#00DBA6'
            },
            warning: {
              foreground: '#FFF',
              50: '#fff7e6',
              100: '#ffe3ab',
              200: '#ffd182',
              300: '#ffbd59',
              400: '#ffa530',
              500: '#ff8d07',
              600: '#d96c00',
              700: '#b35300',
              800: '#8c3d00',
              900: '#662900',
              DEFAULT: '#FF8D07'
            },
            danger: {
              foreground: '#FFF',
              50: '#fff1e6',
              100: '#ffd2b3',
              200: '#ffb78a',
              300: '#ff9861',
              400: '#ff7738',
              500: '#ff5310',
              600: '#d93802',
              700: '#b32700',
              800: '#8c1a00',
              900: '#660f00',
              DEFAULT: '#FF5310'
            }
          }
        }
      }
    })
  ]
};
