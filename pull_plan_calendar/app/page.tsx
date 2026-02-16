import Calendar from "./components/Calendar";

export default function Home() {
  return (
    <div>
      <main className="w-full max-w-6xl mx-auto mt-12 bg-white rounded-lg shadow-md p-4">
        <Calendar areaId="mock-area-1" />
      </main>
    </div>
  );
}
