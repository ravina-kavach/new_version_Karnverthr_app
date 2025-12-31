import { StyleSheet, Platform } from "react-native";

const GlobalStyle = StyleSheet.create({
   flexContainer: {
      flex: 1,
   },
   massageCotanier: {
      marginBottom: Platform.OS === 'android' ? 60 : 20,
   }
},
)

export default GlobalStyle