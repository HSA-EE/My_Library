import type { Metadata } from "next";
import { StudyRoom } from "./StudyRoom";

export const metadata: Metadata = {
  title: "The Quiet Split — Interactive Study",
  description: "一间由阅读区与工作区组成的可交互私人书房。",
};

export default function Home() {
  return <StudyRoom />;
}
