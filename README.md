# CleaningLineGP

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

# 1. Instalación del Backend
cd App/api
npm install

# 2. Instalación del Frontend
cd ../web
npm install

# Configuración de Variables de Entorno
# Crea los archivos .env necesarios. Recuerda completar las credenciales (Base de datos Neon, JWT, Webpay, etc.) según corresponda:

# En App/api/.env: Configura DATABASE_URL (Neon Cloud), PORT, JWT_SECRET, entre otros.

# En web/.env.local: Configura NEXT_PUBLIC_API_URL apuntando a la URL pública de tu API (ej: http://localhost:3002/api).


# 3.Ejecución del Proyecto
# Levantar servicios de soporte
docker-compose up -d

# Iniciar Backend (API)
cd App/api
npm run start:dev

# Iniciar Frontend (Web)
cd web
npm run dev


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
