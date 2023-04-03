import React, { useCallback, useEffect, useState } from 'react';
import { LayoutAnimation, StyleSheet, Switch, Text, View } from 'react-native';

import AccountList from 'components/home/accountList';
import { load } from 'utils/asyncStorage';

const Home = () => {
  const [list, setList] = useState<AccountListType>([]);
  const [showPassword, setShowPassword] = useState(true);

  const renderTitle = () => {
    return (
      <View style={styles.title}>
        <Text style={styles.titleTxt}>账号管理</Text>
        <Switch style={styles.switch} value={showPassword} onValueChange={setShowPassword} />
      </View>
    );
  };

  const loadData = useCallback(() => {
    load('accountList').then((data) => {
      if (data) {
        const arr = JSON.parse(data.trim()) as Account[];
        if (typeof arr === typeof []) {
          const gameList: Account[] = arr.filter((o) => o.type === '游戏') || [];
          const platformList: Account[] = arr.filter((o) => o.type === '平台') || [];
          const bankList: Account[] = arr.filter((o) => o.type === '银行卡') || [];
          const otherList: Account[] = arr.filter((o) => o.type === '其他') || [];

          const sectionData: AccountListType = [
            { type: '游戏', data: gameList },
            { type: '平台', data: platformList },
            { type: '银行卡', data: bankList },
            { type: '其他', data: otherList },
          ];

          LayoutAnimation.easeInEaseOut();
          setList(sectionData);
        }
      }
    });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <View style={styles.root}>
      {renderTitle()}
      <AccountList list={list} loadData={loadData} showPassword={showPassword} />
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleTxt: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  switch: {
    position: 'absolute',
    right: 12,
  },
});
