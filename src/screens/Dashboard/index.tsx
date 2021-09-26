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
  HighlightCards
} from './styles';
import { HighlightCard } from '../../components/HighlightCard';

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

        <HighlightCards>
          <HighlightCard
            title="Entradas"
            amount="R$ 17.400,00"
            lastTransaction="Último dia 13 de abril"
            type="up"
          />
          <HighlightCard
            title="Saídas"
            amount="R$ 1.259,00"
            lastTransaction="Último dia 13 de abril"
            type="down"
          />
          <HighlightCard
            title="Total"
            amount="R$ 18.659,00"
            lastTransaction="Último dia 13 de abril"
            type="total"
          />
        </HighlightCards>
      </Container>
    </>
  )
}
