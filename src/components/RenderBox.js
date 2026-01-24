import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLOR } from "../theme/theme";
import { FontSize, responsiveHeight, responsiveWidth } from "../utils/metrics";
import { GlobalFonts } from "../theme/typography";

const ENABLED_SCREENS = ["attendance", "leaves","expenses", "calender", "approvals", "shiftTiming", "paySlip" ];
// const ENABLED_SCREENS = ["attendance", "leaves", "expenses", "calender", "approvals"];

export const RenderBox = ({ image, title, screen }) => {
  const navigation = useNavigation();

  const isEnabled = ENABLED_SCREENS.includes(screen);

  const onPress = () => {
    if (isEnabled) {
      navigation.navigate(screen);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={isEnabled ? 0.7 : 1}
      onPress={onPress}
      disabled={!isEnabled}
    >
      <View
        style={[
          styles.container,
          !isEnabled && styles.disabledCard,
        ]}
      >
        {!isEnabled && (
            <Text style={styles.badgeText}>Coming soon</Text>
        )}

        {image}

        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.White1,
    padding: 20,
    width:responsiveWidth(28),
    height:responsiveHeight(14),
    maxHeight:300,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "space-around",
    position: "relative",
  },

  title: {
    color: COLOR.Black1,
    ...GlobalFonts.subtitle,
    fontSize: FontSize.Font14,
    textAlign: "center",
  },

  disabledCard: {
    opacity: 0.7,
  },

  badgeText: {
    color: COLOR.LightOrange,
    fontSize: FontSize.Font10,
    bottom:5,
    fontWeight: "600",
  },
});
