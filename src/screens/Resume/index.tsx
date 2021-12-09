import React, { useCallback, useState } from 'react';
import { VictoryPie } from 'victory-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, ScrollView, Text } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTheme } from 'styled-components';
import { useFocusEffect } from '@react-navigation/native';
import { HistoryCard } from '../../components/HistoryCard';
import {
  Container,
  Header,
  Title,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  SelectIcon,
  Month,
  LoadingContainer,
} from './styles';
import { TransactionCardProps } from '../../components/TransactionCard';
import { categories } from '../../utils/categories';
import { useAuth } from '../../context/AuthContext';

interface TotalCategoryData {
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  percent: string;
}

export function Resume() {
  const [isLoading, setIsLoading] = useState(true);
  const [totalByCategories, setTotalByCategories] = useState<
    TotalCategoryData[]
  >([]);
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { user } = useAuth();

  function handleDateChange(action: 'next' | 'prev') {
    setIsLoading(true);
    if (action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }

  async function loadData() {
    const collectionKey = `@myfinances:transactions_user:${user?.id}`;
    const response = await AsyncStorage.getItem(collectionKey);
    const responseFormatted: TransactionCardProps[] = response
      ? JSON.parse(response)
      : [];

    const expensives = responseFormatted.filter(
      expensive =>
        expensive.type === 'negative' &&
        new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
        new Date(expensive.date).getFullYear() === selectedDate.getFullYear(),
    );

    const expensiveTotal = expensives.reduce(
      (acc, expensive) => acc + Number(expensive.amount),
      0,
    );

    const totalByCategory: TotalCategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      expensives.forEach(expensive => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });

      if (categorySum > 0) {
        const totalFormatted = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });

        const percent = `${((categorySum / expensiveTotal) * 100).toFixed(0)}%`;

        totalByCategory.push({
          name: category.name,
          total: categorySum,
          totalFormatted,
          color: category.color,
          percent,
        });
      }
    });

    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate]),
  );

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      {isLoading ? (
        <LoadingContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadingContainer>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        >
          <MonthSelect>
            <MonthSelectButton onPress={() => handleDateChange('prev')}>
              <SelectIcon name="chevron-left" />
            </MonthSelectButton>

            <Month>
              {format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}
            </Month>

            <MonthSelectButton onPress={() => handleDateChange('next')}>
              <SelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>

          {totalByCategories.length > 0 ? (
            <ChartContainer>
              <VictoryPie
                data={totalByCategories}
                x="percent"
                y="total"
                colorScale={totalByCategories.map(category => category.color)}
                style={{
                  labels: {
                    fontSize: RFValue(18),
                    fontWeight: 'bold',
                    fill: theme.colors.shape,
                  },
                }}
                labelRadius={50}
              />
            </ChartContainer>
          ) : (
            <Text
              style={{
                textAlign: 'center',
                marginTop: 30,
                color: theme.colors.text,
                fontFamily: theme.fonts.regular,
              }}
            >
              Nenhum dado
            </Text>
          )}

          {totalByCategories.map(item => (
            <HistoryCard
              key={item.name}
              title={item.name}
              amount={item.totalFormatted}
              color={item.color}
            />
          ))}
        </ScrollView>
      )}
    </Container>
  );
}
