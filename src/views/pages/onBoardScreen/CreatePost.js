import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  FlatList,
  Alert,
  Button,
  Image,
} from "react-native";
import React, { useState, useEffect ,useCallback} from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import userPost from "../../../hooks/userPost";
import Loader from "../../components/Loader";
import { pick } from "@react-native-documents/picker";

// --- Color Palette and Constants
const PRIMARY_ORANGE = "#F97316";
const DARK_GRAY_TEXT = "#1F2937";
const MEDIUM_GRAY_TEXT = "#4B5563";
const LIGHT_GRAY_TEXT = "#6B7280";
const INPUT_BORDER = "#D1D5DB";
const WHITE = "#FFFFFF";
const LIGHT_BG = "#F9FAFB";
const CHIP_BG = "#FEE2E2"; // Light red/orange for audience chips
const CHIP_TEXT = "#991B1B"; // Dark red/orange for audience chip text
const MEDIA_UPLOAD_BG = "#F3F4F6";
const BORDER_COLOR = '#D1D5DB';

const CreatePost = ({ navigation }) => {
  const { isLoadingupdate, createPost, departmentQuery } = userPost();
  // Assume navigation prop for back arrow
  const [postTitle, setPostTitle] = useState("");
  const [postTags, setPostTags] = useState("Test");
  const [audience, setAudience] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  console.log(selectedFiles, "audience ******");
  const [regionOptions, setRegionOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [allowComments, setAllowComments] = useState(true);
  const [sendNotification, setSendNotification] = useState(true);
  const { data, isError, error, isLoading } = departmentQuery;
  const departmentList = Array.isArray(data?.items) ? data.items : [];
  console.log("$$$$$$$$$$:", departmentList);
   const [tags, setTags] = useState([]); 
   const [newTagInput, setNewTagInput] = useState('');
  useEffect(() => {
    if (Array.isArray(departmentList)) {
      const options = departmentList.map((item) => ({
        label: item?.label || item?.title || "N/A",
        id: item?.id,
      }));

      setRegionOptions(options);
    } else {
      setRegionOptions([]); // crash prevention
    }
  }, [departmentList]);
  console.log("regionOptions", regionOptions);
  const toggleComments = () =>
    setAllowComments((previousState) => !previousState);
  const toggleNotification = () =>
    setSendNotification((previousState) => !previousState);

  const handlePublish = () => {
    console.log("Post Published!");
    // Logic to send data to API
  };

  const handleCancel = () => {
    console.log("Post Creation Canceled");
    // Logic to navigate back or close
    // navigation.goBack();
  };
  // Dummy data for uploaded files (to simulate the look)
  const [uploadedFiles, setUploadedFiles] = useState([
    { name: "IMG_3312.jpeg", type: "image" },
    { name: "DOC.pdf", type: "pdf" },
  ]);

  const removeFile = (fileName) => {
    setSelectedFiles(selectedFiles.filter((file) => file.name !== fileName));
  };

  // *** MODIFICATION 1: Use item.value as the selected key ***
  const handleSelect = (item) => {
    console.log(item, "item list");

    setIsDropdownOpen(false);

    setAudience((prev) => {
      if (prev.includes(item)) {
        // remove if already exists
        return prev.filter((v) => v !== item.id);
      } else {
        // ✅ append without replacing
        return [...prev, item];
      }
    });
  };
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  const MAX_FILES = 5;
  const pickPhotoAndVidoe = async () => {
    try {
      // single file pick
      const [result] = await pick();

      if (!result) {
        console.log("No file selected");
        return;
      }
      // ✅ Size validation
      if (result.size > MAX_FILE_SIZE) {
        //  console.log('File size should be less than 10 MB');
        Alert.alert("Error", "File size should be less than 10 MB");
        return;
      }

      // 3. Double check count before adding (Good practice for async updates)
    if (selectedFiles.length >= MAX_FILES) {
       Alert.alert("Error", "Maximum file limit reached.");
       return;
    }

      console.log("Picked file:", result);
      // ✅ Append new file to existing selectedFiles
      setSelectedFiles((prevFiles) => [...prevFiles, result]);
      return result;
    } catch (error) {
      // cancel ya error handling
      if (error?.code === "DOCUMENT_PICKER_CANCELED") {
        console.log("User cancelled document picker");
      } else {
        console.error("Document Picker Error:", error);
      }
    }
  };

  const handleCreatePost = async () => {
    // 🔴 Basic validations
    if (!postTitle) {
      Alert.alert("Error", "Post title is required");
      return;
    }

    if (!description) {
      Alert.alert("Error", "Post description is required");
      return;
    }

    if (!audience || audience.length === 0) {
      Alert.alert("Error", "Please select at least one audience");
      return;
    }

      if (!tags || tags.length === 0) {
      Alert.alert("Error", "Please select at least one tag");
      return;
    }

    try {
      const formData = new FormData();

      // 🔹 Post Information
      formData.append("CreatePost.PostInformation.post_title", postTitle);

      audience.forEach((item, index) => {
        formData.append(
          `CreatePost.PostInformation.post_audience[${index}]`,
          item.id
        );
      });

       (tags || []).forEach((item, index) => {
  formData.append(
    `CreatePost.PostInformation.post_tags[${index}]`,
    item
  );
});

     // formData.append("CreatePost.PostInformation.post_tags", postTags);

      // 🔹 Post Description (Rich Text HTML)
      formData.append(
        "CreatePost.PostDescription.post_description",
        description
      );

      // 🔹 Post Settings
      formData.append("CreatePost.PostSettings.allow_comments", allowComments);

      formData.append(
        "CreatePost.PostSettings.send_push_notification",
        sendNotification
      );
      //CreatePost.MediaUpload.upload_media
      // 🔹 Media files (images / videos)
      selectedFiles?.forEach((file, index) => {
        formData.append("CreatePost.MediaUpload.upload_media", {
          uri: file.uri,
          type: file.type,
          name: file.name || `upload_media_${index}`,
        });
      });

      console.log("Create Post FormData =>", formData);

      const response = await createPost(formData);

      if (response) {
        // Alert.alert("Success", response.message || "Post created successfully");
        Alert.alert(
          "Success",
          response.message || "Post created successfully",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error) {
      console.log("Create post error", error);
      Alert.alert("Error", error.message || "Post creation failed");
    }
  };

  const getShortFileName = (name, maxLength = 20) => {
    if (!name) return "";

    const lastDotIndex = name.lastIndexOf(".");
    if (lastDotIndex === -1) return name;

    const extension = name.slice(lastDotIndex); // ".mp4"
    const fileName = name.slice(0, lastDotIndex);

    if (name.length <= maxLength) return name;

    const allowedLength = maxLength - extension.length - 3; // for "..."
    return `${fileName.slice(0, allowedLength)}...${extension}`;
  };

  // 🌟 FUNCTIONAL TAGS: Logic to add a tag
    const addTag = useCallback(
      tagText => {
        const formattedTag = tagText
          .trim()
          .replace(/[.,]/g, '')
          .replace(/^#/, ''); // Remove #, comma, space
        if (
          formattedTag &&
          tags.findIndex(t => t.toLowerCase() === formattedTag.toLowerCase()) ===
            -1
        ) {
          setTags(prev => [...prev, formattedTag]);
        }
      },
      [tags],
    );
  
    const removeTag = tagToRemove => {
      setTags(tags.filter(t => t !== tagToRemove));
    };
  
    const handleTagInputSubmit = () => {
      if (newTagInput) {
        addTag(newTagInput);
        setNewTagInput('');
      }
    };
  

   const renderTags = () => (
      <View style={styles.tagChipsContainer}>
        {tags.map((tag, index) => (
          <View key={index} style={[styles.audienceChip, styles.tagDisplayChip]}>
            <Text style={[styles.chipText, {color: DARK_GRAY_TEXT}]}>#{tag}</Text>
            <TouchableOpacity
              style={{marginLeft: 5}}
              onPress={() => removeTag(tag)}>
              <MaterialCommunityIcons
                name="close-circle"
                size={16}
                color={DARK_GRAY_TEXT}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );

  return (
    <View style={styles.container}>
      <Loader visible={isLoading || isLoadingupdate} />
      {/* --- Top Header --- */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack() || console.log("Go Back")}
        >
          <Ionicons name="arrow-back" size={24} color={DARK_GRAY_TEXT} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* --- 1. Post Title --- */}
        <Text style={styles.inputLabel}>Post Title</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter post title..."
          placeholderTextColor={LIGHT_GRAY_TEXT}
          value={postTitle}
          onChangeText={setPostTitle}
        />

        {/* --- 2. Post Audience --- */}
        <Text style={styles.inputLabel}>Post Audience *</Text>
        <TouchableOpacity
          style={styles.dropdownInput}
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <TextInput
            style={styles.audienceText}
            //  value={audience}
            placeholder="Select audience..."
            placeholderTextColor={LIGHT_GRAY_TEXT}
            editable={false}
          />
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color={LIGHT_GRAY_TEXT}
          />
        </TouchableOpacity>
        {/* SELECTION LIST (Conditionally rendered) */}
        {isDropdownOpen && (
          <View style={styles.optionsContainer}>
            <FlatList
              data={regionOptions}
              nestedScrollEnabled={true}
              // *** MODIFICATION 3: Robust keyExtractor to handle 'id', 'value', or random fallback ***
              keyExtractor={(item) =>
                (item.id || item.value || Math.random()).toString()
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[styles.optionText]}>
                    {/* *** MODIFICATION 5: Always use item.label for display *** */}
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Audience Chips */}
        <View style={styles.chipContainer}>
          {/* School-wide Chip */}
          {/* <View
            style={[
              styles.audienceChip,
              {backgroundColor: CHIP_BG, borderColor: CHIP_TEXT},
            ]}>
            <Text style={[styles.chipText, {color: CHIP_TEXT}]}>
              School-wide
            </Text>
            <TouchableOpacity style={{marginLeft: 5}}>
              <MaterialCommunityIcons
                name="close-circle"
                size={16}
                color={CHIP_TEXT}
              />
            </TouchableOpacity>
          </View> */}
          {audience.map((value) => {
            const item = regionOptions.find((opt) => opt.id === value.id);
            if (!item) return null; // safety

            return (
              <View
                key={value}
                style={[
                  styles.audienceChip,
                  { backgroundColor: CHIP_BG, borderColor: CHIP_TEXT },
                ]}
              >
                <Text style={[styles.chipText, { color: CHIP_TEXT }]}>
                  {item.label}
                </Text>

                <TouchableOpacity
                  style={{ marginLeft: 5 }}
                  onPress={() => {
                    setAudience((prev) =>
                      prev.filter((v) => v.id !== value.id)
                    );
                  }}
                >
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={16}
                    color={CHIP_TEXT}
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* --- 3. Upload Media --- */}
        <Text style={styles.inputLabel}>Upload Media</Text>
        <TouchableOpacity
          style={styles.mediaUploadBox}
          onPress={() => pickPhotoAndVidoe()}
        >
          <MaterialCommunityIcons
            name="cloud-upload-outline"
            size={32}
            color={LIGHT_GRAY_TEXT}
          />
          <Text style={styles.uploadText}>
            Tap to add photos/videos or browse.
          </Text>
          <Text style={styles.uploadInfo}>
            Max 10MB file • JPG, PNG, MP4, PDF
          </Text>
        </TouchableOpacity>

        {/* Uploaded Files Preview */}
        <View style={styles.filesContainer}>
          {selectedFiles.map((file, index) => (
            <View key={index} style={styles.filePill}>
              <Text style={styles.fileIcon}>
                {file.type === "image/jpeg" ? "" : ""}
              </Text>
              {file.type === "image/jpeg" && (
                <MaterialCommunityIcons
                  name="image"
                  size={20}
                  color={DARK_GRAY_TEXT}
                  style={{ marginRight: 4 }}
                />
              )}
              {file.type === "video/mp4" && (
                <MaterialCommunityIcons
                  name="image"
                  size={20}
                  color={DARK_GRAY_TEXT}
                  style={{ marginRight: 4 }}
                />
              )}
              {file.type === "application/pdf" && (
                <MaterialCommunityIcons
                  name="file-pdf-box"
                  size={20}
                  color={"#E53935"}
                  style={{ marginRight: 4 }}
                />
              )}
              <Text style={styles.fileName}>
                {" "}
                {getShortFileName(file.name)}
              </Text>
              <TouchableOpacity onPress={() => removeFile(file.name)}>
                <MaterialCommunityIcons
                  name="close-circle"
                  size={16}
                  color={MEDIUM_GRAY_TEXT}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* --- 4. Post Description (Rich Text Editor Mock) --- */}
        <Text style={styles.inputLabel}>Post Description *</Text>

        {/* Rich Text Toolbar Mock */}
        <View style={styles.toolbar}>
          <SimpleLineIcons
            name="pencil"
            size={18}
            color={MEDIUM_GRAY_TEXT}
            style={styles.toolbarIcon}
          />
          <SimpleLineIcons
            name="bold"
            size={18}
            color={MEDIUM_GRAY_TEXT}
            style={styles.toolbarIcon}
          />
          <SimpleLineIcons
            name="italic"
            size={18}
            color={MEDIUM_GRAY_TEXT}
            style={styles.toolbarIcon}
          />
          <MaterialCommunityIcons
            name="format-underline"
            size={22}
            color={MEDIUM_GRAY_TEXT}
            style={styles.toolbarIcon}
          />
          <MaterialCommunityIcons
            name="format-list-bulleted"
            size={22}
            color={MEDIUM_GRAY_TEXT}
            style={styles.toolbarIcon}
          />
          <MaterialCommunityIcons
            name="format-list-numbered"
            size={22}
            color={MEDIUM_GRAY_TEXT}
            style={styles.toolbarIcon}
          />
          <MaterialCommunityIcons
            name="format-quote-open"
            size={22}
            color={MEDIUM_GRAY_TEXT}
            style={styles.toolbarIcon}
          />
          <MaterialCommunityIcons
            name="link-variant"
            size={22}
            color={MEDIUM_GRAY_TEXT}
            style={styles.toolbarIcon}
          />
          <SimpleLineIcons
            name="draw"
            size={18}
            color={MEDIUM_GRAY_TEXT}
            style={styles.toolbarIcon}
          />
        </View>

        <TextInput
          style={[styles.textInput, styles.descriptionInput]}
          multiline
          value={description}
          onChangeText={setDescription}
        />
        <View style={styles.descriptionFooter}>
          <Text style={styles.requiredText}>* Required field</Text>
          <Text style={styles.charCount}>{description.length}/2000</Text>
        </View>


          {/* 🌟 FUNCTIONAL TAGS */}
                <Text style={styles.inputLabel}>Tags *</Text>
                {renderTags()}
                <TextInput
                  style={styles.textInput}
                  placeholder="Add tags... (e.g., #event, #deadline)"
                  placeholderTextColor={LIGHT_GRAY_TEXT}
                  value={newTagInput}
                  onChangeText={setNewTagInput}
                  onSubmitEditing={handleTagInputSubmit} // Add tag on 'Enter'
                //  onBlur={handleTagInputSubmit} // Add tag on focus loss
                />
                <Text style={styles.tagHelperText}>
                  Press Enter or use a space/comma to add tags. Use # prefix for
                  hashtags.
                </Text>

        {/* --- 5. Switches --- */}
        <View style={styles.switchRow}>
          <View>
            <Text style={styles.switchTitle}>Allow Comments</Text>
            <Text style={styles.switchSubtitle}>
              Let audience members comment on this post
            </Text>
          </View>
          <Switch
            onValueChange={toggleComments}
            value={allowComments}
            trackColor={{ false: INPUT_BORDER, true: PRIMARY_ORANGE }}
            thumbColor={WHITE}
          />
        </View>

        <View style={styles.switchRow}>
          <View>
            <Text style={styles.switchTitle}>Send Push Notification</Text>
            <Text style={styles.switchSubtitle}>
              Notify selected audiences immediately
            </Text>
          </View>
          <Switch
            onValueChange={toggleNotification}
            value={sendNotification}
            trackColor={{ false: INPUT_BORDER, true: PRIMARY_ORANGE }}
            thumbColor={WHITE}
          />
        </View>
      </ScrollView>

      {/* --- Footer Buttons --- */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.publishButton]}
          onPress={handleCreatePost}
        >
          <Text style={styles.publishButtonText}>Publish Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- Stylesheet for CreatePost ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  // --- Header ---
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: INPUT_BORDER,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: DARK_GRAY_TEXT,
  },
  // --- ScrollView Content ---
  scrollViewContent: {
    padding: 20,
    paddingBottom: 100, // Ensure space for footer buttons
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: DARK_GRAY_TEXT,
    marginBottom: 8,
    marginTop: 15,
  },
  optionText: {
    fontSize: 16,
    color: DARK_GRAY_TEXT,
  },
  textInput: {
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: DARK_GRAY_TEXT,
    backgroundColor: WHITE,
  },
  // --- Audience Dropdown ---
  dropdownInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: WHITE,
  },
  optionItem: {
    paddingVertical: 10,
    backgroundColor: WHITE,
  },
  optionsContainer: {
    marginLeft: 10,
    marginTop: 5,
    maxHeight: 100,
  },
  audienceText: {
    flex: 1,
    fontSize: 14,
    color: DARK_GRAY_TEXT,
    padding: 0, // Reset default padding from TextInput
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  audienceChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "500",
  },
  // --- Media Upload ---
  mediaUploadBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    borderWidth: 2,
    borderColor: INPUT_BORDER,
    borderStyle: "dashed",
    borderRadius: 8,
    backgroundColor: MEDIA_UPLOAD_BG,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: "600",
    color: DARK_GRAY_TEXT,
    marginTop: 10,
  },
  uploadInfo: {
    fontSize: 12,
    color: LIGHT_GRAY_TEXT,
    marginTop: 5,
  },
  filesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  filePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LIGHT_BG,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  fileIcon: {
    fontSize: 12,
    fontWeight: "700",
    color: DARK_GRAY_TEXT,
    marginRight: 4,
  },
  fileName: {
    fontSize: 12,
    color: DARK_GRAY_TEXT,
    marginRight: 8,
  },
  // --- Rich Text Editor Mock ---
  toolbar: {
    flexDirection: "row",
    borderWidth: 1,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderColor: INPUT_BORDER,
    borderBottomWidth: 0,
    backgroundColor: LIGHT_BG,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  toolbarIcon: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  descriptionInput: {
    minHeight: 150,
    textAlignVertical: "top",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingVertical: 15,
  },
  descriptionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  requiredText: {
    fontSize: 12,
    color: PRIMARY_ORANGE,
    fontWeight: "500",
  },
  charCount: {
    fontSize: 12,
    color: LIGHT_GRAY_TEXT,
  },
  // --- Switches ---
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: INPUT_BORDER,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: DARK_GRAY_TEXT,
  },
  switchSubtitle: {
    fontSize: 12,
    color: MEDIUM_GRAY_TEXT,
    marginTop: 2,
  },
  // --- Footer Buttons ---
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: INPUT_BORDER,
    backgroundColor: WHITE,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: INPUT_BORDER,
  },
  cancelButtonText: {
    color: DARK_GRAY_TEXT,
    fontSize: 16,
    fontWeight: "600",
  },
  publishButton: {
    backgroundColor: PRIMARY_ORANGE,
  },
  publishButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: "600",
  },
  dropdownList: {
    position: "absolute",
    top: 52, // dropdownInput ki height ke hisaab se
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    maxHeight: 200,
    zIndex: 9999,
    elevation: 10, // ANDROID ke liye
  },
  // --- Tags ---
  tagChipsContainer: {flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10},
  tagDisplayChip: {
    backgroundColor: LIGHT_BG,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  tagHelperText: {fontSize: 12, color: LIGHT_GRAY_TEXT, marginTop: 5},
});

export default CreatePost;
