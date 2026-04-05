import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar} from 'react-native';
import {useSelector} from 'react-redux';
import {COLORS} from '../constants';

const Stack = createStackNavigator();

// screens
// auth
import ForgotPassword from '../screens/auth/ForgotPassword';
import Introduction from '../screens/auth/Introduction';
import Login from '../screens/auth/Login';
import NewPassword from '../screens/auth/NewPassword';
import OTPVerification from '../screens/auth/OTPVerification';
import Splash from '../screens/auth/Splash';

// common
import Buffer from '../screens/main/Buffer';
import EditProfile from '../screens/main/EditProfile';
import Profile from '../screens/main/Profile';
import UploadDetails from '../screens/main/UploadDetails';

// supervisor
import Contract from '../screens/main/Contract';
import SupervisorAssigned from '../screens/main/SupervisorAssigned';
import SupervisorHome from '../screens/main/SupervisorHome';
import SupervisorUpload from '../screens/main/SupervisorUpload';
import SupervisorUploaded from '../screens/main/SupervisorUploaded';

// contractor
import ChangePassword from '../screens/main/ChangePassword';
import ContractorHome from '../screens/main/ContractorHome';
import ContractorUploaded from '../screens/main/ContractorUploaded';

const StackNav = () => {
  const AuthReducer = useSelector(state => state.AuthReducer);
  const UserReducer = useSelector(state => state.UserReducer);
  const {userResponse} = UserReducer;

  const AuthStack = {
    Splash,
    Introduction,
    Login,
    ForgotPassword,
    OTPVerification,
    NewPassword,
  };

  const SupervisorStack = {
    SupervisorHome,
    SupervisorAssigned,
    SupervisorUpload,
    SupervisorUploaded,
    UploadDetails,
    Profile,
    EditProfile,
    ChangePassword,
  };

  const ContractorStack = {
    ContractorHome,
    ContractorUploaded,
    UploadDetails,
    Profile,
    EditProfile,
    ChangePassword,
    Contract,
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.sushi} barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator
          options={{gestureEnabled: false}}
          screenOptions={{headerShown: false}}
          initialRouteName="Splash">
          {!AuthReducer.token ? (
            Object.keys(AuthStack).map((screen, index) => (
              <Stack.Screen
                key={index}
                name={screen}
                component={AuthStack[screen]}
              />
            ))
          ) : (
            <>
              {userResponse?.data?.role?.role == 'supervisor' ? (
                Object.keys(SupervisorStack).map((screen, index) => (
                  <Stack.Screen
                    key={index}
                    name={screen}
                    component={SupervisorStack[screen]}
                  />
                ))
              ) : userResponse?.data?.role?.role == 'contractor' ? (
                Object.keys(ContractorStack).map((screen, index) => (
                  <Stack.Screen
                    key={index}
                    name={screen}
                    component={ContractorStack[screen]}
                  />
                ))
              ) : (
                <Stack.Screen name={'Buffer'} component={Buffer} />
              )}
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default StackNav;
