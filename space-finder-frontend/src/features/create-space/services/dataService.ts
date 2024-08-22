import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { DataStack, ApiStack } from "../../../../../space-finder/outputs.json";
import { awsRegion } from "../../authentication/config/amplify";
import { FormDataProps } from "../form-create-space";
import { AwsCredentialIdentity } from "../../authentication/context/AuthContext";
import { fetchAuthSession } from "@aws-amplify/auth";

const SPACE_URL = ApiStack.SpacesApiEndpoint36C4F3B6 + "/spaces";

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

  const jwtToken = (await fetchAuthSession()).tokens?.idToken?.toString() ?? "";

  const postResult = await fetch(SPACE_URL, {
    method: "POST",
    headers: {
      "Authorization": jwtToken,
    },
    body: JSON.stringify({
      location,
      name,
      photoUrl: uploadUrl,
    }),
  });

  if (!postResult.ok) {
    throw new Error("Failed to create space");
  }
  const space = await postResult.json();

  return space.id;
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
    Key: file.name.split(" ").join("_"),
    ACL: "public-read",
    Body: file,
  });

  await client.send(command);

  return `https://${command.input.Bucket}.s3.${awsRegion}.amazonaws.com/${command.input.Key}`;
}
