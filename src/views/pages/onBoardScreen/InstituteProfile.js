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
  PermissionsAndroid,
  Alert,
  Button,
} from "react-native";
import Header from "../../components/Header";
import useFetchAcademia from "../../../hooks/useFetchAcademia";
import Loader from "../../components/Loader";
import ImagePicker from "react-native-image-crop-picker";
import useInstitute from "../../../hooks/useInstitute";
import { pick } from '@react-native-documents/picker'



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
const CustomTextInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  multiline,
  keyboardType,
  required,
  style,
}) => (
  <View style={[styles.inputContainer, style]}>
    {label && (
      <Text style={styles.label}>
        {label} {required && <Text style={{ color: "#1F2937" }}>*</Text>}
      </Text>
    )}
    <TextInput
      style={[
        styles.input,
        multiline && styles.multilineInput,
        { borderColor: BORDER_COLOR },
      ]}
      placeholder={placeholder}
      placeholderTextColor={PLACEHOLDER_COLOR}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      keyboardType={keyboardType || "default"}
    />
  </View>
);

/**
 * Mock component for a Dropdown/Picker
 */
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

const InstituteProfile = ({ navigation }) => {
  //const { updatInstituteProfile, isLoadingupdate } = updateInstitute();
  const {updatInstituteProfile,updateAddressApi,updateBankApi,
    updateDocumentsApi,isLoadingupdate,} = useInstitute();
  // --- State for Form Fields ---
  const [instituteName, setInstituteName] = useState("");
  const [instituteType, setInstituteType] = useState("");
  const [establishmentYear, setEstablishmentYear] = useState("");
  const [description, setDescription] = useState("");
  const [emirates_id, setemiratesId] = useState("");
  const [trade_license_number, settradeLicenseNumber] = useState("");
  const [permission_type, setpermissionType] = useState("");
  const [logo, setLogo] = useState(null);

  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("Country");
   const [building_name, setbuildingname] = useState("");
   const [area_locality, setarealocality] = useState("");

  const [email, setEmail] = useState("instituinfo@email.com");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("www.instinfo.com");
  const [linkedin, setLinkedin] = useState("linkedin.com/company/instinfo");

  const [bankName, setbankName] = useState("");
  const [accountNumber, setaccountNumber] = useState("");
   const [accountHolderName, setaccountHolderName] = useState("");
   const [ifscCode, setifscCode] = useState("");
  const [ibanNumber, setibanNumber] = useState("");
    const [selectBankFile, setselectBankFile] = useState(null);
  const [bankStatement, setbankStatement] = useState(null);
  const [accreditationCertificate, setaccreditationCertificate] = useState(null);
  const [instituteRegistrationCertificate, setinstituteRegistrationCertificate] = useState(null);
  const [instituteEducationalLicense, setinstituteEducationalLicense] = useState(null);
  const [tradeLicense, settradeLicense] = useState(null);
   const [selectinstituteRegistrationCertificateFile, setselectinstituteRegistrationCertificateFile] = useState(null);
    const [selectaccreditationCertificateFile, setselectaccreditationCertificateFile] = useState(null);
     const [selectinstituteEducationalLicenseFile, setselectinstituteEducationalLicenseFile] = useState(null);
     const [selecttradeLicenseFile, setselecttradeLicenseFile] = useState(null);

  const { data, isLoading, error } = useFetchAcademia();
  useEffect(() => {
    if (data?.items?.length > 0) {
      const information = data.items[0].basic_information;
      const institutionDetails = information?.InstitutionDetails;
      setInstituteName(institutionDetails?.institution_name || "");
      setInstituteType(institutionDetails?.institution_type || "");
      setEstablishmentYear(institutionDetails?.established_year || "");
      setDescription(institutionDetails?.description || "");
      setemiratesId(institutionDetails?.emirates_id || "");
      settradeLicenseNumber(institutionDetails?.trade_license_number || "");
      setpermissionType(institutionDetails?.permission_type || "");
    const imageUri = institutionDetails?.profile_image_url || null;
      setLogo(imageUri);
       const address = data.items[0]?.academia_address_details;
      const instituteaddress = address?.AddressInformation?.[0] || null;
      setStreetAddress(instituteaddress?.street_name || "");
      setCity(instituteaddress?.city || "");
      setState(instituteaddress?.province || "");
      setZip(instituteaddress?.postal_code || "");
      setCountry(instituteaddress?.country || "");
       setbuildingname(instituteaddress?.building_name || "");
        setarealocality(instituteaddress?.area_locality || "");
        console.log("Addjfgjfgjfgjfgjress:", institutionDetails);
      const contact = data.items[0].contact_verification;
      const institutioncontact = contact?.ContactVerification;
      setEmail(institutionDetails?.institution_email || "");
      setPhone(institutionDetails?.institution_phone || "");
      setWebsite(institutionDetails?.website_url || "");
      setLinkedin(institutioncontact?.country || "");
      const bank = data.items[0].banking_setup;
      const institutionbank = bank?.BankingInformation;
      setbankName(institutionbank?.bank_name || "");
      setaccountNumber(institutionbank?.bank_account_number || "");
      setibanNumber(institutionbank?.iban_number || "");
       setbankStatement(institutionbank?.iban_certificate || "");
       setaccountHolderName(institutionbank?.account_holder_name || "");
        setifscCode(institutionbank?.ifsc_code || "");


 const document = data.items[0].document_verification;
        const requiredDocuments = document?.RequiredDocuments;
        setinstituteRegistrationCertificate(requiredDocuments?.institute_registration_certificate || "");
        setaccreditationCertificate(requiredDocuments?.accreditation_certificate || "");
       setinstituteEducationalLicense(requiredDocuments?.institute_educational_license || "");
      console.log("Academia Data:", document);
    }
  }, [data]);
  const countryOptions = [
    { label: "India", value: "IN" },
    { label: "UAE", value: "AE" },
  ];
  const instituteTypeOptions = [
    { label: "School", value: "School" },
    { label: "College", value: "College" },
  ];

  const handleAddImage = async () => {
    try {
      // Logic relies on the methods provided by the imported ImagePicker object
      const selectedImages = await ImagePicker.openPicker({
        multiple: false,
        mediaType: "photo",
      });

      // Set the picked image directly
      setLogo({ uri: selectedImages.path });
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

//  const pickDocument = async (docType) => {
//   console.log("pickDocument",docType)
//   try {
//     const result = await DocumentPicker.pickSingle({
//       type: [DocumentPicker.types.allFiles],
//     });

//     console.log('Picked file:', result);
//      // type ke hisaab se state set
//     switch (docType) {
//       case 'BANK_STATEMENT':
//         setselectBankFile(result);
//         break;

//       case 'REGISTER_CER':
//         setselectinstituteRegistrationCertificateFile(result);
//         break;

//       case 'ACCREDITATION_DOC':
//         setselectaccreditationCertificateFile(result);
//         break;

//          case 'TAX_DOCUMENTS':
//         setselectinstituteEducationalLicenseFile(result);
//         break;
//          case 'TRADE_LICENSE':
//         setselecttradeLicenseFile(result);
//         break;

//       default:
//         console.warn('Unknown document type');
//     }
  
//     return result;

//   } catch (error) {
//     if (DocumentPicker.isCancel(error)) {
//       console.log('User cancelled document picker');
//     } else {
//       console.error('Document Picker Error:', error);
//     }
//   }
// };

const pickDocument = async (docType) => {
  console.log("pickDocument", docType);
  try {
    // single file pick
    const [result] = await pick(); 
    // agar aap import mode chahte ho:
    // const [result] = await pick({ mode: 'import' });

    if (!result) {
      console.log('No file selected');
      return;
    }

    console.log('Picked file:', result);

    // 🔹 docType ke hisaab se state set
    switch (docType) {
      case 'BANK_STATEMENT':
        setselectBankFile(result);
        break;

      case 'REGISTER_CER':
        setselectinstituteRegistrationCertificateFile(result);
        break;

      case 'ACCREDITATION_DOC':
        setselectaccreditationCertificateFile(result);
        break;

      case 'TAX_DOCUMENTS':
        setselectinstituteEducationalLicenseFile(result);
        break;

      case 'TRADE_LICENSE':
        setselecttradeLicenseFile(result);
        break;

      default:
        console.warn('Unknown document type');
    }

    return result;

  } catch (error) {
    // cancel ya error handling
    if (error?.code === 'DOCUMENT_PICKER_CANCELED') {
      console.log('User cancelled document picker');
    } else {
      console.error('Document Picker Error:', error);
    }
  }
};


  const handleUpdateProfile = async () => {

     if (!instituteName) {
  Alert.alert("Error", "Institution name is required");
  return;
}
    if (!instituteType) {
  Alert.alert("Error", "Institution type is required");
  return;
}
    const formData = new FormData();
    formData.append(
      "Academia_BasicInformation.InstitutionDetails.institution_name",
      instituteName
    );

    formData.append(
      "Academia_BasicInformation.InstitutionDetails.institution_type",
      instituteType
    );

    formData.append(
      "Academia_BasicInformation.InstitutionDetails.website_url",
      website
    );

    formData.append(
      "Academia_BasicInformation.InstitutionDetails.institution_email",
      email
    );

    formData.append(
      "Academia_BasicInformation.InstitutionDetails.institution_phone",
      phone
    );

    formData.append(
      "Academia_BasicInformation.InstitutionDetails.emirates_id",
      emirates_id
    );

    formData.append(
      "Academia_BasicInformation.InstitutionDetails.trade_license_number",
      trade_license_number
    );

    formData.append(
      "Academia_BasicInformation.InstitutionDetails.permission_type",
      permission_type
    );
    formData.append(
      "Academia_BasicInformation.InstitutionDetails.established_year",
      establishmentYear
    );
    formData.append(
      "Academia_BasicInformation.InstitutionDetails.description",
      description
    );

    // Image field
    if (logo?.uri) {
      formData.append(
        "Academia_BasicInformation.InstitutionDetails.logo_url",
        {
          uri: logo.uri,
          type: logo.type || "image/jpeg",
          name: logo.fileName || "logo_url.jpg",
        }
      );
    }
    console.log("sfsdfsdfdsfds", formData);
    try {
      const response = await updatInstituteProfile(formData);
      if (response) Alert.alert(response?.message || "Update successful!");
    } catch (error) {
     // console.log("$$$$$$$$$", error.message);
      Alert.alert("Error", error.message || "Update failed");
    }
  };


  const validateAddress = ({
  streetAddress,
  city,
  state,
  zip,
  country,
}) => {
  if (!streetAddress || streetAddress.trim().length < 3) {
    return 'Please enter a valid street name';
  }

  if (!city || city.trim().length < 2) {
    return 'Please enter a valid city';
  }

  if (!state || state.trim().length < 2) {
    return 'Please enter a valid state/province';
  }

  if (!zip || !/^[0-9]{4,10}$/.test(zip)) {
    return 'Please enter a valid ZIP / Postal Code';
  }

  if (!country || country.trim().length < 2) {
    return 'Please enter a valid country';
  }

  return null; // ✅ No error
};



 const handleUpdateAddress = async () => {

  const error = validateAddress({
  streetAddress,
  city,
  state,
  zip,
  country,
});

if (error) {
  Alert.alert('Validation Error', error);
  return;
}
    const formData = new FormData();

    formData.append(
  "Academia_AddressDetails.AddressInformation.building_name",
 building_name && building_name.trim() !== "" ? building_name : "building_name"
);

formData.append(
  "Academia_AddressDetails.AddressInformation.street_name",
  streetAddress
);

formData.append(
  "Academia_AddressDetails.AddressInformation.area_locality",
  area_locality && area_locality.trim() !== "" ? area_locality : "area_locality"
);

formData.append(
  "Academia_AddressDetails.AddressInformation.city",
  city
);

formData.append(
  "Academia_AddressDetails.AddressInformation.province",
  state
);

formData.append(
  "Academia_AddressDetails.AddressInformation.postal_code",
  zip
);

formData.append(
  "Academia_AddressDetails.AddressInformation.country",
  country
);


// const payload = {
//   Academia_AddressDetails: {
//     AddressInformation: {
//       building_name:
//         building_name && building_name.trim() !== ""
//           ? building_name
//           : "building_name",

//       street_name: streetAddress,

//       area_locality:
//         area_locality && area_locality.trim() !== ""
//           ? area_locality
//           : "area_locality",

//       city: city,
//       province: state,
//       postal_code: zip,
//       country: country,
//     },
//   },
// };

    console.log("sfsdfsdfdsfds", formData);
    try {
      const response = await updateAddressApi(formData);
      if (response) Alert.alert(response?.message || "Update successful!");
    } catch (error) {
     // console.log("$$$$$$$$$", error.message);
      Alert.alert("Error", error.message || "Update failed");
    }
  };

    const handleUpdateBank = async () => {
    if (!bankName) {
  Alert.alert("Error", "Bank name is required");
  return;
}
 if (!accountNumber) {
  Alert.alert("Error", "Account number is required");
  return;
}
 if (!ibanNumber) {
  Alert.alert("Error", "Iban number is required");
  return;
}
    const formData = new FormData();
    formData.append(
      "Academia_BankingSetup.BankingInformation.bank_name",
      bankName
    );

    formData.append(
      "Academia_BankingSetup.BankingInformation.bank_account_number",
      accountNumber
    );

    formData.append(
      "Academia_BankingSetup.BankingInformation.iban_number",
      ibanNumber
    );

    formData.append(
  "Academia_BankingSetup.BankingInformation.account_holder_name",
  accountHolderName && accountHolderName.trim() !== "" ? accountHolderName : "ABC International School"
);
  formData.append(
  "Academia_BankingSetup.BankingInformation.ifsc_code",
  ifscCode && ifscCode.trim() !== "" ? ifscCode : "ICIC0A1B2C4"
);
    // Image field
    if (selectBankFile?.uri) {
      const fileUri = selectBankFile.fileCopyUri || selectBankFile.uri;
      formData.append(
        "Academia_BankingSetup.BankingInformation.iban_certificate",
        {
          uri: fileUri,
          name: selectBankFile.name,
          type: selectBankFile.type || 'application/octet-stream',
        }
      );
    }
    console.log("sfsdfsdfdsfds", formData);
    try {
      const response = await updateBankApi(formData);
      if (response) Alert.alert(response?.message || "Update successful!");
    } catch (error) {
      Alert.alert("Error", error.message || "Update failed");
    }
  };


   const handleUpdateDocuments = async () => {
    if (selectinstituteRegistrationCertificateFile==null) {
  Alert.alert("Error", "Registration certificate is required");
  return;
}
 if (selectaccreditationCertificateFile==null) {
  Alert.alert("Error", "Accreditation documents is required");
  return;
}
 if (selectinstituteEducationalLicenseFile==null) {
  Alert.alert("Error", "Tax documents is required");
  return;
}
 if (selecttradeLicenseFile==null) {
  Alert.alert("Error", "Trade license is required");
  return;
}

    const formData = new FormData();
    // Image field
    if (selectinstituteRegistrationCertificateFile?.uri) {
      const fileUri = selectinstituteRegistrationCertificateFile.fileCopyUri || 
      selectinstituteRegistrationCertificateFile.uri;
      formData.append(
        "Academia_DocumentVerification.RequiredDocuments.institute_registration_certificate",
        {
          uri: fileUri,
          name: selectinstituteRegistrationCertificateFile.name,
          type: selectinstituteRegistrationCertificateFile.type || 'application/octet-stream',
        }
      );
    }
     if (selecttradeLicenseFile?.uri) {
      const fileUri = selecttradeLicenseFile.fileCopyUri || 
      selecttradeLicenseFile.uri;
      formData.append(
        "Academia_DocumentVerification.RequiredDocuments.trade_license",
        {
          uri: fileUri,
          name: selecttradeLicenseFile.name,
          type: selecttradeLicenseFile.type || 'application/octet-stream',
        }
      );
    }
      if (selectaccreditationCertificateFile?.uri) {
      const fileUri = selectaccreditationCertificateFile.fileCopyUri || 
      selectaccreditationCertificateFile.uri;
      formData.append(
        "Academia_DocumentVerification.RequiredDocuments.accreditation_certificate",
        {
          uri: fileUri,
          name: selectaccreditationCertificateFile.name,
          type: selectaccreditationCertificateFile.type || 'application/octet-stream',
        }
      );
    }
    if (selectinstituteEducationalLicenseFile?.uri) {
      const fileUri = selectinstituteEducationalLicenseFile.fileCopyUri || 
      selectinstituteEducationalLicenseFile.uri;
      formData.append(
        "Academia_DocumentVerification.RequiredDocuments.institute_educational_license",
        {
          uri: fileUri,
          name: selectinstituteEducationalLicenseFile.name,
          type: selectinstituteEducationalLicenseFile.type || 'application/octet-stream',
        }
      );
    }
    console.log("sfsdfsdfdsfds", formData);
    try {
      const response = await updateDocumentsApi(formData);
      if (response) Alert.alert(response?.message || "Update successful!");
    } catch (error) {
      Alert.alert("Error", error.message || "Update failed");
    }
  };




  return (
    <View style={styles.container}>
      <Loader visible={isLoading || isLoadingupdate} />
      {/* Header */}

      <Header title={"Institute Info"} onBackPress={true} />

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* 1. Main Information Section */}
        <CollapsibleSection title="Main Information" expanded={true}>
          <TouchableOpacity
            style={styles.profileContainer}
            onPress={handleAddImage}
          >
            <Image
  source={
    logo
      ? typeof logo === "string"
        ? { uri: logo }        // Image URL coming from API
        : { uri: logo.uri }    // Image selected from local device
      : require("../../../assets/account_place.png") // Default placeholder image
  }
  style={styles.profileImage}
  resizeMode="cover"
/>


            <Text style={styles.avatarText}>Institute Logo</Text>
          </TouchableOpacity>

          <CustomTextInput
            label="Institute Name"
            required
            value={instituteName}
            onChangeText={setInstituteName}
            placeholder="Enter institute name"
          />

          <InstituteTypeSelect
            label="Institute Type"
            required
            value={instituteType}
            onValueChange={setInstituteType}
            options={instituteTypeOptions}
            placeholder="Select Institute"
          />

          <CustomTextInput
            label="Establishment Year"
            value={establishmentYear}
            onChangeText={setEstablishmentYear}
            keyboardType="numeric"
            placeholder="YYYY"
          />

          {/* Helper Text */}
          <Text style={styles.helperText}>
            When was your institute established?
          </Text>

          <CustomTextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            style={styles.descriptionInput}
            placeholder="Write a brief description of your institute..."
          />

          <CustomButtonGroup
            buttons={[
              { title: "Save", onPress: () => handleUpdateProfile() },
              {
                title: "Cancel",
                onPress: () => console.log("Cancel Address"),
                outline: true,
              },
            ]}
          />
        </CollapsibleSection>

        {/* 2. Institute Address Section */}
        <CollapsibleSection title="Institute Address" expanded={true}>
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

          <CustomButtonGroup
            buttons={[
              { title: "Save", onPress: () => handleUpdateAddress()},
              {
                title: "Cancel",
                onPress: () => console.log("Cancel Address"),
                outline: true,
              },
            ]}
          />
        </CollapsibleSection>

        {/* 3. Contact Details Section */}
        <CollapsibleSection title="Contact Details" expanded={true}>
          {[
            { icon: "account", value: email, setter: setEmail },
            { icon: "phone", value: phone, setter: setPhone },
            { icon: "web", value: website, setter: setWebsite },
            // { icon: "link", value: linkedin, setter: setLinkedin },
          ].map((item, index) => (
            <View key={index} style={styles.contactRow}>
              {/* <Icon name={item.icon} size={24} color={PRIMARY_COLOR} style={styles.contactIcon} /> */}
              <Image
                // 💡 Path Updated for localIcons object
                source={localIcons[item.icon]}
                style={{
                  width: 40,
                  height: 40,
                }}
                resizeMode="contain"
              />

              <TextInput
                value={item.value}
                onChangeText={item.setter}
                style={styles.inputcontact}
                placeholderTextColor={PLACEHOLDER_COLOR}
              />
            </View>
          ))}

          <TouchableOpacity style={styles.addMoreLink}>
            <Text style={{ color: "#F97316", fontSize: 14 }}>
              + Add more link
            </Text>
          </TouchableOpacity>
          <CustomButtonGroup
            buttons={[
              { title: "Save", onPress: () => handleUpdateProfile()},
              {
                title: "Cancel",
                onPress: () => console.log("Cancel Address"),
                outline: true,
              },
            ]}
          />
        </CollapsibleSection>

        {/* 2. Upload Documents Section */}
        <CollapsibleSection title="Upload Documents" expanded={true}>
          <FileUploadArea
            title="Registration Certificate *"
            icon={require("../../../assets/upload_bulk.png")}
            uploadText="Upload registration certificate"
            hintText="PDF, JPG, PNG (Max 5MB)"
            onPress={() => pickDocument("REGISTER_CER")}
          />

          <FileUploadArea
            title="Accreditation Documents"
            icon={require("../../../assets/startUpImg/png/ic_doc.png")}
            uploadText="Upload accreditation documents"
            hintText="PDF, DOC, DOCX (Max 10MB)"
             onPress={() => pickDocument("ACCREDITATION_DOC")}
          />
          <FileUploadArea
            title="Tax Documents"
            icon={require("../../../assets/startUpImg/png/ic_tex_doc.png")}
            uploadText="Upload tax documents"
            hintText="PDF (Max 5MB)"
             onPress={() => pickDocument("TAX_DOCUMENTS")}
          />

           <FileUploadArea
            title="Trade License Documents"
            icon={require("../../../assets/startUpImg/png/ic_tex_doc.png")}
            uploadText="Upload tax documents"
            hintText="PDF (Max 5MB)"
             onPress={() => pickDocument("TRADE_LICENSE")}
          />

          <CustomButtonGroup
            buttons={[
              { title: "Save", onPress: () => handleUpdateDocuments() },
              {
                title: "Cancel",
                onPress: () => console.log("Cancel Address"),
                outline: true,
              },
            ]}
          />
        </CollapsibleSection>

        {/* 2. Banking Details Section */}
        <CollapsibleSection title="Banking Details" expanded={true}>
          <CustomTextInput
            label="Bank Name"
            required
            value={bankName}
            onChangeText={setbankName}
            placeholder="Enter bank name"
          />

          <CustomTextInput
            label="Account Number"
            required
            value={accountNumber}
            onChangeText={setaccountNumber}
            placeholder="Enter account number"
          />
          {/* Helper Text */}
          <Text style={styles.helperText}>
            Your account information is encrypted and secure
          </Text>
          <CustomTextInput
            label="Iban Number"
            required
            value={ibanNumber}
            onChangeText={setibanNumber}
            placeholder="Enter iban number"
          />

          <FileUploadArea
            title="Bank Statement"
            icon={require("../../../assets/startUpImg/png/ic_bank.png")}
            uploadText="Upload recent bank statement"
            hintText="PDF (Max 5MB, Last 3 months)"
            onPress={() => pickDocument("BANK_STATEMENT")}
          />
          {/* 
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#F89941" }]}
              onPress={() => console.log("Save Address")}
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
          </View> */}
          <CustomButtonGroup
            buttons={[
              { title: "Save", onPress: () => handleUpdateBank() },
              {
                title: "Cancel",
                onPress: () => console.log("Cancel Address"),
                outline: true,
              },
            ]}
          />
        </CollapsibleSection>

        <View style={{ height: 30 }} />

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
              Discard
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonButtom, { backgroundColor: "#F89941" }]}
            onPress={() => navigation.goBack()} //handleUpdateHoleProfile()
          >
            <Text style={styles.buttonText}>Save & Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const CustomButtonGroup = ({ buttons }) => {
  return (
    <View style={styles.buttonGroup}>
      {buttons.map((btn, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.button,
            btn.outline
              ? [
                  styles.outlineButton,
                  {
                    borderColor: btn.borderColor || "#E2E2E2",
                    backgroundColor: "#FFF9F2",
                  },
                ]
              : { backgroundColor: btn.backgroundColor || "#F89941" },
          ]}
          onPress={btn.onPress}
        >
          <Text
            style={[
              styles.buttonText,
              btn.outline && { color: btn.textColor || "#000000" },
            ]}
          >
            {btn.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const FileUploadArea = ({ title, icon, uploadText, hintText, onPress }) => {
  return (
    <>
      {/* Title */}
      {title && (
        <Text
          style={{
            color: "#1F2937",
            fontSize: 14,
            marginTop: 10,
            fontWeight: "500",
          }}
        >
          {title}
        </Text>
      )}

      <TouchableOpacity style={styles.uploadBox} onPress={onPress}>
        {/* Icon */}
        {icon && (
          <Image
            source={icon}
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
          />
          // <Image
          //   source={icon}
          //   style={{ width: 40, height: 40 }}
          //   resizeMode="contain"
          // />
        )}

        {/* Upload Text */}
        {uploadText && (
          <Text style={styles.uploadText}>
            <Text style={styles.uploadLinkText}>{uploadText}</Text>
          </Text>
        )}

        {/* Hint Text */}
        {hintText && (
          <Text style={{ color: "#9CA3AF", fontSize: 12 }}>{hintText}</Text>
        )}
      </TouchableOpacity>
    </>
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

export default InstituteProfile;

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  uploadText: {
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
  uploadLinkText: {
    color: "#6B7280",
    fontWeight: "500",
  },
  uploadBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#E6E6E6",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 5,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
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
    paddingHorizontal: 12,
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
});
