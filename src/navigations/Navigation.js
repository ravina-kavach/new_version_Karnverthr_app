import React from 'react';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {View,TouchableWithoutFeedback, StyleSheet} from 'react-native'
import { COLOR } from '../theme/theme';
//----- welcome Screns
import Splash from '../screens/splash/Splash';
import Welcome1 from '../screens/welcome/Welcome1'
import Welcome2 from '../screens/welcome/Welcome2'
import Welcome3 from '../screens/welcome/Welcome3'

//------ Auth screen

// import Home from '../Screens/Home';
import SignInScreen from '../screens/authscreens/signInScreen/SignInScreen';
// import Termsofuse from '../Screens/Termsofuse';
// import PrivacyPolicy from '../Screens/PrivacyPolicy';

const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

function Navigation({ props }) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="splash">
        <Stack.Group screenOptions={{ header: () => null }}>
          <Stack.Screen name="splash" component={Splash} />
          <Stack.Screen name="welcome1" component={Welcome1} />
          <Stack.Screen name="welcome2" component={Welcome2} />
          <Stack.Screen name="welcome3" component={Welcome3} />
        </Stack.Group>
        {/* ============ main screens ============= */}
        <Stack.Group
          screenOptions={({ navigation }) => {
            return {
              headerTitleAlign: 'center',
              // headerLeft: () => (
              //   <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
              //     <View style={{ backgroundColor: COLOR.dark5, width: 35, height: 35, borderRadius: 20, alignItems: 'center', justifyContent: "center" }}>
              //       {/* <Feather name='chevron-left' size={26} color={COLOR.Black1} /> */}
              //     <Text>icon</Text>
              //     </View>
              //   </TouchableWithoutFeedback>
              // ),
              headerBackVisible: false,
              headerShadowVisible: false,
              headerTransparent: false,
              // headerBackground: () => <Div style={{ height: 50, width: '100%', backgroundColor: COLOR.dark5 }} />,
              // contentStyle: {              
              //   paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
              //   backgroundColor: COLOR.dark5,
              // },
            };
          }}>
          <Stack.Screen name="signInScreen" component={SignInScreen} options={{ header: () => null }}/>          
          {/* <Stack.Screen name="MyProfile" component={MyProfile} />
          <Stack.Screen name="Approve" component={Approve} />
          <Stack.Screen name="NewMeeting" component={NewMeeting} />
          <Stack.Screen name="Approvals" component={Approvals} />
          <Stack.Screen name="Reports" component={Reports} />
          <Stack.Screen name="Payslip" component={Payslip} />
          <Stack.Screen name="Announcement" component={Announcement} />
          <Stack.Screen name="ShiftTiming" component={ShiftTiming} />           */}
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  leftIconContainer:{ backgroundColor: COLOR.dark5, width: 35, height: 35, borderRadius: 20, alignItems: 'center', justifyContent: "center" }
})

export default Navigation