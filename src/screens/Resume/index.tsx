import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native';
import { HistoryCard } from '../../components/HistoryCard';
import { Container, Header, Title } from './styles';
import { TransactionCardProps } from '../../components/TransactionCard';
import { categories } from '../../utils/categories';

interface TotalCategoryData {
  name: string;
  total: string;
  color: string;
}

export function Resume() {
  const [totalByCategories, setTotalByCategories] = useState<
    TotalCategoryData[]
  >([]);

  async function loadData() {
    const collectionKey = '@myfinances:transactions';
    const response = await AsyncStorage.getItem(collectionKey);
    const responseFormatted: TransactionCardProps[] = response
      ? JSON.parse(response)
      : [];

    const expensives = responseFormatted.filter(
      expensive => expensive.type === 'negative',
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
        const total = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });

        totalByCategory.push({
          name: category.name,
          total,
          color: category.color,
        });
      }
    });

    setTotalByCategories(totalByCategory);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      <ScrollView contentContainerStyle={{ padding: 24, flex: 1 }}>
        {totalByCategories.map(item => (
          <HistoryCard
            key={item.name}
            title={item.name}
            amount={item.total}
            color={item.color}
          />
        ))}
      </ScrollView>
    </Container>
  );
}
