import React, { useState } from 'react'
import { Modal } from 'react-native';
import { Button } from '../../components/Forms/Button'
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton'
import { Input } from '../../components/Forms/Input'
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton'
import { Container, Header, Title, Form, Fields, TransactionsTypes } from './styles'
import { CategorySelect } from '../CategorySelect';

export function Register() {
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  })

  function handleTransactionsTypes(type: 'up' | 'down') {
    setTransactionType(type)
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false)
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true)
  }

  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>

      <Form>
        <Fields>
          <Input placeholder="Nome" />
          <Input placeholder="Preço" />
          <TransactionsTypes>
            <TransactionTypeButton
              type="up"
              title="Income"
              onPress={() => handleTransactionsTypes('up')}
              isActive={transactionType === 'up'}
            />
            <TransactionTypeButton
              type="down"
              title="Outcome"
              onPress={() => handleTransactionsTypes('down')}
              isActive={transactionType === 'down'}
            />
          </TransactionsTypes>

          <CategorySelectButton
           title={category.name}
           onPress={handleOpenSelectCategoryModal}
          />
        </Fields>

        <Button title="Enviar" />
      </Form>

      <Modal visible={categoryModalOpen}>
        <CategorySelect
           category={category}
           setCategory={setCategory}
           closeSelectCategory={handleCloseSelectCategoryModal}
        />
      </Modal>

    </Container>
  )
}
