import { useEffect, useState } from "react";
import { driverService, Driver } from "../services/api";

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await driverService.getAll();
        setDrivers(response.data);
      } catch (error) {
        console.error("Failed to fetch drivers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Drivers</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2 text-left">Phone</th>
            <th className="border p-2 text-left">Address</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.id} className="border">
              <td className="border p-2">{driver.name}</td>
              <td className="border p-2">{driver.phone}</td>
              <td className="border p-2">{driver.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
