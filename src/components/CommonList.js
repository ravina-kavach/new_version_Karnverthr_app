import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { GlobalFonts } from "../theme/typography";
import { COLOR } from "../theme/theme";

const CommonList = ({
  data = [],
  onPressItem,
  iconName = "layers-outline",
  containerStyle,
  cardStyle,
}) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.card, cardStyle]}
      onPress={() => onPressItem(item)}
    >
      {/* Icon */}
      <View style={styles.iconWrapper}>
        <Ionicons
          name={item.icon || iconName}
          size={20}
          color={COLOR.Primary1}
        />
      </View>

      {/* Title */}
      <View style={{ flex: 1 }}>
        <Text style={styles.itemText}>{item.title}</Text>
      </View>

       <Ionicons name="chevron-forward" size={18} color={COLOR.Secondary} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginBottom: 20,
  },

  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLOR.Secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  itemText: {
    ...GlobalFonts.subtitle,
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
});

export default CommonList;
