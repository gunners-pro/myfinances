import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from 'react';
import * as AuthSession from 'expo-auth-session';
import * as Facebook from 'expo-facebook';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLIENT_ID = process.env.CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
const FACEBOOK_APPID = process.env.FACEBOOK_APPID;

interface FacebookResponse {
  email: string;
  id: string;
  name: string;
  picture: {
    data: {
      url: string;
    };
  };
}

interface AuthorizationResponse {
  params: {
    access_token: string;
  };
  type: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

type AuthContextData = {
  user?: User;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signOut: () => Promise<void>;
  userStorageLoading: boolean;
};

const AuthContext = createContext({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [userStorageLoading, setUserStorageLoading] = useState(true);

  async function signInWithFacebook() {
    try {
      await Facebook.initializeAsync({
        appId: FACEBOOK_APPID,
      });

      const response = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });

      if (response.type === 'success') {
        const responseUser = await fetch(
          `https://graph.facebook.com/me?fields=id,name,picture.type(large),email&access_token=${response.token}`,
        );
        const data: FacebookResponse = await responseUser.json();

        const facebookUser: User = {
          id: data.id,
          email: data.email,
          name: data.name,
          photo: data.picture.data.url,
        };
        setUser(facebookUser);
        await AsyncStorage.setItem(
          '@myfinances:user',
          JSON.stringify(facebookUser),
        );
      }
    } catch (error: any) {
      throw new Error(error as string);
    }
  }

  async function signInWithGoogle() {
    try {
      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      const { params, type } = (await AuthSession.startAsync({
        authUrl,
      })) as AuthorizationResponse;

      if (type === 'success') {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`,
        );

        const userInfo = await response.json();
        const userLogged = {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.given_name,
          photo: userInfo.picture,
        };
        setUser(userLogged);
        await AsyncStorage.setItem(
          '@myfinances:user',
          JSON.stringify(userLogged),
        );
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async function signOut() {
    setUser({} as User);
    await AsyncStorage.removeItem('@myfinances:user');
  }

  useEffect(() => {
    async function loadUserStorageData() {
      const userStoraged = await AsyncStorage.getItem('@myfinances:user');

      if (userStoraged) {
        const userLogged = JSON.parse(userStoraged) as User;
        setUser(userLogged);
      }

      setUserStorageLoading(false);
    }

    loadUserStorageData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        signInWithFacebook,
        signOut,
        userStorageLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
