import React from 'react'
import { View, Image, Text, StyleSheet } from 'react-native'
import {COLOR} from '../theme/theme'
import { useTranslation } from 'react-i18next';
import { ExpensePlaceHolder } from '../assets/svgs/index.js';
import { GlobalFonts } from '../theme/typography.js';
import { FontSize } from '../utils/metrics.js';

function NodataFound({titleText}) {
  const { t, i18n } = useTranslation();
  return (
    <View style={styles.container}>
      <ExpensePlaceHolder/>
      <Text style={styles.textContainer}>{titleText?titleText:t("comman.No_records_found")}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{ alignItems: 'center' },
  imageCotainer:{ height: 200, width: 200 },
  textContainer:{ textAlign: 'center', marginTop: 20,...GlobalFonts.normalText ,color: COLOR.Placeholder, fontSize: FontSize.Font16},

})

export default NodataFound