import { S3Storage } from "coze-coding-dev-sdk";
import * as fs from "fs";
import * as path from "path";

async function uploadLogos() {
  const storage = new S3Storage({
    endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
    accessKey: "",
    secretKey: "",
    bucketName: process.env.COZE_BUCKET_NAME,
    region: "cn-beijing",
  });

  // 上传现有的中海油logo
  const cnoocPath = path.join(process.cwd(), "public/partners/cnooc.png");
  if (fs.existsSync(cnoocPath)) {
    const fileContent = fs.readFileSync(cnoocPath);
    const cnoocKey = await storage.uploadFile({
      fileContent,
      fileName: "partners/cnooc.png",
      contentType: "image/png",
    });
    const cnoocUrl = await storage.generatePresignedUrl({ key: cnoocKey, expireTime: 31536000 }); // 1年有效期
    console.log("CNOOC Logo URL:", cnoocUrl);
  }

  console.log("Logo upload completed!");
}

uploadLogos().catch(console.error);
