import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";

const AddressCard = ({address, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

   if (!address) return null;
   const fullAddress = `${address.line1 || ""}${address.line2 ? ", " + address.line2 : ""}, ${address.city || ""}, ${address.state || ""} ${address.pincode || ""}, ${address.country || ""}`;

  return (
    <View style={styles.sectionContainer}>
          <View style={styles.card}>
      {/* Top Row */}
      <View style={styles.topRow}>
        <View style={styles.left}>
          {/* <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>Default</Text>
          </View> */}
          {address.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>Default</Text>
              </View>
            )}
          <Text style={styles.title}>{address.name || "Home"}</Text>
        </View>

        <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
          <Entypo name="dots-three-vertical" size={16} color="#777" />
        </TouchableOpacity>
      </View>

      {/* Address */}
      <Text style={styles.address}>
        {fullAddress}
      </Text>

      {/* Action Menu */}
      {showMenu && (
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setShowMenu(false);
              onEdit && onEdit(address);
            }}
          >
            <Text style={styles.menuText}>Edit</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setShowMenu(false);
              onDelete && onDelete();
            }}
          >
            <Text style={[styles.menuText]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
    </View>
  
  );
};

export default AddressCard;
const styles = StyleSheet.create({
     sectionContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  card: {
    padding: 6,
    marginHorizontal: 8,
    marginTop: 6,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  defaultBadge: {
    backgroundColor: "#FFEDD5",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    marginRight: 8,
  },
  defaultText: {
    fontSize: 11,
    color: "#F97316",
    fontWeight: "500",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B5563",
  },
  address: {
    fontSize: 16,
    color: "#4B5563",
    marginTop:10,
    lineHeight: 18,
    marginBottom:10,
  },
  menu: {
    position: "absolute",
    top: 35,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    width: 110,
    zIndex: 10,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  menuText: {
    fontSize: 14,
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
  },
});
