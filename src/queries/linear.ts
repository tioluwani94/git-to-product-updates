import { getTeams } from "@/service/linear";
import { useQuery } from "@tanstack/react-query";

export const useGetTeams = () => useQuery(["linear-teams"], getTeams);
