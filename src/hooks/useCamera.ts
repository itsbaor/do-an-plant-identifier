import {useState, useCallback} from 'react';
import {PermissionsAndroid} from 'react-native';
export const useCameraPermissions = () => {
  const [hasCamPermission, setHasCamPermission] = useState(false);
  const checkCamPermission = async () => {
    const getCheckPermissionPromise = async () => {
      return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
    };
    return await getCheckPermissionPromise();
  };
  const requestCamPermission = async () => {
    const getRequestPermissionPromise = async () => {
      return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ).then(status => {
        return status === PermissionsAndroid.RESULTS.GRANTED;
      });
    };
    return await getRequestPermissionPromise();
  };
  const camPermissions = useCallback(async () => {
    const granted = await checkCamPermission();
    if (!granted) {
      const permissionResult = await requestCamPermission();
      setHasCamPermission(permissionResult);
    } else {
      setHasCamPermission(granted);
    }
  }, []);
  const updateCamPermissions = useCallback(async () => {
    const granted = await checkCamPermission();
    setHasCamPermission(granted);
  }, []);
  //   useEffect(() => {
  //     checkPermissions();
  //   }, [checkPermissions]);
  return {
    hasCamPermission,
    refreshCamPermissions: camPermissions,
    updateCamPermissions,
  };
};
