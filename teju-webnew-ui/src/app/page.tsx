import MainInterface from "./components/MainInterface";
import { Analytics } from "@vercel/analytics/next"

export default function Home() {
  return <div><Analytics /><MainInterface /></div>;
}
