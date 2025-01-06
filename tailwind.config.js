import {data} from "autoprefixer";

const colors = require('tailwindcss/colors')

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],

  darkMode: 'class',

  theme: {
    extend: {

      colors: {

        primary_back: {
          light: '#FCFCFC',
          dark: '#191919'
        },

        primary_text: {
          light: '#000000',
          dark: '#FFFFFF'
        },

        secondary_text: {
          light: '#474747',
          dark: '#E9E9E9'
        },

        secondary_back: {
          light: '#DDDDDD',
          dark: '#2D2D2D'
        },

        input_back: {
          light: '#FAFAFA',
          dark: '#474747'
        },

        btn_text: {
          light: '#343434',
          dark: '#E9E9E9'
        },

        btn_back: {
          primary: '#FF6C2D',
          primary_hover: '#FF5B2D',
          secondary: '#666666',
          secondary_hover: '#777777'
        },

        link: {
          light: '#444444',
          dark: '#C0C0C0'
        },

        gray: {
          a9: '#A9A9A9'
        },

      },
    },
  },
  plugins: [],
}

