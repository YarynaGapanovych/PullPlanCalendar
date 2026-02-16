import CalendarContainer from "./components/CalendarContainer";

export default function Home() {
  return (
    <div>
      <main className="w-full max-w-7xl mx-auto mt-12">
        <CalendarContainer showSwitcher={true} showTabs={true} />
      </main>
    </div>
  );
}
