import { fetchAuthSession } from "@aws-amplify/auth";
import { ApiStack } from "../../../../../space-finder/outputs.json";
import { Space } from "../types/types";

const SPACE_URL = ApiStack.SpacesApiEndpoint36C4F3B6 + "spaces";

export async function getSpaces() {
  const jwtToken = (await fetchAuthSession()).tokens?.idToken?.toString() ?? "";

  const response = await fetch(SPACE_URL, {
    method: "GET",
    headers: {
      "Authorization": jwtToken,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch spaces");
  }

  const spaces = (await response.json()) as Space[];

  return spaces;
}
