import React from 'react';
import { FlatList } from 'react-native';
import { Button } from '../../components/Forms/Button';
import { categories } from '../../utils/categories';
import {
  Container,
  Header,
  Title,
  Category,
  Icon,
  Name,
  Separator,
  Footer,
} from './styles';

interface ICategory {
  key: string;
  name: string;
}

interface Props {
  category: ICategory;
  setCategory: (categoryType: ICategory) => void;
  closeSelectCategory: () => void;
}

export function CategorySelect({
  category,
  setCategory,
  closeSelectCategory,
}: Props) {
  function handleCategorySelect(categorySelected: ICategory) {
    setCategory(categorySelected);
  }

  return (
    <Container>
      <Header>
        <Title>Categoria</Title>
      </Header>

      <FlatList
        data={categories}
        style={{ flex: 1, width: '100%' }}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <Category
            onPress={() => handleCategorySelect(item)}
            isActive={category.key === item.key}
          >
            <Icon name={item.icon} isActive={category.key === item.key} />
            <Name isActive={category.key === item.key}>{item.name}</Name>
          </Category>
        )}
        ItemSeparatorComponent={() => <Separator />}
      />

      <Footer>
        <Button title="Selecionar" onPress={closeSelectCategory} />
      </Footer>
    </Container>
  );
}
