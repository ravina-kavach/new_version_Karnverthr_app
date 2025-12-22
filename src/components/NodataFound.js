import React from 'react'
import { View, Image, Text, StyleSheet } from 'react-native'
import {COLOR} from '../theme/theme'
import { NotFoundImg } from '../assets/icons/index.js';
import { useTranslation } from 'react-i18next';

function NodataFound() {
  const { t, i18n } = useTranslation();
  return (
    <View style={styles.container}>
      <Image source={NotFoundImg} style={styles.imageCotainer} />
      <Text style={styles.textContainer}>{t("comman.No_records_found")}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{ alignItems: 'center' },
  imageCotainer:{ height: 200, width: 200 },
  textContainer:{ textAlign: 'center', marginTop: 20, color: COLOR.Black1, fontSize: 14, fontWeight: 'bold' },

})

export default NodataFound