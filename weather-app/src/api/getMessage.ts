import { baseConfig } from "@/config/index";
import getServerPublicKey from "./getServerPublicKey";
import { encrypt } from "@/helpers/crypto";

export default async function getMessage(): Promise<string> {
  const publicKey = await getServerPublicKey();

  try {
    const response = await fetch(`${baseConfig.backend.url}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: encrypt("user", publicKey), password: encrypt("password", publicKey) }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch message.");
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Error getting message:", error);
    throw error;
  }
}