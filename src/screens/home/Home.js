import React from 'react';
import { CommonView } from '../../utils/common';
import { ScrollView, FlatList, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import WorkingHoursCard from '../../components/WorkingHoursCard';
import { useHome } from './HomeController.js';
import { RenderBox } from '../../components/RenderBox.js'
import GreetingHeader from '../../components/GreetingHeader.js'
import { COLOR } from '../../theme/theme.js';
import { SupportIcon } from '../../assets/svgs/index.js';
import ExitModal from '../../components/ExitModal.js';
const Home = () => {
  const {
    MENUDATA,
    UserDetailsData,
    takeImage,
    attendance,
    isAttendanceFetching,
    navigateChatBot,
    logoutVisible,
    setLogoutVisible,
    navigateRaiseTicket
  } = useHome();
  return (
    <CommonView showBackground={false}>
      <GreetingHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.mainContainer}
        nestedScrollEnabled
      >
        <WorkingHoursCard
          UserDetailsData={UserDetailsData}
          localAttendanceData={attendance}
          onPress={takeImage}
          loading={isAttendanceFetching}
        />
        <FlatList
          data={MENUDATA}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
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
      <TouchableWithoutFeedback onPress={() => navigateRaiseTicket()}>
        <View style={styles.plusContainer}>
          <SupportIcon width={60} height={60} />
        </View>
      </TouchableWithoutFeedback>
      <ExitModal
        visible={logoutVisible}
        onCancel={() => setLogoutVisible(false)}
        onLogout={() => {
          setLogoutVisible(false);
        }}
      />
    </CommonView>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingVertical: 20
  },
  mainContainer: { paddingHorizontal: 10 },
  itemContainer: { flex: 1, marginBottom: 20 },
  plusContainer: { position: "absolute", right: 20, bottom: 20 },
  iconContainer: { backgroundColor: COLOR.Black1, padding: 13, borderRadius: 14, overflow: 'hidden' },

})

export default Home;
