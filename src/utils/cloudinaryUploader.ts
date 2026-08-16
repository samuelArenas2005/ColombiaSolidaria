/**
 * Cloudinary image uploader utility
 */

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
  const env = (import.meta as any).env || {};
  const cloudName = env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !cloudName.trim() || !uploadPreset || !uploadPreset.trim()) {
    throw new Error('Cloudinary no está configurado. Por favor define VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_UPLOAD_PRESET en las variables de entorno.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'jamundi_solidario');

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Error al subir imagen a Cloudinary (Status ${response.status})`);
  }

  const data = await response.json();
  return data.secure_url || data.url;
}

