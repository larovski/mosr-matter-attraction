import dynamic from "next/dynamic";

const MatterAttraction = dynamic(
  () => import("@/components/MatterAttraction"),
  {
    ssr: false,
  }
);

export default function Home() {
  return (
    <main className="relative h-screen flex justify-center items-center">
      <h1
        style={{ WebkitTextStroke: "2px #151226" }}
        className="absolute text-[clamp(56px,12vw,208px)] tracking-wider uppercase pointer-events-none"
      >
        {/* Law of Attraction */}
        引力の法則
      </h1>
      <MatterAttraction />
    </main>
  );
}
