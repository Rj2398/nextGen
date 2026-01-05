import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PaginationBar = ({ currentPage = 1, totalPages = 10 ,
     onPrev, // Previous button callback
  onNext, // Next button callback
}) => {
  return (
    <View style={styles.container}>
      {/* Previous Button */}
      <TouchableOpacity style={styles.iconButton}
       onPress={onPrev} // Call onPrev when pressed
        disabled={currentPage === 1} // Disable if first page
      >
        <MaterialIcons name="chevron-left" size={28}
         color={currentPage === 1 ? '#BDBDBD' : '#F57C00'}
        //  color="#F57C00" 
         />
      </TouchableOpacity>

      {/* Page Text */}
      <Text style={styles.pageText}>
        Page {currentPage} Of {totalPages}
      </Text>

      {/* Next Button */}
      <TouchableOpacity style={styles.iconButton}
       onPress={onNext} // Call onNext when pressed
        disabled={currentPage === totalPages} // Disable if last page
      >
        <MaterialIcons name="chevron-right" size={28} 
        color={currentPage === totalPages ? '#BDBDBD' : '#F57C00'}
         />
      </TouchableOpacity>
    </View>
  );
};

export default PaginationBar;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 20,
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  pageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7A7A7A',
  },
});
