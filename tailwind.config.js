/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',  // Azul clínico
          light: '#3B82F6',    // Azul más brillante
          dark: '#1D4ED8',     // Azul más profundo
        },
        secondary: {
          DEFAULT: '#06B6D4',  // Cian profesional
          light: '#22D3EE',
          dark: '#0891B2',
        },
        gray: {
          light: '#F5F7FA',   // Muy claro, fondo en modo claro
          medium: '#7B8794',  // Texto intermedio
          dark: '#1F2937',    // Fondo base en modo oscuro (gris azulado oscuro)
          softer: '#374151',  // Para zonas hover o separadores
        },
        surface: {
          light: '#EDF2F7',     // Fondo claro para cajas en modo claro
          dark: '#2D3748',      // Fondo de tarjetas y cajas en modo oscuro
        }
      },
      backgroundImage: {
        'gradient-healthyme': 'linear-gradient(to right, #00AFA5, #2E7CF6, #4A90F7)',
      },
    },
  },
  plugins: [],
};
