import { fromPath } from "pdf2pic";
import sharp from "sharp";
import libre from "libreoffice-convert";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { supabase } from "../lib/supabase";

const libreConvert = promisify(libre.convert);

export interface ConversionResult {
  pages: Array<{
    pageNumber: number;
    imageUrl: string;
    width: number;
    height: number;
  }>;
  pageCount: number;
}

/**
 * Downloads a file from Supabase storage to a temporary location
 */
async function downloadFile(url: string): Promise<string> {
  try {
    // Extract bucket and path from Supabase URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const bucket = pathParts[pathParts.indexOf("object") + 2];
    const filePath = pathParts.slice(pathParts.indexOf("object") + 3).join("/");

    const { data, error } = await supabase.storage.from(bucket).download(filePath);

    if (error) throw error;
    if (!data) throw new Error("No data returned from download");

    // Write to temp file
    const tempPath = path.join(os.tmpdir(), `download-${Date.now()}-${path.basename(filePath)}`);
    const buffer = Buffer.from(await data.arrayBuffer());
    await fs.writeFile(tempPath, buffer);

    return tempPath;
  } catch (error) {
    console.error("[converter] Download failed:", error);
    throw new Error(`Failed to download file: ${error}`);
  }
}

/**
 * Uploads an image buffer to Supabase storage
 */
async function uploadImage(
  buffer: Buffer,
  submissionId: string,
  pageNumber: number
): Promise<string> {
  const fileName = `${submissionId}/page-${pageNumber}.png`;
  const { error } = await supabase.storage.from("converted-images").upload(fileName, buffer, {
    contentType: "image/png",
    upsert: true,
  });

  if (error) throw error;

  // Get public URL
  const { data: urlData } = supabase.storage
    .from("converted-images")
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

/**
 * Convert PDF to images using pdf2pic and sharp
 */
async function convertPdfToImages(
  pdfPath: string,
  submissionId: string
): Promise<ConversionResult> {
  console.log("[converter] Converting PDF:", pdfPath);

  const converter = fromPath(pdfPath, {
    density: 200, // DPI for quality
    saveFilename: "page",
    savePath: os.tmpdir(),
    format: "png",
    width: 1200,
    height: 1600,
  });

  const pages: ConversionResult["pages"] = [];
  let pageNumber = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const result = await converter(pageNumber);

      if (!result || !result.path) {
        hasMore = false;
        break;
      }

      // Read and optimize the image
      const imageBuffer = await fs.readFile(result.path);
      const optimizedBuffer = await sharp(imageBuffer)
        .resize(1200, 1600, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .png({ quality: 90, compressionLevel: 9 })
        .toBuffer();

      // Get metadata
      const metadata = await sharp(optimizedBuffer).metadata();

      // Upload to Supabase
      const imageUrl = await uploadImage(optimizedBuffer, submissionId, pageNumber);

      pages.push({
        pageNumber,
        imageUrl,
        width: metadata.width || 1200,
        height: metadata.height || 1600,
      });

      // Clean up temp file
      await fs.unlink(result.path).catch(() => {});

      pageNumber++;
    } catch (error) {
      if (pageNumber === 1) {
        // If first page fails, it's a real error
        throw error;
      }
      // Otherwise, we've reached the end
      hasMore = false;
    }
  }

  if (pages.length === 0) {
    throw new Error("No pages extracted from PDF");
  }

  console.log(`[converter] Converted ${pages.length} pages from PDF`);

  return {
    pages,
    pageCount: pages.length,
  };
}

/**
 * Convert DOCX to PDF, then to images
 */
async function convertDocxToImages(
  docxPath: string,
  submissionId: string
): Promise<ConversionResult> {
  console.log("[converter] Converting DOCX:", docxPath);

  // Read DOCX file
  const docxBuffer = await fs.readFile(docxPath);

  // Convert to PDF using LibreOffice
  const pdfBuffer = (await libreConvert(docxBuffer, ".pdf", undefined)) as Buffer;

  // Write PDF to temp file
  const pdfPath = path.join(os.tmpdir(), `temp-${Date.now()}.pdf`);
  await fs.writeFile(pdfPath, pdfBuffer);

  try {
    // Convert PDF to images
    const result = await convertPdfToImages(pdfPath, submissionId);
    return result;
  } finally {
    // Clean up temp PDF
    await fs.unlink(pdfPath).catch(() => {});
  }
}

/**
 * Convert image files (JPG, PNG, WebP) to optimized PNG
 */
async function convertImageToOptimized(
  imagePath: string,
  submissionId: string,
  mimeType: string
): Promise<ConversionResult> {
  console.log("[converter] Converting image:", imagePath, mimeType);

  // Read and optimize the image
  const imageBuffer = await fs.readFile(imagePath);
  const optimizedBuffer = await sharp(imageBuffer)
    .resize(1200, 1600, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .png({ quality: 90, compressionLevel: 9 })
    .toBuffer();

  // Get metadata
  const metadata = await sharp(optimizedBuffer).metadata();

  // Upload to Supabase
  const imageUrl = await uploadImage(optimizedBuffer, submissionId, 1);

  return {
    pages: [
      {
        pageNumber: 1,
        imageUrl,
        width: metadata.width || 1200,
        height: metadata.height || 1600,
      },
    ],
    pageCount: 1,
  };
}

/**
 * Main conversion function that handles all document types
 */
export async function convertDocument(
  fileUrl: string,
  mimeType: string,
  submissionId: string
): Promise<ConversionResult> {
  console.log(`[converter] Starting conversion for ${submissionId}, type: ${mimeType}`);

  // Download file from Supabase
  const localPath = await downloadFile(fileUrl);

  try {
    let result: ConversionResult;

    if (mimeType === "application/pdf") {
      result = await convertPdfToImages(localPath, submissionId);
    } else if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword"
    ) {
      result = await convertDocxToImages(localPath, submissionId);
    } else if (
      mimeType === "image/jpeg" ||
      mimeType === "image/png" ||
      mimeType === "image/webp"
    ) {
      result = await convertImageToOptimized(localPath, submissionId, mimeType);
    } else {
      throw new Error(`Unsupported file type: ${mimeType}`);
    }

    console.log(`[converter] Conversion complete: ${result.pageCount} pages`);
    return result;
  } finally {
    // Clean up downloaded file
    await fs.unlink(localPath).catch(() => {});
  }
}
