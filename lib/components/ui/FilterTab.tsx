import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const FilterTab = ({ tabs, activeIndex = 0, onChange }) => {
  const [activeTab, setActiveTab] = useState(activeIndex);

  useEffect(() => {
    setActiveTab(activeIndex);
  }, [activeIndex]);

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === index;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.tabItem, isActive && styles.activeTabItem]}
              onPress={() => {
                setActiveTab(index)
                onChange?.(tab?.type)
              }}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTabItem: {
    backgroundColor: 'rgba(0,110,233,0.05)',
    borderColor: '#007AFF', // Màu thanh gạch chân khi active
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF', // Màu chữ khi active
  },
  contentContainer: {
    flex: 1,
    // paddingTop: 16,
  },
});

export default FilterTab;
