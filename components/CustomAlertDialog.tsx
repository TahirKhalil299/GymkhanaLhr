import React from 'react';
import {
    Dimensions,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type DialogClickListener = () => void;

interface CustomAlertDialogProps {
  visible: boolean;
  title: string;
  message: string;
  onOkClick?: DialogClickListener;
  onDismiss?: () => void;
  okButtonText?: string;
}

const CustomAlertDialog: React.FC<CustomAlertDialogProps> = ({
  visible,
  title,
  message,
  onOkClick,
  onDismiss,
  okButtonText = 'Okay',
}) => {
  const handleOkClick = () => {
    if (onOkClick) {
      onOkClick();
    } else if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{message}</Text>
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleOkClick}
              activeOpacity={0.8}>
              <Text style={styles.buttonText}>{okButtonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');
const cardWidth = Platform.OS === 'android' ? 300 : width * 0.45;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: cardWidth,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    padding: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1e1e1e',
    marginTop: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#1e1e1e',
    marginTop: 27,
    marginHorizontal: 10,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    height: 35,
    backgroundColor: '#007AFF', // Change to your preferred button color
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
});

export default CustomAlertDialog;