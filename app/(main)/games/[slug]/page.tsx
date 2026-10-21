import { GamePage } from "@/components/games/game-page";

export default function DynamicGamePage({ params }: { params: { slug: string } }) {
  return <GamePage slug={params.slug} />;
}
