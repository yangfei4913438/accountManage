import React from 'react';
import {
  Image,
  SectionList,
  SectionListData,
  SectionListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEffect, useState } from 'react';
import { load } from 'utils/asyncStorage';
import iconBank from 'assets/icon_bank.png';
import iconGame from 'assets/icon_game.png';
import iconPlatform from 'assets/icon_platform.png';
import iconOther from 'assets/icon_other.png';
import iconArrow from 'assets/icon_arrow.png';

const AccountList = () => {
  const [list, setList] = useState<AccountList>([]);

  useEffect(() => {
    load('accountList').then((data) => {
      if (data) {
        const arr = JSON.parse(data.trim()) as Account[];
        if (typeof arr === typeof []) {
          const gameList: Account[] = arr.filter((o) => o.type === '游戏') || [];
          const platformList: Account[] = arr.filter((o) => o.type === '平台') || [];
          const bankList: Account[] = arr.filter((o) => o.type === '银行卡') || [];
          const otherList: Account[] = arr.filter((o) => o.type === '其他') || [];

          const sectionData: AccountList = [
            { type: '游戏', data: gameList },
            { type: '平台', data: platformList },
            { type: '银行卡', data: bankList },
            { type: '其他', data: otherList },
          ];
          setList(sectionData);
        }
      }
    });
  }, []);

  const renderItem: SectionListRenderItem<Account> = ({ item }) => {
    return (
      <View style={styles.itemLayout}>
        <Text style={styles.nameTxt}>{item.name}</Text>
        <View style={styles.accountInfo}>
          <Text style={styles.accountInfoTxt}>账号: {item.account}</Text>
          <Text style={styles.accountInfoTxt}>密码: {item.password}</Text>
        </View>
      </View>
    );
  };

  const getUri = (type: AccountType) => {
    switch (type) {
      case '游戏':
        return iconGame;
      case '平台':
        return iconPlatform;
      case '银行卡':
        return iconBank;
      default:
        return iconOther;
    }
  };

  const SectionHeader = ({ section }: { section: SectionListData<Account> }) => {
    return (
      <View style={styles.groupHeader}>
        <Image style={styles.typeImg} source={getUri(section.type)} />
        <Text style={styles.typeTxt}>{section.type}</Text>
        <TouchableOpacity style={styles.arrowBtn}>
          <Image style={styles.arrowImg} source={iconArrow} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SectionList
      sections={list}
      style={styles.root} // 全局样式
      contentContainerStyle={styles.contentWrapper} // 容器样式
      keyExtractor={(item, index) => `${item.type}-${index}`}
      keyboardDismissMode={'on-drag'}
      keyboardShouldPersistTaps={'handled'} // 有点击事件就响应
      renderItem={renderItem}
      renderSectionHeader={SectionHeader}
      stickySectionHeadersEnabled={true} // 分组头吸顶
      ItemSeparatorComponent={() => <View style={styles.separator} />} // 分割线渲染组件
    />
  );
};

export default AccountList;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  contentWrapper: {
    paddingHorizontal: 12,
  },
  txt: { color: '#f1f1f1' },
  groupHeader: {
    marginTop: 12,
    width: '100%',
    height: 46,
    backgroundColor: '#ccc',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 4,
  },
  typeImg: {
    width: 24,
    height: 24,
  },
  typeTxt: {
    fontSize: 16,
  },
  arrowBtn: {
    position: 'absolute',
    right: 0,
    padding: 16, // 扩大可点击区域
  },
  arrowImg: {
    width: 20,
    height: 20,
  },
  itemLayout: {
    width: '100%',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 4,
  },
  nameTxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  accountInfo: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountInfoTxt: {
    fontSize: 14,
    flexGrow: 1,
    color: '#666',
  },
  separator: {
    width: '100%',
    height: 2,
    backgroundColor: '#ccc',
  },
});
