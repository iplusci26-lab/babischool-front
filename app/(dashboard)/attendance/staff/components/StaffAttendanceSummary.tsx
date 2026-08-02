interface StaffAttendanceSummaryProps {
    stats: {
      present: number;
      absent: number;
      late: number;
    };
  }
  
  export default function StaffAttendanceSummary({
    stats,
  }: StaffAttendanceSummaryProps) {
  
    const cards = [
  
      {
        title: "Présents",
        value: stats.present,
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700",
        valueColor: "text-green-900",
      },
  
      {
        title: "Absents",
        value: stats.absent,
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-700",
        valueColor: "text-red-900",
      },
  
      {
        title: "Retards",
        value: stats.late,
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-700",
        valueColor: "text-orange-900",
      },
  
    ];
  
    return (
  
      <div className="grid gap-4 md:grid-cols-3">
  
        {cards.map((card) => (
  
          <div
            key={card.title}
            className={`
              rounded-xl
              border
              ${card.border}
              ${card.bg}
              p-5
              shadow-sm
              transition-all
              hover:-translate-y-1
              hover:shadow-md
            `}
          >
  
            <p
              className={`text-sm font-medium ${card.text}`}
            >
              {card.title}
            </p>
  
            <p
              className={`mt-2 text-3xl font-bold ${card.valueColor}`}
            >
              {card.value}
            </p>
  
          </div>
  
        ))}
  
      </div>
  
    );
  
  }