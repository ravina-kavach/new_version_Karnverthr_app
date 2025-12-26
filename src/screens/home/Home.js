import React from 'react';
import { CommonView, H4 } from '../../utils/common';
import { ScrollView,FlatList, View, StyleSheet } from 'react-native';
import { COLOR } from '../../theme/theme.js';
import WorkingHoursCard from '../../components/WorkingHoursCard';
import { useHome } from './HomeController.js';
import {RenderBox} from '../../components/RenderBox.js'
const Home = () => {
  const {
    MENUDATA,
    UsersigninData,
    takeImage,
    localAttendanceData,
    isAttendanceFetching
  } = useHome();
  return (
    <CommonView statusBarColor={COLOR.OffRed}>
      <ScrollView>
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
  itemContainer:{ flex: 1, alignItems: 'center', marginBottom: 20 }
})

export default Home;
