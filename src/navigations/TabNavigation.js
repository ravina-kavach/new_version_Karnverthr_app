import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

import { COLOR } from '../theme/theme';
import { GlobalFonts } from '../theme/typography';
import { FontSize, responsiveHeight, responsiveWidth } from '../utils/metrics';

import {
  HomeIcon,
  ExpensesIcon,
  LeaveIcon,
  CalenderIcon,
  FillHomeIcon,
  FillExpensesIcon,
  FillLeaveIcon,
  FillCalenderIcon,
} from '../assets/svgs';

import Home from '../screens/home/Home';
import Expenses from '../screens/expenses/Expenses';
import Leaves from '../screens/leaves/Leaves';
import Calender from '../screens/calender/Calender';
import CommonHeader from '../components/CommonHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();


  const renderTabIcon = (focused, ActiveIcon, InactiveIcon, label) => (
    <View style={styles.tabItem}>
      <View style={{marginVertical:2}}>
      {focused ? <ActiveIcon /> : <InactiveIcon />}
      </View>
      <Text style={[styles.tabText, focused && styles.activeText]}>
        {label}
      </Text>
      {focused && <View style={styles.activeIndicator} />}
    </View>
  );

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {...styles.tabBar,bottom: insets.bottom},
      }}
    >
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          headerShown:false,
          tabBarIcon: ({ focused }) =>
            renderTabIcon(
              focused,
              FillHomeIcon,
              HomeIcon,
              t('Tabs.Home')
            ),
        }}
      />

      <Tab.Screen
        name="expenses"
        component={Expenses}
        // listeners={{
        //   tabPress: e => e.preventDefault(),
        // }}
        options={{
          tabBarIcon: ({ focused }) =>
            renderTabIcon(
              focused,
              FillExpensesIcon,
              ExpensesIcon,
              t('Tabs.Expense')
            ),
            header:(()=>(
              <CommonHeader 
              title={t('Expenses.Expense')}
              />
            ))
        }}
        
      />

      <Tab.Screen
        name="leaves"
        component={Leaves}
        options={{
          header: () => (
            <CommonHeader
              title="Leaves"
            />
          ),
          tabBarIcon: ({ focused }) =>
            renderTabIcon(
              focused,
              FillLeaveIcon,
              LeaveIcon,
              t('Tabs.Leaves')
            ),
        }}
      />

      <Tab.Screen
        name="calender"
        component={Calender}
        options={{
          header: () => (
            <CommonHeader
              title="Calendar"
            />
          ),
          tabBarIcon: ({ focused }) =>
            renderTabIcon(
              focused,
              FillCalenderIcon,
              CalenderIcon,
              t('Tabs.Calendar')
            ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: responsiveHeight(10),
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5,
    borderTopColor: '#E5E7EB',
    elevation: 12,
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 6,
    width:responsiveWidth(25),
  },

  tabText: {
    ...GlobalFonts.subtitle,
    fontSize: FontSize.Font14,
    color: COLOR.Placeholder,
    marginTop: 4,
  },

  activeText: {
    color: COLOR.LightOrange,
    fontWeight: '600',
  },

  activeIndicator: {
    position: 'absolute',
    top: 0,
    height: 3,
    width: '40%',
    borderRadius: 2,
    backgroundColor: COLOR.LightOrange,
    width:responsiveWidth(12),
  },
});


export default TabNavigation;
