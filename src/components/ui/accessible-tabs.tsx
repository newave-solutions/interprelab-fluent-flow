import * as React from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface AccessibleTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
  ariaLabel?: string;
}

/**
 * AccessibleTabs - A WCAG 2.1 AA compliant tabs component
 * 
 * Features:
 * - Proper ARIA roles and attributes (tablist, tab, tabpanel)
 * - Full keyboard navigation (Arrow keys, Home, End, Tab)
 * - Automatic activation on focus (or manual with Enter/Space)
 * - Support for disabled tabs
 * - Vertical and horizontal orientations
 * - Focus management
 */
export const AccessibleTabs: React.FC<AccessibleTabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  orientation = "horizontal",
  className,
  ariaLabel = "Content tabs",
}) => {
  const [activeTab, setActiveTab] = React.useState(
    defaultTab || tabs.find((tab) => !tab.disabled)?.id || tabs[0]?.id
  );
  const tabsRef = React.useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const tablistRef = React.useRef<HTMLDivElement>(null);

  const enabledTabs = tabs.filter((tab) => !tab.disabled);

  const handleTabClick = (tabId: string) => {
    if (tabs.find((t) => t.id === tabId)?.disabled) return;
    
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const focusTab = (tabId: string) => {
    const tabElement = tabsRef.current[tabId];
    if (tabElement) {
      tabElement.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, currentTabId: string) => {
    const currentIndex = enabledTabs.findIndex((tab) => tab.id === currentTabId);
    let nextIndex = currentIndex;

    const isHorizontal = orientation === "horizontal";
    const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
    const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";

    switch (event.key) {
      case prevKey:
        event.preventDefault();
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) {
          nextIndex = enabledTabs.length - 1;
        }
        break;

      case nextKey:
        event.preventDefault();
        nextIndex = currentIndex + 1;
        if (nextIndex >= enabledTabs.length) {
          nextIndex = 0;
        }
        break;

      case "Home":
        event.preventDefault();
        nextIndex = 0;
        break;

      case "End":
        event.preventDefault();
        nextIndex = enabledTabs.length - 1;
        break;

      case "Enter":
      case " ":
        event.preventDefault();
        handleTabClick(currentTabId);
        return;

      default:
        return;
    }

    const nextTab = enabledTabs[nextIndex];
    if (nextTab) {
      focusTab(nextTab.id);
      // Automatic activation on focus
      handleTabClick(nextTab.id);
    }
  };

  const isVertical = orientation === "vertical";

  return (
    <div className={cn("w-full", isVertical && "flex gap-4", className)}>
      {/* Tab List */}
      <div
        ref={tablistRef}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation={orientation}
        className={cn(
          "flex gap-1",
          isVertical ? "flex-col border-r" : "border-b"
        )}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isDisabled = tab.disabled;

          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabsRef.current[tab.id] = el;
              }}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              aria-disabled={isDisabled}
              tabIndex={isActive ? 0 : -1}
              disabled={isDisabled}
              onClick={() => handleTabClick(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, tab.id)}
              className={cn(
                "inline-flex items-center justify-center gap-2 whitespace-nowrap px-4 py-2 text-sm font-medium transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50",
                isActive
                  ? isVertical
                    ? "border-r-2 border-primary bg-muted text-foreground"
                    : "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground",
                !isActive && (isVertical ? "border-r-2 border-transparent" : "border-b-2 border-transparent")
              )}
            >
              {tab.icon && <span className="h-4 w-4">{tab.icon}</span>}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className={cn("mt-4", isVertical && "flex-1 mt-0")}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <div
              key={tab.id}
              role="tabpanel"
              id={`tabpanel-${tab.id}`}
              aria-labelledby={`tab-${tab.id}`}
              hidden={!isActive}
              tabIndex={0}
              className={cn(
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md",
                !isActive && "hidden"
              )}
            >
              {tab.content}
            </div>
          );
        })}
      </div>

      {/* Instructions for screen readers */}
      <div className="sr-only">
        Use {orientation === "horizontal" ? "left and right" : "up and down"} arrow
        keys to navigate between tabs. Press Home to go to the first tab, or End to
        go to the last tab.
      </div>
    </div>
  );
};

/**
 * Example usage:
 * 
 * ```tsx
 * import { FileText, Settings, User } from "lucide-react";
 * 
 * const MyTabbedInterface = () => {
 *   const tabs = [
 *     {
 *       id: "profile",
 *       label: "Profile",
 *       icon: <User />,
 *       content: <ProfileContent />
 *     },
 *     {
 *       id: "settings",
 *       label: "Settings",
 *       icon: <Settings />,
 *       content: <SettingsContent />
 *     },
 *     {
 *       id: "documents",
 *       label: "Documents",
 *       icon: <FileText />,
 *       content: <DocumentsContent />,
 *       disabled: true // Can disable individual tabs
 *     }
 *   ];
 * 
 *   return (
 *     <AccessibleTabs
 *       tabs={tabs}
 *       defaultTab="profile"
 *       onChange={(tabId) => console.log("Active tab:", tabId)}
 *       ariaLabel="User dashboard tabs"
 *     />
 *   );
 * };
 * ```
 */

export default AccessibleTabs;
