import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import AnimationModel, { AnimationModelResult } from 'components/animationModel';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import iconAdd from 'assets/icon_add.png';
import iconClose from 'assets/icon_close_modal.png';
import { getUUID } from 'utils/uuid';
import { load, save } from 'utils/asyncStorage';

interface AddAccountProps {
  onAddSave: () => void;
}

const accountTypes: AccountType[] = ['游戏', '平台', '银行卡', '其他'];
const AddAccount = forwardRef<AnimationModelResult, AddAccountProps>(({ onAddSave }: AddAccountProps, ref) => {
  const modelRef = useRef<AnimationModelResult>(null);
  const [accountType, setAccountType] = useState<AccountType>(accountTypes[0]);
  const [accountName, setAccountName] = useState<string>('');
  const [accountId, setAccountId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [editId, setEditId] = useState('');

  useImperativeHandle(ref, () => ({
    ref: modelRef.current!.ref,
    show: show,
    hide: modelRef.current!.hide,
  }));

  const handleSave = () => {
    setEditId('');
    clearData();
    onAddSave();
  };

  const show = (current?: Account) => {
    if (current) {
      setEditId(current.id);
      setAccountType(current.type);
      setAccountName(current.name);
      setAccountId(current.account);
      setPassword(current.password);
      modelRef.current?.show();
    } else {
      setEditId('');
      modelRef.current?.show();
    }
  };

  const clearData = () => {
    setAccountType(accountTypes[0]);
    setAccountName('');
    setAccountId('');
    setPassword('');
  };

  const onSave = () => {
    const newAccount: Account = {
      id: editId ? editId : (getUUID() as string),
      type: accountType,
      name: accountName,
      account: accountId,
      password: password,
    };
    // 读取旧数据
    load('accountList').then((list) => {
      let accountList = list ? JSON.parse(list) : [];
      if (editId) {
        accountList = accountList.map((o: Account) => (o.id === editId ? newAccount : o));
        // 清空数据
        editId && setEditId('');
      } else {
        // 新数据添加到之前的数组中
        accountList.push(newAccount);
      }
      // 将新的数据保存起来
      save('accountList', JSON.stringify(accountList)).then(() => modelRef.current?.hide());
    });
  };

  const renderTitle = () => {
    const titleStyles = StyleSheet.create({
      layout: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
      },
      txt: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
      },
      closeBtn: {
        position: 'absolute',
        right: 6,
      },
      closeImg: {
        width: 28,
        height: 28,
        resizeMode: 'contain',
      },
    });

    return (
      <View style={titleStyles.layout}>
        <Text style={titleStyles.txt}>{editId ? '编辑账号' : '添加账号'}</Text>
        <TouchableOpacity style={titleStyles.closeBtn} onPress={() => modelRef.current?.hide()}>
          <Image source={iconClose} style={titleStyles.closeImg} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderType = () => {
    const typeStyle = StyleSheet.create({
      layout: {
        marginTop: 8,
        width: '100%',
        height: 32,
        flexDirection: 'row',
        alignItems: 'center',
      },
      tab: {
        flexGrow: 1,
        height: '100%',
        borderWidth: 1,
        borderRightWidth: 0,
        borderColor: '#c0c0c0',
        justifyContent: 'center',
        alignItems: 'center',
      },
      leftTab: {
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
      },
      rightTab: {
        borderRightWidth: 1,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
      },
      tabTxt: {
        fontSize: 14,
      },
    });

    return (
      <View style={typeStyle.layout}>
        {accountTypes.map((item, index) => {
          return (
            <TouchableOpacity
              style={[
                typeStyle.tab,
                index === 0 && typeStyle.leftTab,
                index === 3 && typeStyle.rightTab,
                { backgroundColor: accountType === item ? '#3050ff' : 'white' },
              ]}
              key={index}
              onPress={() => setAccountType(item)}
            >
              <Text
                style={[
                  typeStyle.tabTxt,
                  {
                    color: accountType === item ? 'white' : 'black',
                  },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderName = () => {
    const nameStyle = StyleSheet.create({
      layout: {
        marginTop: 8,
        width: '100%',
      },
      input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#c0c0c0',
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 12,
        color: '#333',
      },
    });

    return (
      <View style={nameStyle.layout}>
        <TextInput style={nameStyle.input} maxLength={20} value={accountName} onChangeText={setAccountName} />
      </View>
    );
  };

  const renderId = () => {
    const nameStyle = StyleSheet.create({
      layout: {
        marginTop: 8,
        width: '100%',
      },
      input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#c0c0c0',
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 12,
        color: '#333',
      },
    });

    return (
      <View style={nameStyle.layout}>
        <TextInput style={nameStyle.input} maxLength={20} value={accountId} onChangeText={setAccountId} />
      </View>
    );
  };

  const renderPassword = () => {
    const nameStyle = StyleSheet.create({
      layout: {
        marginTop: 8,
        width: '100%',
      },
      input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#c0c0c0',
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 12,
        color: '#333',
      },
    });

    return (
      <View style={nameStyle.layout}>
        <TextInput style={nameStyle.input} maxLength={20} value={password} onChangeText={setPassword} />
      </View>
    );
  };

  const renderButton = () => {
    const style = StyleSheet.create({
      layout: {
        marginTop: 16,
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 16,
      },
      btn: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#c0c0c0',
        paddingHorizontal: 24,
        paddingVertical: 6,
        borderRadius: 5,
      },
      btnSave: {
        borderWidth: 0,
        backgroundColor: 'blue',
      },
      btnText: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      btnSaveText: {
        color: 'white',
      },
    });

    return (
      <View style={style.layout}>
        <TouchableOpacity style={style.btn} onPress={clearData}>
          <Text style={style.btnText}>清空</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[style.btn, style.btnSave]} onPress={onSave}>
          <Text style={[style.btnText, style.btnSaveText]}>保存</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <TouchableOpacity activeOpacity={0.5} style={styles.addBtn} onPress={() => modelRef.current?.show()}>
        <Image source={iconAdd} style={styles.addBtnImg} />
      </TouchableOpacity>

      <AnimationModel ref={modelRef} onSave={handleSave}>
        <View style={styles.content}>
          {renderTitle()}
          <Text style={styles.subTitle}>账号类型</Text>
          {renderType()}
          <Text style={styles.subTitle}>账号名称</Text>
          {renderName()}
          <Text style={styles.subTitle}>账号ID</Text>
          {renderId()}
          <Text style={styles.subTitle}>密码</Text>
          {renderPassword()}

          {renderButton()}
        </View>
      </AnimationModel>
    </>
  );
});

export default AddAccount;

const styles = StyleSheet.create({
  addBtn: {
    position: 'absolute',
    right: 28,
    bottom: 64,
  },
  addBtnImg: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
  },

  content: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
  },
  subTitle: {
    marginTop: 16,
    fontSize: 12,
    color: '#666',
  },
});
