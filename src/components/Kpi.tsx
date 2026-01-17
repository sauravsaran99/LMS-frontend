const Kpi = ({ title, value }: { title: string; value: any }) => (
  <div className="rounded-lg border p-4 bg-white shadow-sm">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-xl font-semibold mt-1">{value}</p>
  </div>
);

export default Kpi;
