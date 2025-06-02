import { useState } from 'react';

export function useTabs({
  tabs,
  initialTabId,
  onChange
}) {
  const [state, setSelectedTab] = useState(() => {
    const indexOfInitialTab = tabs.findIndex((tab) => tab.value === initialTabId);
    return [indexOfInitialTab === -1 ? 0 : indexOfInitialTab, 0];
  });
  const [selectedTabIndex, direction] = state;

  return {
    tabProps: {
      tabs,
      selectedTabIndex,
      onChange,
      setSelectedTab
    },
    selectedTab: tabs[selectedTabIndex],
    contentProps: {
      direction,
      selectedTabIndex
    }
  };
}