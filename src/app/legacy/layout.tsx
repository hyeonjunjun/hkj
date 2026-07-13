import { TransitionProvider } from "@/components/transition/TransitionProvider";

export default function LegacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TransitionProvider>{children}</TransitionProvider>;
}
