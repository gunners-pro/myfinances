import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import AppleSvg from '../../assets/apple.svg';
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

export function SignIn() {
  const { signInWithGoogle, signInWithFacebook } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

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
      <Header>
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
          <SignInSocialButton
            onPress={handleSignInGoogle}
            title="Entrar com Google"
            svg={GoogleSvg}
          />
          {Platform.OS === 'ios' && (
            <SignInSocialButton title="Entrar com Apple" svg={AppleSvg} />
          )}
          <SignInFacebookSocialButton
            onPress={handleSignInFacebook}
            title="Entrar com Facebook"
            svg={FacebookSvg}
          />
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
