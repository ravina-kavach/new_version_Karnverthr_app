import React from 'react'
import {View,Text, StyleSheet} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import GlobalStyle from '../../../theme/globalstyle'

const SignIn = () => {
  return (
    <SafeAreaView style={GlobalStyle}>
    <View style={styles.container}>
        <Text>Sign in </Text>
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'red'
  }
})
export default SignIn