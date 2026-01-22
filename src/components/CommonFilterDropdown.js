import React from 'react';
import { View, StyleSheet } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { Label } from '../utils/common';
import { COLOR } from '../theme/theme';
import { GlobalFonts } from '../theme/typography';
import { FontSize } from '../utils/metrics';
import { SortIcon } from '../assets/svgs';

function CommonFilterDropdown({
  data = [],
  selectedItem,
  setSelectedItem,
}) {
  if (!data.length) return null;

  return (
    <SelectDropdown
      data={data}
      defaultValue={selectedItem}
      onSelect={(item) => setSelectedItem(item)}
      dropdownOverlayColor="transparent"
      showsVerticalScrollIndicator={false}
      dropdownStyle={styles.dropdown}
      dropdownZIndex={9999}
      dropdownZIndexInverse={9999}
      statusBarTranslucent={true}
      renderButton={(selected, isOpened) => (
        <View style={styles.filterButton}>
          <SortIcon
            style={{
              transform: [{ rotate: isOpened ? '180deg' : '0deg' }],
            }}
          />
        </View>
      )}
      renderItem={(item, index, isSelected) => (
        <View
          style={[
            styles.item,
            isSelected && styles.selectedItem,
            index !== data.length - 1 && styles.separator,
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

export default CommonFilterDropdown;

const styles = StyleSheet.create({
  dropdown: {
    width: 220,                 
    backgroundColor: COLOR.White1,
    borderRadius: 12,
    paddingVertical: 6,
    elevation: 12,        
    marginTop: 10, 
    marginLeft: -190, 
  },

  filterButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  selectedItem: {
    backgroundColor: '#F9FAFB',
  },

  itemText: {
    ...GlobalFonts.small,
    fontSize: FontSize.Font14,
    color: COLOR.Black1,
  },

  selectedText: {
    fontWeight: '600',
  },
});