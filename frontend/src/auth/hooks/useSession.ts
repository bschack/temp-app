import { SessionPayload, SessionPayloadSchema } from "@/lib/zod";
import { useEffect, useState } from "react";
import { clearUserSession, getUserSession } from "../tokenUtils";

export const useSession = () => {
  const [session, setSession] = useState<SessionPayload>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const session = await getUserSession();
      const verifiedSession = session ? await SessionPayloadSchema.parseAsync(session) : false;
      setSession(verifiedSession);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchSession();
  }

  const signOut = async () => {
    await clearUserSession();
    fetchSession();
  }

  useEffect(() => {
    fetchSession();
  }, []);

  return { session, loading, error, refetch, signOut };
}