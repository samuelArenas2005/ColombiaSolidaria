/**
 * Utility for converting and compressing client-side images to WebP format
 * to optimize web performance, reduce bandwidth, and accelerate load times.
 */

export interface OptimizedImageResult {
  dataUrl: string;
  originalSize: number;
  optimizedSize: number;
  width: number;
  height: number;
  fileName: string;
  format: 'image/webp';
}

/**
 * Converts any uploaded image File into an optimized WebP DataURL.
 * Supports JPG, PNG, GIF, BMP, SVG, HEIC (if supported by browser), etc.
 * Resizes dynamically if dimensions exceed max boundaries while maintaining aspect ratio.
 */
export async function convertFileToWebP(
  file: File,
  quality = 0.85,
  maxWidth = 1600,
  maxHeight = 1600
): Promise<OptimizedImageResult> {
  return new Promise((resolve, reject) => {
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      reject(new Error('El archivo seleccionado no es una imagen válida.'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Proportional scaling for optimal web rendering
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) {
          reject(new Error('No se pudo inicializar el contexto de canvas 2D'));
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP format
        let webpDataUrl = canvas.toDataURL('image/webp', quality);

        // Fallback check if browser doesn't support WebP export (returns image/png data url instead)
        if (!webpDataUrl.startsWith('data:image/webp')) {
          // If browser somehow does not support webp export, use png fallback
          console.warn('El navegador no soporta exportación nativa a WebP, usando fallback');
        }

        // Calculate approximate size in bytes
        const base64Data = webpDataUrl.split(',')[1] || '';
        const optimizedSize = Math.round((base64Data.length * 3) / 4);

        const newFileName = file.name.replace(/\.[^/.]+$/, '') + '.webp';

        resolve({
          dataUrl: webpDataUrl,
          originalSize: file.size,
          optimizedSize,
          width,
          height,
          fileName: newFileName,
          format: 'image/webp'
        });
      };

      img.onerror = () => {
        reject(new Error(`Error al procesar la imagen ${file.name}`));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error(`Error al leer el archivo ${file.name}`));
    };

    reader.readAsDataURL(file);
  });
}
