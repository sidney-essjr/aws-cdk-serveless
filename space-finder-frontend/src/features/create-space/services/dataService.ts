import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { DataStack } from "../../../../../space-finder/outputs.json";
import { awsRegion } from "../../authentication/config/amplify";
import { AwsCredentialIdentity } from "../../authentication/context/AuthContext";
import { FormDataProps } from "../form-create-space";

export default async function createSpace(
  { location, name, photo }: FormDataProps,
  { userCredentials }: { userCredentials: AwsCredentialIdentity | null }
) {
  if (!userCredentials) {
    throw new Error("User credentials are required");
  }
  if (!photo) {
    throw new Error("Photo is required");
  }
  const uploadUrl = await uploadPublicFile(photo, { userCredentials });
  console.log("Upload URL", uploadUrl);
}

async function uploadPublicFile(
  file: File,
  { userCredentials }: { userCredentials: AwsCredentialIdentity | null }
) {
  if (!userCredentials) {
    throw new Error("User credentials are required");
  }

  const client = new S3Client({
    region: awsRegion,
    credentials: {
      accessKeyId: userCredentials.accessKeyId,
      secretAccessKey: userCredentials.secretAccessKey,
      sessionToken: userCredentials.sessionToken,
    },
  });

  const command = new PutObjectCommand({
    Bucket: DataStack.SpaceFinderPhotosBucketName,
    Key: file.name,
    ACL: "public-read",
    Body: file,
  });

  await client.send(command);

  return `https://${command.input.Bucket}.s3.${awsRegion}.amazonaws.com/${command.input.Key}`;
}
