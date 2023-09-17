import { useAuth } from "@/hooks/auth";
import React from "react";

export default function ClickupPage() {
  useAuth();
  return <div>ClickupPage</div>;
}
