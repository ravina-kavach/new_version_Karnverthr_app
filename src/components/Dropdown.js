import React, { useMemo } from "react";
import { View, Image, StyleSheet, Platform } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { RowView, Label } from "../utils/common";
import { COLOR } from "../theme/theme";
import { ArrowDown } from "../assets/icons";
import { GlobalFonts } from "../theme/typography";
import { FontSize } from "../utils/metrics";

function Dropdown({ DropdownData = [], Selecteditem, setSelecteditem, type = null }) {
  if (!DropdownData.length) return null;

  const dropdownList = useMemo(
    () => DropdownData.slice(1),
    [DropdownData]
  );

  return (
    <SelectDropdown
      data={type === "Attendance" ? DropdownData : dropdownList}
      defaultValue={Selecteditem}
      onSelect={(selectedItem) => setSelecteditem(selectedItem)}
      dropdownStyle={styles.dropdown}
      dropdownOverlayColor="transparent"
      showsVerticalScrollIndicator={false}

      renderButton={(selectedItem, isOpened) => (
        <View style={styles.button}>
          <RowView style={styles.buttonRow}>
            <Label style={styles.text}>
              {selectedItem?.name ?? DropdownData[0]?.name}
            </Label>

            <Image
              source={ArrowDown}
              style={[
                styles.arrow,
                { transform: [{ rotate: isOpened ? "180deg" : "0deg" }] },
              ]}
            />
          </RowView>
        </View>
      )}

      renderItem={(item, index, isSelected) => (
        <View
          style={[
            styles.item,
            isSelected && styles.selectedItem,
            index !== dropdownList.length - 1 && styles.separator,
          ]}
        >
          <Label
            style={[
              styles.itemText,
              isSelected && styles.selectedText,
            ]}
          >
            {item.name}
          </Label>
        </View>
      )}
    />
  );
}

export default Dropdown;

const styles = StyleSheet.create({
  button: {
    height: 46,
    backgroundColor: COLOR.White1,
    borderRadius: 12,
    paddingHorizontal: 14,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },

  buttonRow: {
    justifyContent: "space-between",
    alignItems: "center",
  },

  text: {
    ...GlobalFonts.small,
    fontSize: FontSize.Font14,
    color: "#111827",
    fontWeight: "500",
  },

  arrow: {
    width: 16,
    height: 16,
    tintColor: "#6B7280",
  },

  dropdown: {
    borderRadius: 12,
    backgroundColor: COLOR.White1,
    borderColor:COLOR.dark5,
    borderWidth:2,
    paddingVertical: 5,
    marginTop:Platform.OS === 'android'? -24 : 0,
  },

  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLOR.White1,
  },

  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  selectedItem: {
    backgroundColor: "#F9FAFB", // light, not dark
  },

  itemText: {
    ...GlobalFonts.small,
    fontSize: FontSize.Font14,
    fontSize: 14,
    color: COLOR.Black1
  },

  selectedText: {
    fontWeight: "600",
  },
});

