import React from "react"
import { TouchableWithoutFeedback, View, Text, StyleSheet } from "react-native"
import { useNavigation } from '@react-navigation/native'

import { commonStyle } from '../utils/common'
import { COLOR } from "../theme/theme"
import { FontSize } from "../utils/metrics"
import { GlobalFonts } from "../theme/typography"

export const RenderBox = ({ image, title, screen }) => {
    const Navigation = useNavigation();
    // return (Navigation.navigate(onClick)
    const onPress = () => {
        if (screen === "attendance" || screen === "leaves" || screen === "expenses" || screen === "calender") {
            return Navigation.navigate(screen)
        }
    }
    return (
        <TouchableWithoutFeedback onPress={() => onPress()} >
            <View style={[commonStyle.shodowBox, styles.container]}>
                {(screen !== "attendance" &&  screen !== "leaves" && screen !== "expenses" && screen !== "calender") && <Text style={styles.comingText}>Coming soon</Text>}
                {image}
                <Text numberOfLines={1} style={styles.titleContainer}>{title}</Text>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    comingText: {
        color: COLOR.LightOrange,
        ...GlobalFonts.normalText,
        fontSize: FontSize.Font12,
    },
    container: { flex: 1, padding:20, borderRadius: 20, alignItems: 'center', justifyContent: 'space-around' },
    titleContainer: { color: COLOR.Black1, ...GlobalFonts.subtitle, fontSize: FontSize.Font14, textAlign: 'center'}
})