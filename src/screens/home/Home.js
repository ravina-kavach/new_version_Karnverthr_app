import React from 'react';
import { CommonView, H4 } from '../../utils/common';
import { ScrollView,FlatList, View, StyleSheet } from 'react-native';
import WorkingHoursCard from '../../components/WorkingHoursCard';
import { useHome } from './HomeController.js';
import {RenderBox} from '../../components/RenderBox.js'
const Home = () => {
  const {
    MENUDATA,
    IsAtandance,
    UsersigninData,
    isCheckin,
    isCheckOut,
    isError,
    errorMessage,
    isGetCheckStatus,
    GetCheckStatusData,
    isGetCheckStatusFetching,
    isGetAttandanceListFetching,
    GetAttandanceListData,
    isCheckOutFetching,
    isCheckinFetching,
    takeImage,
    checkInData,
    checkOutData,
  } = useHome();

  return (
    // <CommonView>
      <ScrollView>
        <WorkingHoursCard
          usersigninData={UsersigninData}
          imageFetching={isGetAttandanceListFetching}
          checkInData={checkInData}
          checkOutData={checkOutData}
          onPress={takeImage}
          isAtandance={IsAtandance}
        />
        <FlatList
          data={MENUDATA}
          keyExtractor={item => item.id}
          numColumns={3}
          contentContainerStyle={styles.container}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <RenderBox
                image={item.image}
                title={item.title}
                onClick={item.screen}
              />
            </View>
          )}
        />
      </ScrollView>
    // </CommonView>
  );
};
const styles = StyleSheet.create({
  container:{
    paddingVertical:20
  },
  itemContainer:{ flex: 1, alignItems: 'center', marginBottom: 20 }
})

export default Home;
