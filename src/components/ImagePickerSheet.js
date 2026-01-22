import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { permission } from '../utils/permission';
import { COLOR } from '../theme/theme';
import { GlobalFonts } from '../theme/typography';
import { FontSize } from '../utils/metrics';
import { CommonView } from '../utils/common';
import { CameraIcon,UploadIcon } from '../assets/svgs';

const ImagePickerSheet = ({
  visible,
  onClose,
  onResult,
}) => {
  const handleCamera = async () => {
    onClose();
    const res = await permission.heandleOnCamera();
    if (res?.success) {
      onResult(res.image);
    }
  };

  const handleGallery = async () => {
    onClose();
    const res = await permission.handleOnGallery();
    if (res?.success) {
      onResult(res.image);
    }
  };

  return (
    <CommonView>
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.sheet}>
          <TouchableOpacity style={styles.option} onPress={handleCamera}>
            <CameraIcon/>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.option} onPress={handleGallery}>
            <UploadIcon/>
            <Text style={styles.text}>Upload From Device</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
    </CommonView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    bottom:-20,
  },

  sheet: {
    backgroundColor: COLOR.White1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop:20,
    paddingBottom: 40,
    overflow: 'hidden',
  },

  option: {
    flexDirection:'row',
    alignItems:'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },

  text: {
    ...GlobalFonts.subtitle,
    fontSize: FontSize.Font16,
    color: COLOR.Black1,
    paddingLeft:10
    
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
});


export default ImagePickerSheet;
