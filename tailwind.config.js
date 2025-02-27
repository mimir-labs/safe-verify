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
              50: '#F5F3FF',
              100: '#EEE8FF',
              200: '#CEBFFF',
              300: '#AB96FF',
              400: '#866EFF',
              500: '#5F45FF',
              600: '#4130D9',
              700: '#281EB3',
              800: '#15118C',
              900: '#0B0B66',
              foreground: '#FFF',
              DEFAULT: '#5F45FF'
            },
            secondary: {
              foreground: '#5F45FF',
              DEFAULT: '#F5F3FF'
            },
            success: {
              foreground: '#FFF',
              DEFAULT: '#00DBA6'
            },
            warning: {
              foreground: '#FFF',
              DEFAULT: '#FF8D07'
            },
            danger: {
              foreground: '#FFF',
              DEFAULT: '#E82F5E'
            }
          }
        }
      }
    })
  ]
};
