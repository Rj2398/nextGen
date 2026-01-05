import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Platform,
  Image,
  Alert,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import ImagePicker from "react-native-image-crop-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import store from "../../../store";
import { useSelector } from "react-redux";
import AddressCard from "../../components/user/AddressCard";
import { AddAddress } from "../../../assets/startUpImg";
import AddNewBar from "../../components/user/AddNewBar";
import useProfile from "../../../hooks/useProfile";

// --- Define Colors and Constants ---
const PRIMARY_COLOR = "#FFAF66"; // The custom orange color
const SURFACE_COLOR = "#FFFFFF";
const BACKGROUND_COLOR = "#F5F5F5";
const TEXT_COLOR = "#1F2937";
const PLACEHOLDER_COLOR = "#ADAEBC";
const BORDER_COLOR = "#E5E7EB";
const ACCENT_TEXT_COLOR = "#6B7280";

// --- Custom Components for Reusability ---

/**
 * Custom Input Component to handle common styling
 */
// const CustomTextInput = ({ label, placeholder, value, onChangeText, multiline,
//   keyboardType, required, style,  iconName}) => (

//   <View style={[styles.inputContainer, style]}>
//     {label && <Text style={styles.label}>{label} {required && <Text style={{ color: '#1F2937' }}>*</Text>}</Text>}
//     <TextInput
//       style={[styles.input, multiline && styles.multilineInput, { borderColor: BORDER_COLOR }]}
//       placeholder={placeholder}
//       placeholderTextColor={PLACEHOLDER_COLOR}
//       value={value}
//       onChangeText={onChangeText}
//       multiline={multiline}
//       keyboardType={keyboardType || 'default'}
//     />
//      {iconName && (
//         <MaterialIcons
//           name={iconName}
//           size={15}
//           color="#000"
//           style={{
//         position: 'absolute',
//         right: 10,
//         top: 35,
//         bottom: 0,
//         textAlignVertical: 'center', // center vertically
//       }}
//         />
//       )}
//   </View>
// );

const CustomTextInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  multiline,
  keyboardType,
  required,
  style,
  iconName,
  disabled = false,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios"); // iOS me picker visible rahega
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD
      onChangeText(formattedDate);
    }
  };

  // Determine if this is a date field
  const isDateField = label && label.toLowerCase().includes("date");

  return (
    <View style={[styles.inputContainer, style]}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={{ color: "#1F2937" }}>*</Text>}
        </Text>
      )}

      <View style={{ position: "relative" }}>
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            { borderColor: BORDER_COLOR, paddingRight: iconName ? 35 : 10 },
          ]}
          placeholder={placeholder}
          placeholderTextColor={PLACEHOLDER_COLOR}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          keyboardType={keyboardType || "default"}
          editable={!disabled}
        />

        {/* Icon ke click se date picker open */}
        {iconName && label.toLowerCase().includes("date") && (
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 10,
              top: 0,
              bottom: 0,
              justifyContent: "center",
            }}
            onPress={() => setShowDatePicker(true)}
          >
            <MaterialIcons name={iconName} size={18} color="#000" />
          </TouchableOpacity>
        )}

        {/* Lock or other icon for non-date fields (just display) */}
        {!isDateField && iconName && (
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 10,
              top: 0,
              bottom: 0,
              justifyContent: "center",
            }}
            onPress={() => setShowDatePicker(true)}
          >
            <MaterialIcons name={iconName} size={18} color="#000" />
          </TouchableOpacity>
        )}

        {showDatePicker && (
          <DateTimePicker
            value={value ? new Date(value) : new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>
    </View>
  );
};

const InstituteTypeSelect = ({
  value,
  onValueChange,
  label,
  required,
  options = [],
  placeholder = "Select",
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: "#1F2937" }]}>
        {label} {required && <Text style={{ color: "#1F2937" }}>*</Text>}
      </Text>
      <TouchableOpacity
        style={[styles.pickerContainer, { borderColor: BORDER_COLOR }]}
        onPress={() => setOpen(!open)}
      >
        <Text style={styles.pickerText}>{value || placeholder}</Text>
        <Image
          // 💡 Path Updated
          source={require("../../../assets/down_arrow_black.png")}
          style={styles.downImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
      {/* Mocking the opened state */}
      {open && (
        // <View style={styles.dropdownMock}>
        //   <Text style={styles.dropdownOption} onPress={() => { onValueChange('Male'); setOpen(false); }}>Male</Text>
        //   <Text style={styles.dropdownOption} onPress={() => { onValueChange('Female'); setOpen(false); }}>Female</Text>
        // </View>
        <View style={styles.dropdownMock}>
          {options.map((item, index) => (
            <Text
              key={index}
              style={styles.dropdownOption}
              onPress={() => {
                onValueChange(item.value);
                setOpen(false);
              }}
            >
              {item.label}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

/**
 * Collapsible Section Component
 */
const CollapsibleSection = ({ title, children, expanded: initialExpanded }) => {
  const [expanded, setExpanded] = useState(initialExpanded);

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity
        style={[
          styles.sectionHeader,
          { backgroundColor: PRIMARY_COLOR },
          { margin: 15 },
        ]}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <Image
          // 💡 Path Updated
          source={require("../../../assets/down_arrow.png")}
          style={styles.downImage}
          resizeMode="contain"
        />
        {/* <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={24} color="#FFF" /> */}
      </TouchableOpacity>
      {expanded && <View style={styles.sectionContent}>{children}</View>}
    </View>
  );
};

// --- Primary Screen Component ---

const PersonalInfo = ({ navigation }) => {
  const { userInfo } = store.getState().user;
  const { useTypeStore } = useSelector(({ user }) => user);
  console.log(useTypeStore, "useTypeStore");
  const [streetAddress, setStreetAddress] = useState("");
  const [line2Address, setline2Address] = useState("");
  const [addressId, setaddressId] = useState("");
  const [addressPhone, setaddressPhone] = useState("");
  const [addressName, setaddressName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState(userInfo?.user?.email);
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  // const { updatProfile, isLoadingupdate } = useUpdateProfile();
  // const { data, isError, error, isLoading } = useFetchProfile(); //const { data, isError, error, isLoading } = useFetchProfile();
  const { data, isLoading, isError, error, updatProfile } = useProfile();
  const [addresses, setAddresses] = useState([]);
  console.log("Addjfgjfgjfgjfgjress:", data);
  useEffect(() => {
    if (data?.items?.length > 0) {
      const profile = data.items[0].personalInformation;
      const address = data.items[0].addresses?.[0] || null;
      setAddresses(data.items[0].addresses || []);
      setName(profile?.firstName + " " + profile?.lastName);
      setPhone(profile?.mobileNumber || "");
      setDob(profile?.dateOfBirth || "");
      setGender(profile?.gender || "");
      const imageUri = profile?.profileImageUrl || null;
      setProfileImage(imageUri);

      if (useTypeStore !== "User") {
        setStreetAddress(address?.line1 || "");
        setline2Address(address?.line2 || "");
        setaddressName(address?.name || "");
        setaddressId(address?.addressId || "");
        setaddressPhone(address?.phone || "");
        setCity(address?.city || "");
        setState(address?.state || "");
        setZip(address?.pincode || "");
        setCountry(address?.country || "");
      }
    }
  }, [data]);

  if (isError) {
    // Option 1: Alert
    Alert.alert("Error", error.message || "Something went wrong");
  }

  // Show error alert only once when API fails
  // useEffect(() => {
  //   if (isError && error) {
  //     // Alert.alert("Error", error.message);
  //   }
  // }, [isError, error]);

  const handleAddImage = async () => {
    try {
      // Logic relies on the methods provided by the imported ImagePicker object
      const selectedImages = await ImagePicker.openPicker({
        multiple: false,
        mediaType: "photo",
      });

      // Set the picked image directly
      setProfileImage({ uri: selectedImages.path });
    } catch (error) {
      if (error.code === "E_PICKER_CANCELLED") {
        console.log("Image picker cancelled by user.");
      } else {
        Alert.alert(
          "Error selecting image",
          "Failed to access gallery. Check app permissions."
        );
        console.error("Image Picker Error:", error);
      }
    }
  };

  const handleUpdateProfile = async () => {
    const [firstName, ...rest] = name.split(" ");
    const lastName = rest.join(" ");
    const formData = new FormData();
    formData.append("Profile.PersonalInformation.firstName", firstName);
    formData.append("Profile.PersonalInformation.lastName", lastName);
    formData.append("Profile.PersonalInformation.dateOfBirth", dob);
    formData.append("Profile.PersonalInformation.gender", gender);
    formData.append("Profile.PersonalInformation.mobileNumber", phone);

    // Image field
    if (profileImage?.uri) {
      formData.append("Profile.PersonalInformation.profileImageUrl", {
        uri: profileImage.uri,
        type: profileImage.type || "image/jpeg",
        name: profileImage.fileName || "profileImageUrl.jpg",
      });
    }

    console.log("sfsdfsdfdsfds", formData);
    try {
      const response = await updatProfile(formData);
      if (response) Alert.alert(response?.message || "Update successful!");
    } catch (error) {
      console.log("$$$$$$$$$", error);
      Alert.alert("Error", error.message || "Update failed");
    }
  };

  const handleUpdateProfileAddress = async () => {
    const formData = new FormData();
    // Append each field to FormData
    formData.append("Profile.Addresses[0].addressId", addressId);
    formData.append("Profile.Addresses[0].name", addressName);
    formData.append("Profile.Addresses[0].line1", streetAddress);
    formData.append("Profile.Addresses[0].line2", line2Address);
    formData.append("Profile.Addresses[0].phone", addressPhone);
    formData.append("Profile.Addresses[0].city", city);
    formData.append("Profile.Addresses[0].state", state);
    formData.append("Profile.Addresses[0].pincode", zip);
    formData.append("Profile.Addresses[0].country", country);
    console.log("sfsdfsdfdsfds", formData);
    try {
      const response = await updatProfile(formData);
      if (response) {
        Alert.alert(response?.message || "Update successful!");
        setStreetAddress("");
        setline2Address("");
        setaddressName("");
        setaddressId("");
        setaddressPhone("");
        setCity("");
        setState("");
        setZip("");
        setCountry("");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Update failed");
    }
  };

  const handleUpdateHoleProfile = async () => {
    const [firstName, ...rest] = name.split(" ");
    const lastName = rest.join(" ");
    const formData = new FormData();
    formData.append("Profile.PersonalInformation.firstName", firstName);
    formData.append("Profile.PersonalInformation.lastName", lastName);
    formData.append("Profile.PersonalInformation.dateOfBirth", dob);
    formData.append("Profile.PersonalInformation.gender", gender);
    formData.append("Profile.PersonalInformation.mobileNumber", phone);
    formData.append("Profile.Addresses[0].addressId", addressId);
    formData.append("Profile.Addresses[0].name", addressName);
    formData.append("Profile.Addresses[0].line1", streetAddress);
    formData.append("Profile.Addresses[0].line2", line2Address);
    formData.append("Profile.Addresses[0].phone", addressPhone);
    formData.append("Profile.Addresses[0].city", city);
    formData.append("Profile.Addresses[0].state", state);
    formData.append("Profile.Addresses[0].pincode", zip);
    formData.append("Profile.Addresses[0].country", country);

    // Image field
    if (profileImage?.uri) {
      formData.append("Profile.PersonalInformation.profileImageUrl", {
        uri: profileImage.uri,
        type: profileImage.type || "image/jpeg",
        name: profileImage.fileName || "profileImageUrl.jpg",
      });
    }
    try {
      const response = await updatProfile(formData);
      if (response) Alert.alert(response?.message || "Update successful!");
    } catch (error) {
      console.log("$$$$$$$$$", error);
      Alert.alert("Error", error.message || "Update failed");
    }
  };

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ];

  const countryOptions = [
    { label: "India", value: "IN" },
    { label: "UAE", value: "AE" },
    { label: "USA", value: "US" },
  ];

  return (
    <View style={styles.container}>
      <Loader visible={isLoading} />
      {/* Header */}

      <Header title={"Personal Info"} onBackPress={true} />

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* 1. Main Information Section */}
        <CollapsibleSection title="Profile Details" expanded={true}>
          <TouchableOpacity
            style={styles.profileContainer}
            onPress={handleAddImage}
          >
            <Image
              source={
                profileImage
                  ? typeof profileImage === "string"
                    ? { uri: profileImage } // Image URL coming from API
                    : { uri: profileImage.uri } // Image selected from local device
                  : require("../../../assets/account_place.png") // Default placeholder image
              }
              style={styles.profileImage}
              resizeMode="cover"
            />

            <Text style={styles.avatarText}>Profile Photo</Text>
          </TouchableOpacity>

          <CustomTextInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Sarah Johnson"
          />

          <CustomTextInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="sarah.johnson@email.com"
            iconName="lock"
            disabled={true}
          />

          <CustomTextInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="+1 234 567 8900"
          />
          <CustomTextInput
            label="Date of Birth (Optional)"
            value={dob}
            onChangeText={setDob}
            placeholder="1990-05-15"
            iconName="calendar-today"
          />

          <InstituteTypeSelect
            label="Gender"
            value={gender}
            onValueChange={setGender}
            options={genderOptions}
            placeholder="Select Gender"
          />

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#F89941" }]}
              onPress={() => handleUpdateProfile()}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.outlineButton,
                { borderColor: "#E2E2E2", backgroundColor: "#FFF9F2" },
              ]}
              onPress={() => console.log("Cancel Main Info")}
            >
              <Text style={[styles.buttonTextcencel, { color: "#000000" }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </CollapsibleSection>

        {/* 2. Institute Address Section */}
        <CollapsibleSection title=" Address" expanded={true}>
          {useTypeStore === "User" && addresses?.length > 0 && (
            <View>
              {Array.isArray(addresses) &&
                addresses.length > 0 &&
                addresses.map((addr) => (
                  <AddressCard
                    key={addr.addressId}
                    address={addr}
                    onEdit={(address) => {
                      if (!address) {
                        console.log(
                          "EDIT ADDRESS: address is null or undefined"
                        );
                        return;
                      }
                      setStreetAddress(address?.line1 || "");
                      setline2Address(address?.line2 || "");
                      setaddressName(address?.name || "");
                      setaddressId(address?.addressId || "");
                      setaddressPhone(address?.phone || "");
                      setCity(address?.city || "");
                      setState(address?.state || "");
                      setZip(address?.pincode || "");
                      setCountry(address?.country || "");
                    }}
                    onDelete={() => {
                      Alert.alert("Delete clicked");
                    }}
                  />
                ))}
            </View>
          )}
          {useTypeStore === "User" && addresses?.length > 0 && (
            <AddNewBar
              onPress={() => {
                console.log("Add New clicked");
                // navigation / modal / bottom sheet yahin open karo
              }}
            />
          )}

          <CustomTextInput
            label="Street Address"
            required
            value={streetAddress}
            onChangeText={setStreetAddress}
            placeholder="Enter street address"
          />

          <View style={styles.row}>
            <CustomTextInput
              label="City"
              required
              value={city}
              onChangeText={setCity}
              placeholder="City"
              style={styles.halfInput}
            />
            <CustomTextInput
              label="State"
              required
              value={state}
              onChangeText={setState}
              placeholder="State"
              style={styles.halfInput}
            />
          </View>

          <View style={styles.row}>
            <CustomTextInput
              label="ZIP Code"
              required
              value={zip}
              onChangeText={setZip}
              keyboardType="numeric"
              placeholder="ZIP"
              style={styles.halfInput}
            />

            <View style={[styles.halfInput, { marginTop: 0 }]}>
              <InstituteTypeSelect
                label="Country"
                required
                value={country}
                onValueChange={setCountry}
                options={countryOptions}
                placeholder="Select Country"
              />
            </View>
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#F89941" }]}
              onPress={() => handleUpdateProfileAddress()}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.outlineButton,
                { borderColor: "#E2E2E2", backgroundColor: "#FFF9F2" },
              ]}
              onPress={() => console.log("Cancel Address")}
            >
              <Text style={[styles.buttonTextcencel, { color: "#000000" }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </CollapsibleSection>
        <View style={{ height: 30 }} />

        {useTypeStore !== "User" && (
          <View style={styles.buttonGroupButtom}>
            <TouchableOpacity
              style={[
                styles.buttonButtom,
                styles.outlineButtonButtom,
                { borderColor: "#E2E2E2", backgroundColor: "#FFF9F2" },
              ]}
              onPress={() => navigation.goBack()}
            >
              <Text style={[styles.buttonTextcencel, { color: "#000000" }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonButtom, { backgroundColor: "#F89941" }]}
              onPress={() => navigation.goBack()} //handleUpdateHoleProfile()
            >
              <Text style={styles.buttonText}>Discard</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// 💡 Path Updated for the localIcons definition
const localIcons = {
  account: require("../../../assets/account_email.png"),
  web: require("../../../assets/web.png"),
  phone: require("../../../assets/phone.png"),
  link: require("../../../assets/link.png"),
  // add more images here ⬆️
};

export default PersonalInfo;

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 50,
  },
  downImage: { width: 15, height: 15, marginEnd: 5 },
  profileImage: {
    width: 100,
    height: 100,
    marginBottom: 5,
    borderRadius: 100 / 2,
  },

  headerIconContainer: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: TEXT_COLOR,
    textAlign: "center",
    flex: 1,
  },

  // Section Styles
  sectionContainer: {
    backgroundColor: SURFACE_COLOR,
    borderRadius: 8,
    marginBottom: 20,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
      android: { elevation: 2 },
    }),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#FFAF66",
    borderRadius: 8,
    padding: 15,
  },
  sectionTitle: {
    color: "#FFF",
    fontWeight: "500",
    fontFamily: "Roboto",
    fontSize: 16,
  },
  sectionContent: {
    padding: 15,
  },

  // Main Info Styles
  profileContainer: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  avatarText: {
    fontSize: 12,
    fontFamily: "Roboto",
    fontWeight: 600,
    color: ACCENT_TEXT_COLOR,
  },

  // Custom Input Styles
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Inter",
    marginBottom: 4,
    marginTop: 10,
    color: "#1F2937",
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    fontFamily: "Inter",
    fontWeight: 500,
    paddingHorizontal: 12,
    minHeight: 56, // Matches standard outlined input height
    fontSize: 16,
    color: TEXT_COLOR,
    backgroundColor: SURFACE_COLOR,
  },
  inputcontact: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    fontFamily: "Inter",
    fontWeight: 500,
    paddingHorizontal: 12,
    minHeight: 56, // Matches standard outlined input height
    fontSize: 16,
    color: "#ADAEBC",
    borderColor: "#E5E7EB",
    marginStart: 10,
    backgroundColor: "#FFFFFF",
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: 12, // Ensure text starts at the top
    textAlignVertical: "top",
  },
  helperText: {
    marginTop: -15,
    marginBottom: 10,
    fontSize: 12,
    color: ACCENT_TEXT_COLOR,
  },
  descriptionInput: {
    marginBottom: 0, // CustomTextInput adds 15 by default, override it here
  },

  // Dropdown/Picker Mock Styles
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    padding: 12,
    borderRadius: 4,
    minHeight: 56,
  },
  pickerText: {
    fontSize: 16,
    color: TEXT_COLOR,
  },
  dropdownMock: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: SURFACE_COLOR,
    borderWidth: 1,
    borderColor: "#CCC",
    zIndex: 10,
    borderRadius: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
      android: { elevation: 2 },
    }),
  },
  dropdownOption: {
    padding: 10,
    fontSize: 16,
    color: TEXT_COLOR,
  },

  // Row Styles (for Address section)
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15, // Input container already has margin, but this spaces the rows
  },
  halfInput: {
    width: "48%",
    marginBottom: 0, // Ensure the row controls the spacing
  },

  // Button Group Styles
  buttonGroup: {
    flexDirection: "column",
    marginTop: 10,
  },
  button: {
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 10,
  },
  outlineButton: {
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  buttonText: {
    color: SURFACE_COLOR,
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonTextcencel: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 16,
  },

  // Contact Details Styles
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 5,
  },
  contactIcon: {
    marginRight: 10,
  },
  contactInput: {
    flex: 1,
    backgroundColor: SURFACE_COLOR,
    paddingHorizontal: 0,
    fontSize: 16,
    height: 40,
    marginStart: 10,
    color: TEXT_COLOR,
  },
  addMoreLink: {
    borderWidth: 1,
    borderColor: "#F97316",
    borderStyle: "dashed",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginStart: 10,
    justifyContent: "center",
  },
  buttonGroupButtom: {
    flexDirection: "row", // 👈 same line
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  buttonButtom: {
    flex: 1, // 👈 equal width
    paddingVertical: 12,
    marginLeft: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  outlineButtonButtom: {
    borderWidth: 1,
    // 👈 gap between buttons
  },
  arrowImage: { width: 100, height: 100, marginTop: 20 },
});
