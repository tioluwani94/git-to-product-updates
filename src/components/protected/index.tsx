import { useSession } from "next-auth/react";
import { ReactNode } from "react";

export const ProtectedRoute: React.FC<{ children: ReactNode }> = (props) => {
  const { status } = useSession({ required: true });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return <>{props.children}</>;
};
