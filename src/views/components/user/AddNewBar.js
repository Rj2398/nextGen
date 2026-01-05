import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const AddNewBar = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.addText}>+ Add New</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddNewBar;
const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "flex-end",
    backgroundColor: "#fff",
  },
  addText: {
    fontSize: 15,
    color: "#F97316", // orange same as image
    fontWeight: "500",
  },
});
