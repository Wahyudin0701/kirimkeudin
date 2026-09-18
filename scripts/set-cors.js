const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

const { S3Client, PutBucketCorsCommand } = require('@aws-sdk/client-s3');

async function main() {
  const client = new S3Client({
    region: 'auto',
    endpoint: 'https://' + process.env.CLOUDFLARE_R2_ACCOUNT_ID + '.r2.cloudflarestorage.com',
    credentials: { 
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID, 
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY 
    }
  });

  try {
    await client.send(new PutBucketCorsCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      CORSConfiguration: { 
        CORSRules: [
          { 
            AllowedHeaders: ['*'], 
            AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'], 
            AllowedOrigins: ['*'],
            MaxAgeSeconds: 3000
          }
        ] 
      }
    }));
    console.log('CORS OK');
  } catch(e) {
    console.error('CORS Error:', e);
  }
}

main();
