import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
  type RefObject,
  type PropsWithChildren,
} from 'react';
import { Animated, Dimensions, KeyboardAvoidingView, Modal, Platform, StyleSheet, View } from 'react-native';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

interface AnimationModelProps extends PropsWithChildren {
  transparent?: boolean;
  statusBarTranslucent?: boolean;
  animationType?: 'none' | 'slide' | 'fade';
  duration?: number;
  useNativeDriver?: boolean;
}

export interface AnimationModelResult {
  ref: RefObject<Modal>;
  show: () => void;
  hide: () => void;
}

const AnimationModel = forwardRef<AnimationModelResult, AnimationModelProps>(
  (
    {
      children,
      animationType = 'fade',
      transparent = true,
      statusBarTranslucent = true,
      duration = 500,
      useNativeDriver = false,
    },
    ref
  ) => {
    const modelRef = useRef<Modal>(null);
    const [visible, setVisible] = useState(false);

    const marginTop = useRef(new Animated.Value(WINDOW_HEIGHT)).current;

    const showModal = useCallback(() => {
      setVisible(true);
      // 开启动画
      Animated.timing(marginTop, {
        toValue: 0, // 上升
        duration: duration,
        useNativeDriver: useNativeDriver,
      }).start();
    }, [duration, marginTop, useNativeDriver]);

    // 先跑动画，再关闭弹窗
    const hideModal = useCallback(() => {
      Animated.timing(marginTop, {
        toValue: WINDOW_HEIGHT, // 下降
        duration: duration,
        useNativeDriver: useNativeDriver,
      }).start(() => {
        setVisible(false);
      });
    }, [duration, marginTop, useNativeDriver]);

    useImperativeHandle(ref, () => ({
      ref: modelRef,
      show: showModal,
      hide: hideModal,
    }));

    return (
      <Modal
        ref={modelRef}
        visible={visible}
        onRequestClose={hideModal}
        transparent={transparent}
        statusBarTranslucent={statusBarTranslucent}
        animationType={animationType}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
          <Animated.View style={[styles.contentView, { marginTop }]}>{children}</Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }
);

export default AnimationModel;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#00000060',
  },
  contentView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
