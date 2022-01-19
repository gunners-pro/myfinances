import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Alert,
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useForm } from 'react-hook-form';
import uuid from 'react-native-uuid';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '../../components/Forms/Button';
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';
import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes,
} from './styles';
import { CategorySelect } from '../CategorySelect';
import { InputForm } from '../../components/Forms/InputForm';
import { useAuth } from '../../context/AuthContext';

interface FormData {
  name: string;
  amount: string;
}

type NavigationProps = {
  navigate: (screen: string) => void;
};

const schema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  amount: yup
    .number()
    .typeError('Informe um valor numérico')
    .positive('O valor não pode ser negativo')
    .required('O valor é obrigatório'),
});

export function Register() {
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });
  const navigation = useNavigation<NavigationProps>();
  const { user } = useAuth();

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  function handleTransactionsTypes(type: 'positive' | 'negative') {
    setTransactionType(type);
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }

  async function handleRegister(form: FormData) {
    const collectionKey = `@myfinances:transactions_user:${user?.id}`;

    if (!transactionType) {
      return Alert.alert('Ops', 'Selecione o tipo da transação');
    }

    if (category.key === 'category') {
      return Alert.alert('Ops', 'Selecione a categoria');
    }

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date(),
    };

    try {
      const getDataTransactions = await AsyncStorage.getItem(collectionKey);
      const currentDataTransactions = getDataTransactions
        ? JSON.parse(getDataTransactions)
        : [];
      const dataTransactionsFormatted = [
        ...currentDataTransactions,
        newTransaction,
      ];

      await AsyncStorage.setItem(
        collectionKey,
        JSON.stringify(dataTransactionsFormatted),
      );

      navigation.navigate('Transações');
    } catch (error) {
      Alert.alert('Não foi possível salvar');
    } finally {
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria',
      });
      reset();
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              placeholder="Nome"
              name="name"
              control={control}
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              placeholder="Preço"
              name="amount"
              control={control}
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />
            <TransactionsTypes>
              <TransactionTypeButton
                type="up"
                title="Entrada"
                onPress={() => handleTransactionsTypes('positive')}
                isActive={transactionType === 'positive'}
              />
              <TransactionTypeButton
                type="down"
                title="Saída"
                onPress={() => handleTransactionsTypes('negative')}
                isActive={transactionType === 'negative'}
              />
            </TransactionsTypes>

            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>

          <Button title="Cadastrar" onPress={handleSubmit(handleRegister)} />
        </Form>

        <Modal
          visible={categoryModalOpen}
          animationType="slide"
          transparent
          onRequestClose={() => setCategoryModalOpen(false)}
          onDismiss={() => {}}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              paddingHorizontal: 40,
              paddingVertical: 80,
            }}
          >
            <CategorySelect
              category={category}
              setCategory={setCategory}
              closeSelectCategory={handleCloseSelectCategoryModal}
            />
          </View>
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}
