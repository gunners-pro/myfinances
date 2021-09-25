import React from 'react'
import { StatusBar } from 'expo-status-bar';

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
} from './styles';

export function Dashboard() {
  return (
    <>
      <StatusBar style="light" />
      <Container>
        <Header>
          <UserWrapper>
            <UserInfo>
              <Photo
                source={{uri: 'https://avatars.githubusercontent.com/u/65914504?v=4'}}
              />
              <User>
                <UserGreeting>Olá, </UserGreeting>
                <UserName>Fabricyo</UserName>
              </User>
            </UserInfo>

            <Icon name="power" />

          </UserWrapper>
        </Header>
      </Container>
    </>
  )
}
