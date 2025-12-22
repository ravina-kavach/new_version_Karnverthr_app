import React from "react"
import { TouchableWithoutFeedback,Image, View, Text, StyleSheet } from "react-native"
import { commonStyle } from '../utils/common'
import { COLOR } from "../theme/theme"

export const RenderBox = ({ image, title, onClick }) => {
    // return (Navigation.navigate(onClick)
    return(
        <TouchableWithoutFeedback onPress={() => {}} >
            <View style={[commonStyle.shodowBox, styles.container]}>
                <Image source={image} style={{ height: 60, width: 60, }} resizeMode='cover' />
                <Text style={styles.titleContainer}>{title}</Text>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: { height: 140, width: 110, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    titleContainer: { color: COLOR.Black1, fontSize: 15, fontWeight: '600', marginTop: 20, textAlign: 'center' }
})