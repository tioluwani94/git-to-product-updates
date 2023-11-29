import { useGetTeams } from "@/queries/linear";
import React from "react";

export default function LinearPage() {
  const { data } = useGetTeams();
  console.log(data);
  return <div>LinearPage</div>;
}
