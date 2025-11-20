import DigitalClock from "@/components/DigitalClock";
import Greeting from "@/components/Greeting";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-8 animate-fade-in">
      <DigitalClock />
      <Greeting />
    </main>
  );
}
