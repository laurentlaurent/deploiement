import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  
  // Corrigé pour utiliser la nouvelle syntaxe
  experimental: {
    // Supprime les options incorrectes
  },
  
  // Ajout de l'option avec la syntaxe correcte
  serverExternalPackages: ['axios']
};

export default nextConfig;
