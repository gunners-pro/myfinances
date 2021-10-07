import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  width: 100%;
  height: 65%;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
`;

export const TitleWrapper = styled.View`
  align-items: center;
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ theme }) => theme.colors.shape};
  font-size: ${RFValue(30)}px;
  text-align: center;
  margin-top: 30px;
`;

export const SignInTitle = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.shape};
  font-size: ${RFValue(16)}px;
  text-align: center;
  margin-bottom: 30px;
`;

export const Footer = styled.View`
  width: 100%;
  height: 35%;
  background-color: ${({ theme }) => theme.colors.secondary};
`;
