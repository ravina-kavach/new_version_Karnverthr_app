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
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: styles.tabBar,
        headerStatusBarHeight:0,
        
   }}
    >
      <Tab.Screen
        name="Home"
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
        name="Expenses"
        component={Expenses}
        options={{
          header: () => (
            <CommonHeader
              title="Expenses"
              subtitle="Track your expenses"
            />
          ),
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabContainer, focused && styles.activeTab]}>
              <Image
                source={ExpensesIcon}
                tintColor={focused ? COLOR.Primary1 : COLOR.Black1}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Attendance"
        component={Attendance}
        options={{
          header: () => (
            <CommonHeader
              title="Attendance"
              subtitle="Daily attendance summary"
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
        name="Leaves"
        component={Leaves}
        options={{
          header: () => (
            <CommonHeader
              title="Leaves"
              subtitle="Manage your leaves"
            />
          ),
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabContainer, focused && styles.activeTab]}>
              <Image
                source={ReceiptIcon}
                tintColor={focused ? COLOR.Primary1 : COLOR.Black1}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Calender"
        component={Calender}
        options={{
          header: () => (
            <CommonHeader
              title="Calendar"
              subtitle="Your monthly schedule"
            />
          ),
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabContainer, focused && styles.activeTab]}>
              <Image
                source={CalenderIcon}
                tintColor={focused ? COLOR.Primary1 : COLOR.Black1}
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