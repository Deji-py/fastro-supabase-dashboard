import { redirect } from "next/navigation";

// Will do session check here
export default function Home() {
  redirect("/login");
}
