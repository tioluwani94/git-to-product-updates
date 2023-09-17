import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useAuth = (route?: string) => {
  const { push } = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      push("/dashboard");
    } else {
      push(route ?? "/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return { session, status };
};
