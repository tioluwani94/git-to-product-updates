import { Hero } from "@/components/home/hero";
import { useAuth } from "@/hooks/auth";

export default function Home() {
  useAuth();

  return (
    <>
      <Hero />
    </>
  );
}
