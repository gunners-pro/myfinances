import React from 'react';
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
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
} from './styles';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

export interface DataListProps extends TransactionCardProps {
  id: number;
}

export function Dashboard() {
  const dataTransactions: DataListProps[] = [
    {
      id: 1,
      type: 'positive',
      title: 'Roupas',
      amount: 'R$ 300,59',
      category: { name: 'Casa', icon: 'dollar-sign' },
      date: '01/10/2021',
    },
    {
      id: 2,
      type: 'negative',
      title: 'Perfumes',
      amount: 'R$ 120,59',
      category: { name: 'Casa', icon: 'coffee' },
      date: '01/10/2021',
    },
    {
      id: 3,
      type: 'positive',
      title: 'Farmacia',
      amount: 'R$ 66,59',
      category: { name: 'Casa', icon: 'shopping-bag' },
      date: '01/10/2021',
    },
  ];

  return (
    <>
      <StatusBar style="light" />
      <Container>
        <Header>
          <UserWrapper>
            <UserInfo>
              <Photo
                source={{ uri: 'https://avatars.githubusercontent.com/u/65914504?v=4' }}
              />
              <User>
                <UserGreeting>Olá, </UserGreeting>
                <UserName>Fabricyo</UserName>
              </User>
            </UserInfo>

            <LogoutButton onPress={() => {}}>
              <Icon name="power" />
            </LogoutButton>

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

        <Transactions>
          <Title>Listagem</Title>

          <TransactionList
            data={dataTransactions}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <TransactionCard data={item} />}
          />
        </Transactions>
      </Container>
    </>
  );
}
