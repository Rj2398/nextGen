// 📁 components/SearchBar.js

import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import SearchIcon from "../../assets/search_icon.svg";
import FilterIcon from "../../assets/filter_icon.svg";

export default function SearchBar({ isFilterVisible, openFilters }) {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBox}>
        <SearchIcon style={styles.searchImage} />

        <TextInput
          placeholder="Search Product or orders"
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
      </View>

      <TouchableOpacity onPress={openFilters} style={{ padding: 1 }}>
        {isFilterVisible ? (
          <ActiveFilterIcon width={24} height={24} />
        ) : (
          <FilterIcon width={24} height={24} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 45,
  },

  searchImage: {
    width: 20,
    height: 20,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
});
