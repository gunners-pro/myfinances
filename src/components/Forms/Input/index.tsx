import React from 'react'
import { TextInputProps, Text } from 'react-native'
import { Container } from './styles'

type Props = TextInputProps;

export function Input({...rest}: Props) {
  return (
    <Container {...rest} />
  )
}
