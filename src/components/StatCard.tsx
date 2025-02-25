import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  subtitle?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
}: StatCardProps) {
  return (
    <div className="bg-primary rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h3 className="text-secondary-foreground text-sm font-medium opacity-80">
            {title}
          </h3>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-foreground rounded-lg">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <span className="text-3xl font-bold text-foreground">{value}</span>
          </div>
          {subtitle && (
            <p className="text-[#DAD2C7] text-sm opacity-60">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
