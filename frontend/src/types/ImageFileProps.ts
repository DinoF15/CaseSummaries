/**
 * Represents an image file with its filename and base64 encoded data.
 * 
 * @interface ImageFileProps
 * @property {string} filename - The name of the image file.
 * @property {string} base64Data - The base64 encoded data of the image file.
 */
export interface ImageFileProps {
    filename: string;
    base64Data: string;
  }