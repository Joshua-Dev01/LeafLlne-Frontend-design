import { Skeleton } from "antd";

const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_: unknown, idx: number) => (
        <div
          key={idx}
          className="bg-[#202020] p-4 rounded-2xl shadow hover:shadow-lg transition-shadow duration-300"
        >
          <Skeleton active paragraph={{ rows: 4 }} title={{ width: "60%" }} />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
