import { useState } from "react";
import Dashboard from "./components/Dashboard";

function App() {
  const [city, setCity] = useState("Hyderabad");
  return (
    <div className="w-full min-h-screen bg-slate-800 text-white flex flex-col items-center p-4">
      <h1 className="text-center font-bold text-3xl uppercase mb-6 bg-blue-700 w-full p-4">
        Weather Monitoring System
      </h1>
      <select
        className="mt-4 p-2 bg-slate-700 border border-slate-600 rounded text-white max-w-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      >
        <option>Hyderabad</option>
        <option>Chennai</option>
        <option>Bangalore</option>
        <option>Mumbai</option>
        <option>Delhi</option>
      </select>
      <Dashboard city={city} />
    </div>
  );
}

export default App;
