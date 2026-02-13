import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { CommonView } from "../../../utils/common";
import { GlobalFonts } from "../../../theme/typography";
import { COLOR } from "../../../theme/theme";
import { useAdminMaster } from "./AdminMasterController";
import CommonList from '../../../components/CommonList';

const AdminMaster = () => {
  const { masterData, navigation } = useAdminMaster();

  return (
    <CommonView>
      <View style={styles.innerContainer}>
        <CommonList
          data={masterData}
          onPressItem={(item) => navigation.navigate(item.screen)}
        />
      </View>
    </CommonView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  innerContainer:{ flex: 1, paddingHorizontal: 20 },

  header: {
    ...GlobalFonts.subtitle,
    fontSize: 22,
    fontWeight: "700",
    color: COLOR.Black1,
    marginBottom: 20,
    marginTop: 10,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginBottom: 20,

    // // Shadow for iOS
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 3 },
    // shadowOpacity: 0.08,
    // shadowRadius: 4,

    // // Shadow for Android
    // elevation: 4,
  },

  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(0,122,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  itemText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
});

export default AdminMaster;
