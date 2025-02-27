export interface Tab {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface TabButtonsProps {
  tabs: Tab[];
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const TabButtons = ({
  tabs,
  activeTab,
  setActiveTab,
}: TabButtonsProps) => {
  return (
    <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Tab content */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">{activeTab.label}</h2>
        <p className="text-gray-600">
          {activeTab.description}
        </p>
      </div>

      {/* Tab buttons */}
      <div className="flex border-t border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab)}
            className={`
            flex-1 flex flex-col items-center py-3 px-1 transition-all duration-300 ease-in-out
            ${
              activeTab.id === tab.id
                ? "text-blue-600 border-t-2 border-blue-600 -mt-px font-medium"
                : "text-gray-500 hover:text-blue-500"
            }
            group relative overflow-hidden
          `}
          >
            {/* Animated background on hover */}
            <div
              className={`
            absolute inset-0 bg-blue-50 transform 
            ${
              activeTab.id === tab.id
                ? "scale-100 opacity-100"
                : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-50"
            }
            transition-all duration-300 ease-in-out rounded-lg
          `}
            ></div>

            {/* Icon with bounce animation */}
            <div
              className={`
            relative z-10 transform transition-transform duration-300
            ${activeTab.id === tab.id ? "scale-110" : "group-hover:scale-110"}
          `}
            >
              {tab.icon}
            </div>

            {/* Label with slide-up animation */}
            <span
              className={`
            relative z-10 mt-1 text-xs transform transition-all duration-300
            ${
              activeTab.id === tab.id
                ? "translate-y-0 opacity-100"
                : "translate-y-1 group-hover:translate-y-0 opacity-80 group-hover:opacity-100"
            }
          `}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
