import { baseConfig } from "@/config/index";

export default async function getServerPublicKey(): Promise<string> {
  try {
    const response = await fetch(`${baseConfig.backend.url}/public-key`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch message.");
    }

    const data = await response.json();
    return data.publicKey;
  } catch (error) {
    console.error("Error getting message:", error);
    throw error;
  }
}