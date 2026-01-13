"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDocument = convertDocument;
const pdf2pic_1 = require("pdf2pic");
const sharp_1 = __importDefault(require("sharp"));
const libreoffice_convert_1 = __importDefault(require("libreoffice-convert"));
const util_1 = require("util");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const supabase_1 = require("../lib/supabase");
const libreConvert = (0, util_1.promisify)(libreoffice_convert_1.default.convert);
/**
 * Downloads a file from Supabase storage to a temporary location
 */
async function downloadFile(url) {
    try {
        // Extract bucket and path from Supabase URL
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split("/");
        const bucket = pathParts[pathParts.indexOf("object") + 2];
        const filePath = pathParts.slice(pathParts.indexOf("object") + 3).join("/");
        const { data, error } = await supabase_1.supabase.storage.from(bucket).download(filePath);
        if (error)
            throw error;
        if (!data)
            throw new Error("No data returned from download");
        // Write to temp file
        const tempPath = path_1.default.join(os_1.default.tmpdir(), `download-${Date.now()}-${path_1.default.basename(filePath)}`);
        const buffer = Buffer.from(await data.arrayBuffer());
        await promises_1.default.writeFile(tempPath, buffer);
        return tempPath;
    }
    catch (error) {
        console.error("[converter] Download failed:", error);
        throw new Error(`Failed to download file: ${error}`);
    }
}
/**
 * Uploads an image buffer to Supabase storage
 */
async function uploadImage(buffer, submissionId, pageNumber) {
    const fileName = `${submissionId}/page-${pageNumber}.png`;
    const { error } = await supabase_1.supabase.storage.from("converted-images").upload(fileName, buffer, {
        contentType: "image/png",
        upsert: true,
    });
    if (error)
        throw error;
    // Get public URL
    const { data: urlData } = supabase_1.supabase.storage
        .from("converted-images")
        .getPublicUrl(fileName);
    return urlData.publicUrl;
}
/**
 * Convert PDF to images using pdf2pic and sharp
 */
async function convertPdfToImages(pdfPath, submissionId) {
    console.log("[converter] Converting PDF:", pdfPath);
    const converter = (0, pdf2pic_1.fromPath)(pdfPath, {
        density: 200, // DPI for quality
        saveFilename: "page",
        savePath: os_1.default.tmpdir(),
        format: "png",
        width: 1200,
        height: 1600,
    });
    const pages = [];
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
            const imageBuffer = await promises_1.default.readFile(result.path);
            const optimizedBuffer = await (0, sharp_1.default)(imageBuffer)
                .resize(1200, 1600, {
                fit: "inside",
                withoutEnlargement: true,
            })
                .png({ quality: 90, compressionLevel: 9 })
                .toBuffer();
            // Get metadata
            const metadata = await (0, sharp_1.default)(optimizedBuffer).metadata();
            // Upload to Supabase
            const imageUrl = await uploadImage(optimizedBuffer, submissionId, pageNumber);
            pages.push({
                pageNumber,
                imageUrl,
                width: metadata.width || 1200,
                height: metadata.height || 1600,
            });
            // Clean up temp file
            await promises_1.default.unlink(result.path).catch(() => { });
            pageNumber++;
        }
        catch (error) {
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
async function convertDocxToImages(docxPath, submissionId) {
    console.log("[converter] Converting DOCX:", docxPath);
    // Read DOCX file
    const docxBuffer = await promises_1.default.readFile(docxPath);
    // Convert to PDF using LibreOffice
    const pdfBuffer = (await libreConvert(docxBuffer, ".pdf", undefined));
    // Write PDF to temp file
    const pdfPath = path_1.default.join(os_1.default.tmpdir(), `temp-${Date.now()}.pdf`);
    await promises_1.default.writeFile(pdfPath, pdfBuffer);
    try {
        // Convert PDF to images
        const result = await convertPdfToImages(pdfPath, submissionId);
        return result;
    }
    finally {
        // Clean up temp PDF
        await promises_1.default.unlink(pdfPath).catch(() => { });
    }
}
/**
 * Convert image files (JPG, PNG, WebP) to optimized PNG
 */
async function convertImageToOptimized(imagePath, submissionId, mimeType) {
    console.log("[converter] Converting image:", imagePath, mimeType);
    // Read and optimize the image
    const imageBuffer = await promises_1.default.readFile(imagePath);
    const optimizedBuffer = await (0, sharp_1.default)(imageBuffer)
        .resize(1200, 1600, {
        fit: "inside",
        withoutEnlargement: true,
    })
        .png({ quality: 90, compressionLevel: 9 })
        .toBuffer();
    // Get metadata
    const metadata = await (0, sharp_1.default)(optimizedBuffer).metadata();
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
async function convertDocument(fileUrl, mimeType, submissionId) {
    console.log(`[converter] Starting conversion for ${submissionId}, type: ${mimeType}`);
    // Download file from Supabase
    const localPath = await downloadFile(fileUrl);
    try {
        let result;
        if (mimeType === "application/pdf") {
            result = await convertPdfToImages(localPath, submissionId);
        }
        else if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            mimeType === "application/msword") {
            result = await convertDocxToImages(localPath, submissionId);
        }
        else if (mimeType === "image/jpeg" ||
            mimeType === "image/png" ||
            mimeType === "image/webp") {
            result = await convertImageToOptimized(localPath, submissionId, mimeType);
        }
        else {
            throw new Error(`Unsupported file type: ${mimeType}`);
        }
        console.log(`[converter] Conversion complete: ${result.pageCount} pages`);
        return result;
    }
    finally {
        // Clean up downloaded file
        await promises_1.default.unlink(localPath).catch(() => { });
    }
}
