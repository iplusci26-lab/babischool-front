"use client";

interface AttendanceTabsProps {
  activeTab: "attendance" | "justifications";
  setActiveTab: (
    tab: "attendance" | "justifications"
  ) => void;
}

export default function AttendanceTabs({
  activeTab,
  setActiveTab,
}: AttendanceTabsProps) {
  return (
    <div className="inline-flex rounded-xl border bg-white p-1 shadow-sm">
      <button
        onClick={() => setActiveTab("attendance")}
        className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
          activeTab === "attendance"
            ? "bg-[#6214BE] text-white"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        Appel
      </button>

      <button
        onClick={() => setActiveTab("justifications")}
        className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
          activeTab === "justifications"
            ? "bg-[#6214BE] text-white"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        Justifications
      </button>
    </div>
  );
}