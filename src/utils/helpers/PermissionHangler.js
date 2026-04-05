import {Alert, Linking, Platform} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

// Define a function to handle permission requests
const handlePermissionRequest = async (permission, type) => {
  const permissionResult = await check(permission);

  if (permissionResult === RESULTS.GRANTED) {
    return true; // Permission already granted
  } else {
    const requestResult = await request(permission);

    if (requestResult === RESULTS.GRANTED) {
      return true; // Permission granted
    } else {
      // Permission denied
      console.log('-->', permission, requestResult);
      Alert.alert(
        `${type.charAt(0).toUpperCase() + type.slice(1)} Permission Denied!`,
        `You need to grant ${type} permission to use this feature`,
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {text: 'OK', onPress: () => Linking.openSettings()},
        ],
        {cancelable: false},
      );
      return false; // Permission denied
    }
  }
};

// Define permission types
export const PermissionTypes = {
  CAMERA: Platform.select({
    android: PERMISSIONS.ANDROID.CAMERA,
    ios: PERMISSIONS.IOS.CAMERA,
  }),
  MEDIA_IMAGES: {
    read: Platform.select({
      android: PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      ios: PERMISSIONS.IOS.MEDIA_LIBRARY,
    }),
    write: Platform.select({
      android: PERMISSIONS.ANDROID.WRITE_MEDIA_IMAGES,
      ios: PERMISSIONS.IOS.MEDIA_LIBRARY,
    }),
  },
  LOCATION: {
    whenInUse: Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    }),
    always: Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
    }),
  },
  STORAGE: {
    read: Platform.select({
      android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    }),
    write: Platform.select({
      android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY,
    }),
  },
  MICROPHONE: Platform.select({
    android: PERMISSIONS.ANDROID.RECORD_AUDIO,
    ios: PERMISSIONS.IOS.MICROPHONE,
  }),
  NOTIFICATIONS: Platform.select({
    android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
    ios: PERMISSIONS.IOS.NOTIFICATIONS,
  }),
  CONTACTS: Platform.select({
    android: PERMISSIONS.ANDROID.READ_CONTACTS,
    ios: PERMISSIONS.IOS.CONTACTS,
  }),
  CALENDAR: Platform.select({
    android: PERMISSIONS.ANDROID.READ_CALENDAR,
    ios: PERMISSIONS.IOS.CALENDARS,
  }),
  REMINDERS: Platform.select({
    android: PERMISSIONS.ANDROID.READ_REMINDERS,
    ios: PERMISSIONS.IOS.REMINDERS,
  }),
  BLUETOOTH: {
    scan: Platform.select({
      android: PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      ios: PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
    }),
    connect: Platform.select({
      android: PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      ios: PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
    }),
  },
  SMS: Platform.select({
    android: PERMISSIONS.ANDROID.SEND_SMS,
    ios: PERMISSIONS.IOS.SMS,
  }),
};

// Create a function to request permissions based on requirements
export const requestPermission = async (type, subType) => {
  switch (type) {
    case 'camera':
      return await handlePermissionRequest(PermissionTypes.CAMERA, type);
    case 'media':
      return subType === 'write'
        ? await handlePermissionRequest(
            PermissionTypes.MEDIA_IMAGES.write,
            type,
          )
        : await handlePermissionRequest(
            PermissionTypes.MEDIA_IMAGES.read,
            type,
          );
    case 'location':
      return subType === 'always'
        ? await handlePermissionRequest(PermissionTypes.LOCATION.always, type)
        : await handlePermissionRequest(
            PermissionTypes.LOCATION.whenInUse,
            type,
          );
    case 'storage':
      return subType === 'write'
        ? await handlePermissionRequest(PermissionTypes.STORAGE.write, type)
        : await handlePermissionRequest(PermissionTypes.STORAGE.read, type);
    case 'microphone':
      return await handlePermissionRequest(PermissionTypes.MICROPHONE, type);
    case 'notifications':
      return await handlePermissionRequest(PermissionTypes.NOTIFICATIONS, type);
    case 'contacts':
      return await handlePermissionRequest(PermissionTypes.CONTACTS, type);
    case 'calendar':
      return await handlePermissionRequest(PermissionTypes.CALENDAR, type);
    case 'reminders':
      return await handlePermissionRequest(PermissionTypes.REMINDERS, type);
    case 'bluetooth':
      return subType === 'connect'
        ? await handlePermissionRequest(PermissionTypes.BLUETOOTH.connect, type)
        : await handlePermissionRequest(PermissionTypes.BLUETOOTH.scan, type);
    case 'sms':
      return await handlePermissionRequest(PermissionTypes.SMS, type);
    default:
      return false; // Invalid permission type
  }
};
