import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  UIManager,
  findNodeHandle,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React, { useRef, useState } from 'react';

const SortDropdown = ({ value, onChange }) => {
  const buttonRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const openDropdown = () => {
    const handle = findNodeHandle(buttonRef.current);

    UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
      setPosition({
        top: pageY + height + 4,
        left: pageX,
        width,
      });
      setVisible(true);
    });
  };

  const handleSelect = (option) => {
    onChange(option);
    setVisible(false);
  };
  

  return (
    <>
      {/* Trigger */}
      <View style={styles.container}>
        <Text style={styles.label}>Sort by:</Text>

        <TouchableOpacity
          ref={buttonRef}
          style={styles.dropdown}
          onPress={openDropdown}
          activeOpacity={0.7}
        >
          <Text style={styles.value}>{value}</Text>
          <MaterialIcons name="keyboard-arrow-down" size={20} />
        </TouchableOpacity>
      </View>

      {/* Dropdown */}
      <Modal transparent visible={visible} animationType="fade">
        <TouchableOpacity
          style={styles.backdrop}
          onPress={() => setVisible(false)}
          activeOpacity={1}
        >
          <View
            style={[
              styles.menu,
              {
                top: position.top,
                left: position.left,
                width: position.width,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleSelect('Newest')}
            >
              <Text>Newest</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => handleSelect('Oldest')}
            >
              <Text>Oldest</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default SortDropdown;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
     minWidth: 80,   
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color:'#3D3A3A',
    marginRight: 4,
  },
  backdrop: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 6,
    paddingVertical: 6,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
});


