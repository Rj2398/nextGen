import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import CommentSection from "./CommentSection";

const CommentBottomSheet = ({
  visible,
  onClose,
  comments = [],
  onSubmit,
}) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.dragBar} />

        <CommentSection
          comments={comments}
          onSubmit={(text) => {
            onSubmit?.(text);
            onClose();
          }}
        />
      </View>
    </Modal>
  );
};

export default CommentBottomSheet;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  bottomSheet: {
    backgroundColor: "#fff",
    paddingTop: 8,
    paddingHorizontal: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "70%",
  },
  dragBar: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 8,
  },
});
