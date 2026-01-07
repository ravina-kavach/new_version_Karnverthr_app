import React from 'react';
import { NavigationContainer, useFocusEffect,  } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {View,TouchableWithoutFeedback, StyleSheet, StatusBar} from 'react-native'
import { COLOR } from '../theme/theme';
//----- welcome Screns
import Splash from '../screens/splash/Splash';
import Welcome1 from '../screens/welcome/Welcome1'
import Welcome2 from '../screens/welcome/Welcome2'
import Welcome3 from '../screens/welcome/Welcome3'
import Home from '../screens/home/Home'
import Profile from '../screens/profile/Profile'
import ShiftTiming from '../screens/shiftTiming/ShiftTiming'
import Attendance from '../screens/attendance/Attendance'
import CalendarList from '../screens/calender/CalenderList'
import Approvals from '../screens/approvels/Approvals'
import TabNavigation from './TabNavigation'
//------ Auth screen

import SignInScreen from '../screens/authscreens/signInScreen/SignInScreen';
import Leaves from '../screens/leaves/Leaves';
// import Termsofuse from '../Screens/Termsofuse';
// import PrivacyPolicy from '../Screens/PrivacyPolicy';

const Stack = createNativeStackNavigator();

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
          screenOptions={{
            headerShown:false
          }}>
          <Stack.Screen name="signInScreen" component={SignInScreen} options={{ header: () => null }}/>   
            <Stack.Screen name="home" component={Home} options={{ header: () => null }}/> 
            <Stack.Screen name="profile" component={Profile} />
            <Stack.Screen name="shiftTiming" component={ShiftTiming} />
            <Stack.Screen name="attendance" component={Attendance} />
            <Stack.Screen name="leaves" component={Leaves} />
            <Stack.Screen name="calendarList" component={CalendarList} />
            <Stack.Screen name="approvals" component={Approvals} />
          {/* <Stack.Screen name="MyProfile" component={MyProfile} />
          <Stack.Screen name="Approve" component={Approve} />
          <Stack.Screen name="NewMeeting" component={NewMeeting} />
          <Stack.Screen name="Reports" component={Reports} />
          <Stack.Screen name="Payslip" component={Payslip} />
          <Stack.Screen name="Announcement" component={Announcement} />
          <Stack.Screen name="ShiftTiming" component={ShiftTiming} />           */}
        </Stack.Group>
        {/* ============ Bottom Tab ============= */}
         <Stack.Group        
          screenOptions={{
            contentStyle: {              
              backgroundColor: COLOR.dark5,
            },
            header: () => null,
              headerBackVisible: false,
              headerShadowVisible: true,
              headerTransparent: false,
          }}
          >
          <Stack.Screen name="myTab" component={TabNavigation}  />
          </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  leftIconContainer:{ backgroundColor: COLOR.dark5, width: 35, height: 35, borderRadius: 20, alignItems: 'center', justifyContent: "center" }
})

export default Navigation