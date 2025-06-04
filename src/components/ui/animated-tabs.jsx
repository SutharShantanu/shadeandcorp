'use client';

import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';

const useTabs = ({ tabs, initialTabId, onChange }) => {
    if (!initialTabId) return null;

    const [state, setSelectedTab] = React.useState(() => {
        const indexOfInitialTab = tabs.findIndex((tab) => tab.value === initialTabId);
        return [indexOfInitialTab === -1 ? 0 : indexOfInitialTab, 0];
    });
    const [selectedTabIndex, direction] = state;

    const handleTabChange = (index) => {
        const newDirection = index > selectedTabIndex ? 1 : -1;
        setSelectedTab([index, newDirection]);
        if (onChange) onChange(tabs[index]);
    };

    return {
        tabProps: {
            tabs,
            selectedTabIndex,
            setSelectedTab: handleTabChange
        },
        selectedTab: tabs[selectedTabIndex],
        contentProps: {
            direction,
            selectedTabIndex
        }
    };
};

const transition = {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.15
};

const getHoverAnimationProps = (hoveredRect, navRect) => ({
    x: hoveredRect.left - navRect.left - 10,
    y: hoveredRect.top - navRect.top - 4,
    width: hoveredRect.width + 20,
    height: hoveredRect.height + 10
});

const Tabs = ({
    tabs,
    selectedTabIndex,
    setSelectedTab,
}) => {
    const [buttonRefs, setButtonRefs] = React.useState([]);

    React.useEffect(() => {
        setButtonRefs((prev) => prev.slice(0, tabs.length));
    }, [tabs.length]);

    const navRef = React.useRef(null);
    const navRect = navRef.current?.getBoundingClientRect();

    const selectedRect = buttonRefs[selectedTabIndex]?.getBoundingClientRect();

    const [hoveredTabIndex, setHoveredTabIndex] = React.useState(null);
    const hoveredRect = buttonRefs[hoveredTabIndex ?? -1]?.getBoundingClientRect();

    return (
        <nav
            ref={navRef}
            className="flex flex-shrink-0 justify-center items-center relative z-0 py-2"
            onPointerLeave={() => setHoveredTabIndex(null)}>
            {tabs.map((item, i) => {
                const isActive = selectedTabIndex === i;
                return (
                    <button
                        key={item.value}
                        className="text-sm relative rounded-md flex items-center h-8 px-4 z-20 bg-transparent cursor-pointer select-none transition-colors"
                        onPointerEnter={() => setHoveredTabIndex(i)}
                        onFocus={() => setHoveredTabIndex(i)}
                        onClick={() => setSelectedTab(i)}
                    >
                        <motion.span
                            ref={(el) => {
                                buttonRefs[i] = el;
                            }}
                            className={cn('block', {
                                'text-muted-foreground': !isActive,
                                'text-primary-default font-semibold': isActive
                            })}
                        >
                            <small className={item.value === 'danger-zone' ? 'text-destructive-default' : ''}>{item.label}</small>
                        </motion.span>
                    </button>
                );
            })}

            <AnimatePresence>
                {hoveredRect && navRect && (
                    <motion.div
                        key="hover"
                        className={`absolute z-10 top-0 left-0 rounded-md border ${hoveredTabIndex === tabs.findIndex(({ value }) => value === 'danger-zone')
                            ? 'bg-destructive-default/50 border-destructive-default'
                            : 'bg-primary-foreground border-muted-default'
                            }`}
                        initial={{ ...getHoverAnimationProps(hoveredRect, navRect), opacity: 0 }}
                        animate={{ ...getHoverAnimationProps(hoveredRect, navRect), opacity: 1 }}
                        exit={{ ...getHoverAnimationProps(hoveredRect, navRect), opacity: 0 }}
                        transition={transition}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedRect && navRect && (
                    <motion.div
                        className={`absolute z-10 bottom-0 left-0 h-[2px] rounded-md ${selectedTabIndex === tabs.findIndex(({ value }) => value === 'danger-zone')
                            ? 'bg-destructive-default'
                            : 'bg-primary-default'
                            }`}
                        initial={false}
                        animate={{
                            width: selectedRect.width + 18,
                            x: `calc(${selectedRect.left - navRect.left - 9}px)`,
                            opacity: 1
                        }}
                        transition={transition}
                    />
                )}
            </AnimatePresence>
        </nav>
    );
};

const TabContent = ({ tab, tabContent }) => {
    console.log('Rendering TabContent for:', tab?.value);
    if (!tab) return <div>No tab selected</div>;
    const Content = tabContent[tab.value];
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={transition}
            className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg mt-4 h-[55vh]"
        >
            {Content ? <Content /> : <div>No content available for this tab.</div>}
        </motion.div>
    );
};

const AnimatedTabs = ({ tabs, renderTabContent, rightEndSection, selectedTabIndex: externalIndex, setSelectedTab: setExternalTab, initialTabId, onChange }) => {
    const internal = useTabs({ tabs, initialTabId, onChange });

    const selectedTabIndex = externalIndex ?? internal?.tabProps.selectedTabIndex ?? 0;
    const setSelectedTab = setExternalTab ?? internal?.tabProps.setSelectedTab ?? (() => { });

    const selectedTab = tabs[selectedTabIndex];

    return (
        <div className="w-full">
            <div className="relative border-b border-border flex w-full items-center justify-between overflow-x-auto overflow-y-hidden">
                <Tabs tabs={tabs} selectedTabIndex={selectedTabIndex} setSelectedTab={setSelectedTab} />
                {rightEndSection && (
                    <div className="flex justify-end items-center">
                        {rightEndSection}
                    </div>
                )}
            </div>
            <AnimatePresence mode="wait">
                {selectedTab && (
                    <motion.div
                        key={selectedTab.value}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ type: "tween", ease: "easeOut", duration: 0.15 }}
                        className="mt-6"
                    >
                        {renderTabContent(selectedTab)}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AnimatedTabs;
