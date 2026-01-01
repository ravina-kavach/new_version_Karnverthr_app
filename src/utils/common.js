import React from 'react';
import { Text, StyleSheet, StatusBar,View } from 'react-native';
import { FontSize } from './metrics';
import { COLOR } from '../theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import GlobalStyle from '../theme/globalstyle';
import {GlobalFonts} from '../theme/typography'

export const CommonView = props => {
  return (
    <SafeAreaView style={GlobalStyle.flexContainer} edges={props.edges?props.edges:['left', 'right']} >
      <StatusBar translucent colo backgroundColor={props?.statusBarColor ? props.statusBarColor : COLOR.White1} barStyle="dark-content" />
      {props.children}
    </SafeAreaView>
  );
};

export const H3 = props => {
  return <Text style={[commonStyle.titleText, props.style]}>{props.children}</Text>;
};
export const H4 = props => {
  return <Text style={[commonStyle.subtitleText, props.style]}>{props.children}</Text>;
};
export const H5 = props => {
  return <Text style={[commonStyle.normalText, props.style]}>{props.children}</Text>;
};
export const H6 = props => {
  return <Text style={[commonStyle.descText, props.style]}>{props.children}</Text>;
};
export const Label = (props) => { return (<Text style={[commonStyle.Label, props.style]}>{props.children}</Text>) }
export const Valide = (props) => { return (<Text style={[commonStyle.Valide, props.style]}>{props.children}</Text>) }
export const RowView = (props) => { return (<View style={[commonStyle.row, props.style]}>{props.children}</View>) }
export const ColView = (props) => { return (<View style={[commonStyle.col, props.style]}>{props.children}</View>) }

//-----------

export const commonStyle = StyleSheet.create({
  titleText: {
    marginBottom: 6,
    color: COLOR.Secondary,
    fontSize: FontSize.Font24,
    ...GlobalFonts.title
  },
  subtitleText: {
    marginBottom: 6,
    color: COLOR.Secondary,
    ...GlobalFonts.subtitle
  },
  normalText: {
    marginBottom: 5,
    color: COLOR.Secondary,
    ...GlobalFonts.normalText
  },
  descText: {
    marginBottom: 4,
    fontSize: FontSize.Font14,
    color: COLOR.Secondary,
    ...GlobalFonts.body
  },
   row: {
      flexDirection: "row",
      marginHorizontal: -5,
      alignItems: "center",
   },
   col: {
      flex: 1,
      paddingHorizontal: 5,
   },
   Label: {
      fontSize: 17,
      textTransform: "capitalize",
      color: COLOR.dark2,
      marginBottom: 3,
      fontWeight: "400",
   },
   Valide: {
      fontSize: 15,
      color: COLOR.Red,
      fontWeight: "400",
   },
    input: {
      height: 50,
      fontSize: 15,
      lineHeight: 20,
      color: COLOR.Black1,
      paddingVertical: 3,
      paddingLeft: 15,
      paddingRight: 35,
      borderColor: COLOR.dark2,
      backgroundColor: COLOR.White1,
      borderWidth: 0.5,
      borderStyle: "solid",
      borderRadius: 10,
   },
   btn_primary: {
      paddingHorizontal: 15,
      paddingVertical: 5,
      fontSize: 15,
      color: COLOR.White1,
      alignItems: "center",
      textTransform: 'capitalize',
      justifyContent: "center",
      textAlign: "center",
      borderRadius: 5,
      fontWeight: "600",
      backgroundColor: COLOR.Primary1,
      overflow: 'hidden',
   },
     shodowBox: {
      padding: 10,
      borderRadius: 10,
      backgroundColor: COLOR.White1,
      shadowColor: COLOR.Black1,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
      elevation: 7,
   },
    btn_primary_round: {
      paddingHorizontal: 15,
      paddingVertical: 10,
      fontSize: 18,
      color: COLOR.White1,
      alignItems: "center",
      textTransform: 'capitalize',
      justifyContent: "center",
      textAlign: "center",
      borderRadius: 20,
      backgroundColor: COLOR.Primary1,
      overflow: 'hidden',
   },
});
