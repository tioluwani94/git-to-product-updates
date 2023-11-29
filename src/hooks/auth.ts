import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useAuth = (route?: string) => {
  const { push } = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      if (session.provider === "clickup") {
        push("/dashboard/clickup");
      } else if (session.provider === "linear") {
        push("/dashboard/linear");
      } else {
        push("/dashboard");
      }
    } else {
      push(route ?? "/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return { session, status };
};
