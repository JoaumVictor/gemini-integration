import fs from "fs";
import path from "path";

export interface ImageResult {
  imagePath: string;
  imageFormat: "image/jpeg" | "image/png";
  imageName: string;
}

export const convertBase64ToImage = (
  base64Image: string,
  outputDir: string
): ImageResult => {
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  const imageBuffer = Buffer.from(base64Data, "base64");
  const header = imageBuffer.toString("hex", 0, 8);
  let ext: string;
  let mimeType: "image/jpeg" | "image/png";

  if (header.startsWith("ffd8ff")) {
    ext = "jpg";
    mimeType = "image/jpeg";
  } else if (header.startsWith("89504e47")) {
    ext = "png";
    mimeType = "image/png";
  } else {
    throw new Error(
      "Formato de imagem não suportado. Aceitos: jpg, jpeg, png."
    );
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const fileName = `image_${Date.now()}.${ext}`;
  const outputPath = path.join(outputDir, fileName);
  fs.writeFileSync(outputPath, imageBuffer);

  return { imagePath: outputPath, imageFormat: mimeType, imageName: fileName };
};
