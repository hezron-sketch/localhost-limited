import { storagePut } from "./storage";
import { nanoid } from "nanoid";

export async function uploadImage(file: Buffer, filename: string, contentType: string): Promise<string> {
  try {
    // Generate unique key to prevent enumeration
    const fileExt = filename.split(".").pop() || "png";
    const uniqueKey = `uploads/${nanoid()}-${Date.now()}.${fileExt}`;

    const { url } = await storagePut(uniqueKey, file, contentType);
    return url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image to storage");
  }
}
