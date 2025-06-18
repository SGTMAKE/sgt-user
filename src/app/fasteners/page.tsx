import { redirect } from "next/navigation"

export default function FastenersPage() {
  // Redirect to the bolts page by default
  redirect("/fasteners/bolts")
}
