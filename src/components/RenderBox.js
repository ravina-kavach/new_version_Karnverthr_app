import React from "react"
import { TouchableWithoutFeedback,Image, View, Text, StyleSheet } from "react-native"
import { useNavigation } from '@react-navigation/native'

import { commonStyle } from '../utils/common'
import { COLOR } from "../theme/theme"

export const RenderBox = ({ image, title, screen }) => {
    const Navigation = useNavigation();
    // return (Navigation.navigate(onClick)
    const onPress = () =>{
        if(screen === "attendance"){
            return Navigation.navigate(screen)
        }
    }
    return(
        <TouchableWithoutFeedback onPress={()=> onPress()} >
            <View style={[commonStyle.shodowBox, styles.container]}>
                {screen !== "attendance" && <Text style={styles.comingText}>Coming soon</Text>}
                <Image source={image} style={{ height: 60, width: 60, }} resizeMode='cover' />
                <Text style={styles.titleContainer}>{title}</Text>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    comingText:{
        color:COLOR.Primary1,
        fontWeight:'600',
        bottom:3,
    },
    container: { height: 140, width: 110, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    titleContainer: { color: COLOR.Black1, fontSize: 15, fontWeight: '600', marginTop: 20, textAlign: 'center' }
})