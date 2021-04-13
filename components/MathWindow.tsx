import React, { FunctionComponent, useEffect, useState } from 'react'
import { InputField, MathContainer, OutputField, RPNField, Title, FieldName } from './styled/MathWindow.styled'

import { Side, OperatorsController, ArithmeticGenerator, BracketGenerator, parser, GenericOperator, stringify, execute, RPN } from '../util/RPN'

const controller = OperatorsController()

controller.add(BracketGenerator('(', Side.LEFT))
controller.add(BracketGenerator(')', Side.RIGHT))

controller.add(ArithmeticGenerator('^', 4, Side.RIGHT, (a, b) => a ** b))
controller.add(ArithmeticGenerator('*', 3, Side.LEFT, (a, b) => a * b))
controller.add(ArithmeticGenerator('/', 3, Side.LEFT, (a, b) => a / b))
controller.add(ArithmeticGenerator('+', 2, Side.LEFT, (a, b) => a + b))
controller.add(ArithmeticGenerator('-', 2, Side.LEFT, (a, b) => a - b))


export const MathWindow: FunctionComponent = () => {
  const [input, setInput] = useState<string>('')
  const [rpn, setRPN] = useState<RPN>([])

  useEffect(() => {
    setRPN(parser(input.replaceAll(' ', '').split(''), controller))
  }, [input])

  return (
    <MathContainer>
      <Title>Math RPN</Title>

      <FieldName>Expression:</FieldName>
      <InputField as={'input'} onChange={(e) => setInput(e['target']['value'])} />
      
      <FieldName>Reverse Polish Notation:</FieldName>
      <RPNField>{stringify(rpn)}</RPNField>
      
      <FieldName>Result:</FieldName>
      <OutputField>{execute(rpn)}</OutputField>
    </MathContainer>
  )
}