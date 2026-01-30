import { StyleSheet, Platform } from "react-native";

const GlobalStyle = StyleSheet.create({
   flexContainer: {
      flex: 1,
   },
   massageCotanier: {
      position: 'absolute',
      bottom:Platform.OS === 'android' ? 60 : 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      elevation: 9999,  
   }
},
)

export default GlobalStyle