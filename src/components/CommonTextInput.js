import React from 'react'
import { Image, StyleSheet, TextInput ,View,TouchableOpacity} from 'react-native'
import { COLOR } from '../theme/theme'
import {Valide} from '../utils/common'
import { responsiveWidth } from '../utils/metrics'
export const CommonTextInput = (props) => {
  const {leftIcon,rightIcon, value,rightIconPress,placeholder,secureTextEntry,onChangeText,errorMassage, inputContainerStyle, textInputStyle} = props
  return (
    <View>
       <View style={[styles.inputContainer,inputContainerStyle]}>
          {leftIcon && <Image source={leftIcon} />}
          <TextInput
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            placeholderTextColor={COLOR.Gray}
            style={[styles.input, textInputStyle]}
            cursorColor={COLOR.Gray}
            onChangeText={onChangeText}
            value={value}
          />
          {rightIcon && <TouchableOpacity onPress={rightIconPress}>
            <Image source={rightIcon} />
          </TouchableOpacity>}
        </View>
       {errorMassage &&
       <Valide style={styles.valid}>
          {errorMassage}
        </Valide>}
  </View>       
  )
}

const styles = StyleSheet.create({
  errorText:{
    color:COLOR.Red
  },
   inputContainer: {
    width: '100%',
    height: 55,
    // marginTop: responsiveHeight(2),
    borderWidth: 1.2,
    borderColor: '#DCDCDC',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },

  valid: {
    color: COLOR.Red,
    marginHorizontal: 10,
    marginTop: 4,
    marginBottom: 10,
    alignSelf: 'flex-start'
  },

  leftIcon: {
    marginRight: 10,
    backgroundColor: 'green',
  },

  rightIcon: {
    position: 'absolute',
    right: 15,
  },

  input: {
    flex: 1,
    paddingHorizontal: responsiveWidth(2),
    fontSize: 17,
    color:COLOR.Black1
  },
})