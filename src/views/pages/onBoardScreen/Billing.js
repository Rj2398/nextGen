import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Billing = () => {
  return (
    <View style={styles.container}>
      <Text>Billing</Text>
    </View>
  );
};

export default Billing;

const styles = StyleSheet.create({
  container: {
    flex: 1, // 1. Must take up the entire screen space
    justifyContent: 'center', // 2. Centers children vertically
    alignItems: 'center', // 3. Centers children horizontally
    backgroundColor: '#fff', // Optional: Set a background color
  },
});
