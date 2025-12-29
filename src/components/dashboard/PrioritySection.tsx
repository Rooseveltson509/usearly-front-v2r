const priorities = [
  {
    name: "Performance",
    percentage: 50,
    count: 752,
    color: "bg-blue-500",
    icon: "⚡",
  },
  {
    name: "Panier",
    percentage: 30,
    count: 458,
    color: "bg-amber-400",
    icon: "🛒",
  },
  {
    name: "Service client",
    percentage: 15,
    count: 321,
    color: "bg-violet-500",
    icon: "💬",
  },
];

const PrioritySection = () => {
  return (
    <div className="card-usearly space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-bold text-foreground">
          À traiter en priorité !
        </h3>
        <span className="text-xl">🔥</span>
      </div>

      <p className="text-xs text-muted-foreground">
        Tendance des catégories les plus signalées
      </p>

      <div className="space-y-4">
        {priorities.map((priority, index) => (
          <div key={index} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{priority.icon}</span>
                <span className="font-medium text-foreground text-sm">
                  {priority.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {priority.percentage}%
                </span>
                <div className="flex items-center gap-1 text-red-500">
                  <span className="text-xs">🔥</span>
                  <span className="font-semibold text-sm">
                    {priority.count}
                  </span>
                </div>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${priority.color} rounded-full transition-all duration-500`}
                style={{ width: `${priority.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrioritySection;
