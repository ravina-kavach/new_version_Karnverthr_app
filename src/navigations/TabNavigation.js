import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { COLOR } from '../theme/theme';
import { HomeIcon,ReceiptIcon,ExpensesIcon,CalenderIcon,AttendancIcon,HomeClockIcon } from '../assets/icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CommonHeader from '../components/CommonHeader'
import Home from '../screens/home/Home';
import Expenses from '../screens/expenses/Expenses';
import Leaves from '../screens/leaves/Leaves';
import Attendance from '../screens/attendance/Attendance';
import Calender from '../screens/calender/Calender';
const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator

      screenOptions={{
        // headerShown:false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: styles.tabBar,
   }}
  
    >
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          header: () => (
            <CommonHeader
              title="Let’s Clock-In!"
              subtitle="Don’t miss your clock in schedule"
              rightIcon={HomeClockIcon}
            />
          ),
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabContainer, focused && styles.activeTab]}>
              <Image
                source={HomeIcon}
                tintColor={focused ? COLOR.Primary1 : COLOR.Black1}
              />
            </View>
          ),
        }}
      />

    

      <Tab.Screen
        name="attendance"
        component={Attendance}
        options={{
        
          header: () => (
            <CommonHeader
              title="Attendance"
              subtitle="Daily attendance summary"
              rightIcon={HomeClockIcon}
            />
          ),
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabContainer, focused && styles.activeTab]}>
              <Image
                source={AttendancIcon}
                tintColor={focused ? COLOR.Primary1 : COLOR.Black1}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="expenses"
        component={Expenses}
        listeners={({ navigation }) => ({
        tabPress: e => {e.preventDefault()},
        })}
        options={{
          header: () => (
            <CommonHeader
              title="Expenses"
              subtitle="Track your expenses"
              rightIcon={HomeClockIcon}
            />
          ),
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabContainer, focused && styles.activeTab]}>
              <Image
                source={ExpensesIcon}
                tintColor={COLOR.dark2}
                // tintColor={focused ? COLOR.Primary1 : COLOR.Black1}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="leaves"
        component={Leaves}
        listeners={({ navigation }) => ({
        tabPress: e => {e.preventDefault()},
        })}
        options={{
          header: () => (
            <CommonHeader
              title="Leaves"
              subtitle="Manage your leaves"
              rightIcon={HomeClockIcon}
            />
          ),
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabContainer, focused && styles.activeTab]}>
              <Image
                source={ReceiptIcon}
                tintColor={COLOR.dark2}
                // tintColor={focused ? COLOR.di : COLOR.Black1}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="calender"
        component={Calender}
        listeners={({ navigation }) => ({
        tabPress: e => {e.preventDefault()},
        })}
        options={{
          headerStatusBarHeight:0,
          header: () => (
            <CommonHeader
              title="Calendar"
              subtitle="Your monthly schedule"
              rightIcon={HomeClockIcon}
            />
          ),
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabContainer, focused && styles.activeTab]}>
              <Image
                source={CalenderIcon}
                tintColor={COLOR.dark2}
                // tintColor={focused ? COLOR.Primary1 : COLOR.Black1}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    elevation: 5,
  },
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  activeTab: {
    borderTopWidth: 3,
    borderColor: COLOR.Primary1,
  },
});

export default TabNavigation