import React from "react"
import { Text, StyleSheet,  } from 'react-native';
import {FontSize} from './metrics'
import {COLOR} from "../theme/theme"

export const H3 = (props) => { return (<Text style={[commonStyle.h3, props.style]}>{props.children}</Text>) }
export const H4 = (props) => { return (<Text style={[commonStyle.h4, props.style]}>{props.children}</Text>) }
export const H5 = (props) => { return (<Text style={[commonStyle.h5, props.style]}>{props.children}</Text>) }
export const H6 = (props) => { return (<Text style={[commonStyle.h6, props.style]}>{props.children}</Text>) }

export const commonStyle = StyleSheet.create({
    h3: {
      marginBottom: 6,
      color: COLOR.dark1,
      fontSize: FontSize.Font28,
      lineHeight: 30,
      fontWeight: "800",
   },
   h4: {
      marginBottom: 6,
      color: COLOR.TextPrimary,
      fontSize: FontSize.Font26,
      lineHeight: 30,
      fontWeight: "600",
   },
   h5: {
      marginBottom: 5,
      color: COLOR.TextSecondary,
      fontSize: FontSize.Font18,
      lineHeight: 20,
      // fontWeight: "500",
   },
   h6: {
      marginBottom: 4,
      fontSize: FontSize.Font14,
      color: COLOR.Blue,
      lineHeight: 16,
      fontWeight: "600",
   },
})