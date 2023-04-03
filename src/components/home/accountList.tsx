import React, { useRef } from 'react';
import {
  Image,
  SectionList,
  LayoutAnimation,
  SectionListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { useState } from 'react';
import iconBank from 'assets/icon_bank.png';
import iconGame from 'assets/icon_game.png';
import iconPlatform from 'assets/icon_platform.png';
import iconOther from 'assets/icon_other.png';
import iconArrow from 'assets/icon_arrow.png';
import { ImageSourcePropType } from 'react-native/Libraries/Image/Image';
import AddAccount from 'components/home/addAccount';
import { AnimationModelResult } from 'components/animationModel';
import { load, save } from 'utils/asyncStorage';

interface AccountListProps {
  list: AccountListType;
  loadData: () => void;
  showPassword: boolean;
}

const AccountList = ({ list = [], loadData, showPassword }: AccountListProps) => {
  const modelRef = useRef<AnimationModelResult>(null);
  const [status, setStatus] = useState<AccountTypeStatus>({
    其他: false,
    平台: false,
    银行卡: false,
    游戏: false,
  });

  const deleteAccount = (account: Account) => {
    load('accountList').then((data) => {
      if (data) {
        const results = JSON.parse(data.trim()) as Account[];
        const end = results.filter((o) => o.id !== account.id);
        save('accountList', JSON.stringify(end)).then(() => {
          loadData();
        });
      }
    });
  };

  const renderItem: SectionListRenderItem<Account> = ({ item }) => {
    if (!status[item.type]) {
      return null;
    }
    return (
      <TouchableOpacity
        style={styles.itemLayout}
        onPress={() => modelRef.current?.show(item)}
        onLongPress={() => {
          Alert.alert(`确定删除${item.type}账号吗？`, `账号名称:${item.name}\n账号ID:${item.account}`, [
            {
              text: '取消',
              style: 'cancel',
            },
            {
              text: '确定',
              onPress: () => deleteAccount(item),
            },
          ]);
        }}
      >
        <Text style={styles.nameTxt}>{item.name}</Text>
        <View style={styles.accountInfo}>
          <Text style={styles.accountInfoTxt}>账号: {item.account}</Text>
          <Text style={styles.accountInfoTxt}>密码: {showPassword ? item.password : '●'.repeat(6)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getUri = (type: AccountType): ImageSourcePropType => {
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

  const SectionHeader = (info: any): React.ReactElement => {
    const { section }: { section: Account & { data: AccountListType } } = info;

    return (
      <View
        style={[
          styles.groupHeader,
          (!status[section.type] || section.data.length === 0) && styles.groupHeaderBottomRadius,
        ]}
      >
        <Image style={styles.typeImg} source={getUri(section.type)} />
        <Text style={styles.typeTxt}>{section.type}</Text>
        <TouchableOpacity
          style={styles.arrowBtn}
          onPress={() => {
            setStatus((prevState) => {
              LayoutAnimation.easeInEaseOut();
              return {
                ...prevState,
                [section.type]: !prevState[section.type],
              };
            });
          }}
        >
          <Image
            style={[styles.arrowImg, { transform: [{ rotate: status[section.type] ? '0deg' : '-90deg' }] }]}
            source={iconArrow}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
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
      />
      <AddAccount ref={modelRef} onAddSave={loadData} />
    </>
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
  groupHeaderBottomRadius: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
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
