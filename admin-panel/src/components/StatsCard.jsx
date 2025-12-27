const StatsCard = ({ title, value }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl text-center">
      <h3 className="text-gray-400">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default StatsCard;
