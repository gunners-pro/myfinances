import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import GoogleSvg from '../../assets/google.svg';
import FacebookSvg from '../../assets/facebook.svg';
import LogoSvg from '../../assets/logo.svg';
import SignInSocialButton from '../../components/SignInSocialButton';
import { useAuth } from '../../context/AuthContext';
import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper,
} from './styles';
import { SignInFacebookSocialButton } from '../../components/SignInFacebookSocialButton';

const { height, width } = Dimensions.get('window');

export function SignIn() {
  const { signInWithGoogle, signInWithFacebook } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const translateY = useSharedValue(-height / 1.5);
  const translateYStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const translateXBtnGoogle = useSharedValue(-width);
  const translateXBtnGoogleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateXBtnGoogle.value }],
  }));
  const translateXBtnFacebook = useSharedValue(width);
  const translateXBtnFacebookStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateXBtnFacebook.value }],
  }));

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 400 }, () => {
      translateXBtnGoogle.value = withTiming(0, { duration: 250 }, () => {
        translateXBtnFacebook.value = withTiming(0, { duration: 250 });
      });
    });
  }, [translateY, translateXBtnGoogle, translateXBtnFacebook]);

  function handleSignInGoogle() {
    try {
      setIsLoading(true);
      signInWithGoogle();
      setIsLoading(false);
    } catch (error) {
      Alert.alert('Não foi possível conectar a conta Google');
    }
  }

  function handleSignInFacebook() {
    try {
      setIsLoading(true);
      signInWithFacebook();
      setIsLoading(false);
    } catch (error) {
      Alert.alert('Não foi possível conectar a conta Facebook');
    }
  }

  return (
    <Container>
      <Header style={translateYStyle}>
        <TitleWrapper>
          <LogoSvg width={RFValue(140)} height={RFValue(140)} />
          <Title>
            Controle suas{'\n'}finanças de forma{'\n'}muito simples
          </Title>
        </TitleWrapper>

        <SignInTitle>
          Faça seu login com{'\n'} uma das contas abaixo
        </SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <Animated.View style={translateXBtnGoogleStyle}>
            <SignInSocialButton
              onPress={handleSignInGoogle}
              title="Entrar com Google"
              svg={GoogleSvg}
            />
          </Animated.View>
          <Animated.View style={translateXBtnFacebookStyle}>
            <SignInFacebookSocialButton
              onPress={handleSignInFacebook}
              title="Entrar com Facebook"
              svg={FacebookSvg}
            />
          </Animated.View>
        </FooterWrapper>
        {isLoading && (
          <ActivityIndicator
            color={theme.colors.shape}
            size="large"
            style={{ marginTop: 20 }}
          />
        )}
      </Footer>
    </Container>
  );
}
