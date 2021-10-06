import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import {
  TransactionCard,
  TransactionCardProps,
} from '../../components/TransactionCard';

export interface DataListProps extends TransactionCardProps {
  id: number;
}

export function Dashboard() {
  const [transactions, setTransactions] = useState<DataListProps[]>([]);

  async function loadTransactions() {
    const collectionKey = '@myfinances:transactions';
    const response = await AsyncStorage.getItem(collectionKey);
    const getTransactions = response ? JSON.parse(response) : [];

    const transactionsFormatted: DataListProps[] = getTransactions.map(
      (item: DataListProps) => {
        const amount = Number(item.amount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });
        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date,
        };
      },
    );

    setTransactions(transactionsFormatted);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, []),
  );

  return (
    <>
      <StatusBar style="light" />
      <Container>
        <Header>
          <UserWrapper>
            <UserInfo>
              <Photo
                source={{
                  uri: 'https://avatars.githubusercontent.com/u/65914504?v=4',
                }}
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
            data={transactions}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => <TransactionCard data={item} />}
          />
        </Transactions>
      </Container>
    </>
  );
}
