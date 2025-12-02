// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
  	container: {
  		center: true,
  		padding: '1rem',
  		screens: {
  			sm: '640px',
  			md: '768px',
  			lg: '1024px',
  			xl: '1280px',
  			'2xl': '1320px'
  		}
  	},
  	extend: {
  		colors: {
  			bg: {
  				DEFAULT: '#081827',
  				soft: '#0C2138',
  				hover: '#102944'
  			},
  			brand: {
  				'50': '#eef6ff',
  				'100': '#d9eaff',
  				'200': '#b6d4ff',
  				'300': '#8cb8ff',
  				'400': '#5f98ff',
  				'500': '#3b82f6',
  				'600': '#2f6bd4',
  				'700': '#2556ac',
  				'800': '#1e478c',
  				'900': '#1a3b73'
  			},
  			text: {
  				base: '#e8f0fb',
  				muted: '#a2b5cd'
  			},
  			outline: '#2C4566',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			xl2: '1rem',
  			xl3: '1.25rem',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			card: '0 6px 24px rgba(5, 20, 42, 0.45), inset 0 1px 0 rgba(255,255,255,0.03)',
  			glow: '0 0 0 1px rgba(74, 144, 255, 0.24), 0 8px 32px rgba(24, 84, 190, 0.35)'
  		},
  		backgroundImage: {
  			'radial-1': 'radial-gradient(800px 400px at 75% 30%, rgba(17, 109, 255, 0.22), rgba(17,109,255,0) 60%), radial-gradient(700px 380px at 25% 65%, rgba(0, 188, 255, 0.18), rgba(0,188,255,0) 55%)',
  			'radial-2': 'radial-gradient(600px 320px at 85% 40%, rgba(60, 120, 255, 0.30), rgba(60,120,255,0) 60%), radial-gradient(500px 250px at 20% 80%, rgba(0, 166, 255, 0.18), rgba(0,166,255,0) 52%)'
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'ui-sans-serif',
  				'system-ui',
  				'Segoe UI',
  				'Arial'
  			]
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
