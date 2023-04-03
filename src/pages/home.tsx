import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import AddAccount from 'components/home/addAccount';
import AccountList from 'components/home/accountList';

const Home = () => {
  const renderTitle = () => {
    return (
      <View style={styles.title}>
        <Text style={styles.titleTxt}>账号管理</Text>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {renderTitle()}

      <AccountList />

      <AddAccount />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
  },
  title: {
    width: '100%',
    height: 46,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleTxt: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
});
