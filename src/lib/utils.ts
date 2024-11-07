import { APP_ENVS } from "@/config/envs";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import imageCompression from "browser-image-compression";

/**
 * Compresse une liste de fichiers avec une qualité de 90%.
 * @param files - La liste des fichiers à compresser
 * @returns Promise<File[]> - La liste des fichiers compressés
 */
async function compressFiles(files: File[]): Promise<File[]> {
  const compressedFiles: File[] = [];

  // Paramètres de compression
  const options = {
    maxSizeMB: 1, // Limite la taille maximale à 1MB, ajustez selon besoin
    maxWidthOrHeight: 1024, // Taille maximale pour la largeur ou la hauteur
    useWebWorker: true, // Utilise les Web Workers pour des performances optimales
    initialQuality: 0.9, // Qualité à 90%
  };

  // Itère sur chaque fichier pour le compresser
  for (const file of files) {
    try {
      const compressedFile = await imageCompression(file, options);
      compressedFiles.push(compressedFile);
    } catch (error) {
      console.error(
        `Erreur lors de la compression du fichier ${file.name}:`,
        error
      );
    }
  }

  return compressedFiles;
}

export { compressFiles };
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// utils/formatPrice.js
export function formatPrice(value: number, locale = "bf-BF", currency = "CFA") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export const getdefaultValue = (value: any) => {
  return APP_ENVS.isProductionMode ? "" : value;
};

export function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
