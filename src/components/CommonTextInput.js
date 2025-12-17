import React from 'react'
import { Image, StyleSheet, TextInput } from 'react-native'
import { H5,H4 } from '../utils/common'
import { COLOR } from '../theme/theme'

export const CommonTextInput = (props) => {
  const {inputIcon,placeholder} = props
  return (
    <View>
    <H4 style={styles.titleContainer}>{t('Button.Sign_In')}</H4>
        <View style={styles.inputContainer}>
          {inputIcon &&<Image source={inputIcon} />}
          <TextInput
            placeholder={placeholder}
            placeholderTextColor={COLOR.TextSecondary}
            style={styles.input}
            onChangeText={onChangeText}
          />
        </View>
        {errorText && <H5 style={styles.errorText}></H5>}
    </View>    
  )
}

const styles = StyleSheet.create({
  errorText:{
    color:COLOR.Red
  }
})