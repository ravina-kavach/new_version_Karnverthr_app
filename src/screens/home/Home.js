import React from 'react';
import { CommonView, H4 } from '../../utils/common';
import { ScrollView,FlatList, View, StyleSheet } from 'react-native';
import WorkingHoursCard from '../../components/WorkingHoursCard';
import { useHome } from './HomeController.js';
import {RenderBox} from '../../components/RenderBox.js'
import GreetingHeader from '../../components/GreetingHeader.js'
const Home = () => {
  const {
    MENUDATA,
    UsersigninData,
    takeImage,
    localAttendanceData,
    isAttendanceFetching,
  } = useHome();
  return(
    <CommonView>
      <GreetingHeader/>
      <ScrollView 
      showsVerticalScrollIndicator={false}
      style={styles.mainContainer}
      nestedScrollEnabled
      >
        <WorkingHoursCard
          usersigninData={UsersigninData}
          localAttendanceData={localAttendanceData}
          onPress={takeImage}
          loading={isAttendanceFetching}
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
                screen={item.screen}
              />
            </View>
          )}
        />
      </ScrollView>
    </CommonView>
  );
};
const styles = StyleSheet.create({
  container:{
    paddingVertical:20
  },
  mainContainer:{paddingHorizontal:10},
  itemContainer:{ flex: 1, alignItems: 'center', marginBottom: 20 }
})

export default Home;
