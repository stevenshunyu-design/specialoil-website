import { S3Storage } from "coze-coding-dev-sdk";

async function uploadLogosFromUrls() {
  const storage = new S3Storage({
    endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
    accessKey: "",
    secretKey: "",
    bucketName: process.env.COZE_BUCKET_NAME,
    region: "cn-beijing",
  });

  const urls = [
    {
      name: "petrochina",
      url: "https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2Fimage.png&nonce=a7e926a3-3c07-49e3-9e3a-f3eea872cc57&project_id=7614051504298786825&sign=76b89e45cf871afdf1aee47d971be2b0d212038fc98c5ff968a6e25055bdc901"
    },
    {
      name: "sinopec",
      url: "https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2Fimage.png&nonce=a7ca94d8-3f55-45eb-b328-965e8d644003&project_id=7614051504298786825&sign=02f3f08ffcf1d990b7debd3a83f6692fca2f8b8b7c10e1003ac97610139d332c"
    },
    {
      name: "cnooc",
      url: "https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2Fimage.png&nonce=b538fdb8-1ff0-442a-afef-80cf601cb0ba&project_id=7614051504298786825&sign=76150af472c141f186d1369e2b2fd9cf6a8448bea49fd2e1eccc986dc3a1acbd"
    }
  ];

  for (const item of urls) {
    try {
      console.log(`Uploading ${item.name}...`);
      const key = await storage.uploadFromUrl({ url: item.url, timeout: 30000 });
      const signedUrl = await storage.generatePresignedUrl({ key, expireTime: 31536000 });
      console.log(`${item.name} Logo URL:`, signedUrl);
    } catch (error) {
      console.error(`Failed to upload ${item.name}:`, error);
    }
  }

  console.log("All done!");
}

uploadLogosFromUrls().catch(console.error);
