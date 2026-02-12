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

const ENABLED_SCREENS = [ "master","adminAttendance", "adminEmployee", "adminLeave", "adminPayroll" ];

// const ENABLED_SCREENS = [ "master","adminAttendance", "adminEmployee", "adminLeave", "adminPayroll" ];
export const AdminRenderBox = ({ image, title, screen }) => {
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

        {image}
        <View style={styles.innerConainer}>
        {!isEnabled && (
        <Text style={styles.badgeText}>Coming soon</Text>
        )}
        <Text style={styles.title}>
          {title}
        </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    backgroundColor: COLOR.White1,
    padding: 18,
    height:responsiveHeight(12),
    marginBottom:20,
    marginHorizontal:10,
    maxHeight:300,
    borderRadius: 20,
    alignItems: "center",
    position: "relative",
  },
  innerConainer:{flex:1},

  title: {
    color: COLOR.Black1,
    ...GlobalFonts.subtitle,
    paddingLeft:20,
    width:'100%',
    fontSize: FontSize.Font15,
    // alignSelf:'center'
    // textAlign: "center",
  },

  disabledCard: {
    opacity: 0.7,
  },

  badgeText: {
    paddingLeft:20,
    color: COLOR.LightOrange,
    fontSize: FontSize.Font14,
    bottom:5,
    // textAlign:'left',
    fontWeight: "600",
  },
});
