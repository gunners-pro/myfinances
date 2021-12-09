import React, { useState, useEffect, useCallback } from 'react';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components';
import { Swipeable } from 'react-native-gesture-handler';
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
  LoadingContainer,
  RightActions,
  ListEmptyTransaction,
} from './styles';
import { HighlightCard } from '../../components/HighlightCard';
import {
  TransactionCard,
  TransactionCardProps,
} from '../../components/TransactionCard';
import { useAuth } from '../../context/AuthContext';

export interface DataListProps extends TransactionCardProps {
  id: number;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string | undefined;
}

interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>(
    {} as HighlightData,
  );
  const { signOut, user } = useAuth();

  function getLastTransactionDate(
    collection: DataListProps[],
    type: 'positive' | 'negative',
  ) {
    const collectionFiltered = collection.filter(
      transaction => transaction.type === type,
    );

    if (collectionFiltered.length === 0) return 0;

    const lastTransaction = new Date(
      // eslint-disable-next-line prefer-spread
      Math.max.apply(
        Math,
        collectionFiltered.map(transaction =>
          new Date(transaction.date).getTime(),
        ),
      ),
    );

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString(
      'pt-BR',
      { month: 'long' },
    )}`;
  }

  const removeTransaction = useCallback(
    async (id: number) => {
      const collectionKey = `@myfinances:transactions_user:${user?.id}`;
      const response = await AsyncStorage.getItem(collectionKey);
      const getTransactions: DataListProps[] = response
        ? JSON.parse(response)
        : [];

      const newData = getTransactions.filter(
        transaction => transaction.id !== id,
      );

      await AsyncStorage.setItem(collectionKey, JSON.stringify(newData));
      const newTransactions = transactions.filter(
        transaction => transaction.id !== id,
      );

      setTransactions(newTransactions);
    },
    [user?.id, transactions],
  );

  const loadTransactions = useCallback(async () => {
    const collectionKey = `@myfinances:transactions_user:${user?.id}`;
    const response = await AsyncStorage.getItem(collectionKey);
    const getTransactions = response ? JSON.parse(response) : [];
    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted: DataListProps[] = getTransactions.map(
      (item: DataListProps) => {
        if (item.type === 'positive') {
          entriesTotal += Number(item.amount);
        } else {
          expensiveTotal += Number(item.amount);
        }

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

    let lastTransactionEntries;
    let lastTransactionExpensives;
    let totalInterval;

    // formated last dates of list ===============================
    if (getTransactions.length > 0) {
      lastTransactionEntries = getLastTransactionDate(
        getTransactions,
        'positive',
      );
      lastTransactionExpensives = getLastTransactionDate(
        getTransactions,
        'negative',
      );

      totalInterval =
        lastTransactionExpensives === 0
          ? 'Não há transações'
          : `01 a ${lastTransactionExpensives}`;
    }

    // formated last dates of list ===============================

    const total = entriesTotal - expensiveTotal;

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: !lastTransactionEntries
          ? 'Não há entradas'
          : `Última entrada dia ${lastTransactionEntries}`,
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: !lastTransactionExpensives
          ? 'Não há saídas'
          : `Última saída dia ${lastTransactionExpensives}`,
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: totalInterval,
      },
    });

    setIsLoading(false);
  }, [user?.id]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [loadTransactions]),
  );

  return (
    <>
      <StatusBar style="light" />
      {isLoading ? (
        <LoadingContainer>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </LoadingContainer>
      ) : (
        <>
          <Container>
            <Header>
              <UserWrapper>
                <UserInfo>
                  <Photo
                    source={{
                      uri: user?.photo,
                    }}
                  />
                  <User>
                    <UserGreeting>Olá, </UserGreeting>
                    <UserName>{user?.name}</UserName>
                  </User>
                </UserInfo>

                <LogoutButton onPress={signOut}>
                  <Icon name="power" />
                </LogoutButton>
              </UserWrapper>
            </Header>

            <HighlightCards>
              <HighlightCard
                title="Entradas"
                amount={highlightData.entries.amount}
                lastTransaction={highlightData.entries.lastTransaction}
                type="up"
              />
              <HighlightCard
                title="Saídas"
                amount={highlightData.expensives.amount}
                lastTransaction={highlightData.expensives.lastTransaction}
                type="down"
              />
              <HighlightCard
                title="Total"
                amount={highlightData.total.amount}
                lastTransaction={highlightData.total.lastTransaction}
                type="total"
              />
            </HighlightCards>

            <Transactions>
              <Title>Transações</Title>

              <TransactionList
                data={transactions}
                keyExtractor={item => String(item.id)}
                renderItem={({ item }) => (
                  <Swipeable
                    renderRightActions={() => (
                      <RightActions onPress={() => removeTransaction(item.id)}>
                        <Feather name="trash-2" color="#fff" size={22} />
                      </RightActions>
                    )}
                    overshootRight={false}
                  >
                    <TransactionCard data={item} />
                  </Swipeable>
                )}
                ListEmptyComponent={() => (
                  <ListEmptyTransaction>Nenhuma transação</ListEmptyTransaction>
                )}
              />
            </Transactions>
          </Container>
        </>
      )}
    </>
  );
}
