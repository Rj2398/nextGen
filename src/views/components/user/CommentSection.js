import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const CommentSection = ({ comments = [], onSubmit }) => {
  const [commentText, setCommentText] = useState("");

  const handleSend = () => {
    if (!commentText.trim()) return;
    onSubmit && onSubmit(commentText);
    setCommentText("");
  };

  return (
    <View style={styles.container}>
      {/* COMMENTS LIST */}
      <FlatList
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        style={styles.commentList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Text style={styles.userName}>{item?.user}</Text>
            <Text style={styles.commentText}>{item?.text}</Text>
          </View>
        )}
      />

      {/* INPUT + BUTTON */}
      <View style={styles.inputRow}>
        <TextInput
          value={commentText}
          onChangeText={setCommentText}
          placeholder="Write a comment..."
          style={styles.input}
        />

        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommentSection;

const styles = StyleSheet.create({
  container: {
    height: 300, // ✅ FIXED HEIGHT
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 10,
  },

  commentList: {
    // flexGrow: 0,
    // marginBottom: 8,
    height: 300, // ✅ FIXED HEIGHT
  },

  commentItem: {
    marginBottom: 10,
  },

  userName: {
    fontWeight: "600",
    fontSize: 13,
  },

  commentText: {
    fontSize: 13,
    color: "#333",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 8,
  },

  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 12,
    fontSize: 13,
  },

  sendBtn: {
    marginLeft: 8,
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  sendText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});

