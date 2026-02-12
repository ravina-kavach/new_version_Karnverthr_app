import React from 'react';
import { CommonView } from '../../utils/common';
import { ScrollView, FlatList, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import WorkingHoursCard from '../../components/WorkingHoursCard';
import { useHome } from './HomeController.js';
import { RenderBox } from '../../components/RenderBox.js'
import { AdminRenderBox } from '../../components/AdminRenderBox.js'
import GreetingHeader from '../../components/GreetingHeader.js'
import { COLOR } from '../../theme/theme.js';
import { ChatBotIcon } from '../../assets/svgs/index.js';
import LogoutModal from '../../components/LogoutModal.js';
const Home = () => {
  const {
    MENUDATA,
    UsersigninData,
    takeImage,
    attendance,
    isAttendanceFetching,
    navigateChatBot,
    logoutVisible,
    setLogoutVisible,
    handleOnLogout,
    isAdmin,
    ADMIN_MENUDATA
  } = useHome();
  return (
    <CommonView>
      <GreetingHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.mainContainer}
        nestedScrollEnabled
      >
        <WorkingHoursCard
          usersigninData={UsersigninData}
          localAttendanceData={attendance}
          onPress={takeImage}
          loading={isAttendanceFetching}
        />
        {isAdmin ? (
          <FlatList
            key="admin-list"
            data={ADMIN_MENUDATA}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            numColumns={1}
            renderItem={({ item }) => (
                <AdminRenderBox
                  image={item.image}
                  title={item.title}
                  screen={item.screen}
                />
            )}
          />
        ) : (
          <FlatList
            key="user-grid"
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
        )}

      </ScrollView>
      {/* <TouchableWithoutFeedback onPress={() => navigateChatBot()}>
        <View style={styles.plusContainer}>
          <ChatBotIcon width={60} height={60} />
        </View>
      </TouchableWithoutFeedback> */}
      <LogoutModal
        visible={logoutVisible}
        onCancel={() => setLogoutVisible(false)}
        onLogout={() => {
          setLogoutVisible(false);
          handleOnLogout();
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
  itemContainer: { flex: 1, alignItems: 'center', marginBottom: 20 },
  plusContainer: { position: "absolute", right: 20, bottom: 20 },
  iconContainer: { backgroundColor: COLOR.Black1, padding: 13, borderRadius: 14, overflow: 'hidden' },

})

export default Home;
