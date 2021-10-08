import React from 'react';
import { Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
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

export function SignIn() {
  const { signInWithGoogle } = useAuth();

  async function handleSignIn() {
    try {
      signInWithGoogle();
    } catch (error) {
      Alert.alert('Não foi possível conectar a conta Google');
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
            onPress={handleSignIn}
            title="Entrar com Google"
            svg={GoogleSvg}
          />
          <SignInSocialButton title="Entrar com Apple" svg={AppleSvg} />
        </FooterWrapper>
      </Footer>
    </Container>
  );
}
