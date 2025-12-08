import DigitalClock from "@/components/DigitalClock";
import Greeting from "@/components/Greeting";
import Calendar from "@/components/Calendar";
import QuickLinks from "@/components/QuickLinks";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center gap-4 md:gap-8 w-full">
        <DigitalClock />
        <Greeting />
        <QuickLinks />
      </div>
      <Calendar />
    </main>
  );
}
