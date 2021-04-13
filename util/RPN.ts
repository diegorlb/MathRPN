const isInt = Number.isInteger


export enum Side {
  NONE,
  RIGHT,
  LEFT
}


export interface GenericOperator {
  id: string
  type: 'arithmetic' | 'bracket'
  string: () => string
}

interface Arithmetic extends GenericOperator {
  precedence: number
  associativity: Side
  action: (a: number, b: number) => number
}

interface Bracket extends GenericOperator {
  side: Side,
}


type ValidOperators = Arithmetic | Bracket


export const ArithmeticGenerator = (id: string, precedence: number, associativity: Side, action: (a: number, b: number) => number): Arithmetic => ({
  type: 'arithmetic',
  id,
  precedence,
  associativity,
  action,
  string: () => id
})

export const BracketGenerator = (id: string, side: Side): Bracket => ({
  type: 'bracket',
  id,
  side,
  string: () => id
})


const OperatorsStack = () => {
  const stack: ValidOperators[] = []

  const size = (): number => stack.length

  const top = (): ValidOperators => stack[size() - 1]

  const compare = (operator: ValidOperators): number => top()['precedence'] - operator['precedence']

  const push = (operator: ValidOperators) => stack.push(operator)

  const pop = (): ValidOperators => stack.pop()


  return {
    size,
    top,
    compare,
    push,
    pop,
  }
}


export const OperatorsController = () => {
  const operators: ValidOperators[] = []

  const add = (operator: ValidOperators) => {
    operators.push(operator)
  }

  const find = (id: string): ValidOperators => {
    let found: ValidOperators = undefined
    for (const operator of operators) {
      if (id !== operator['id']) continue
      found = operator
    }
    return found
  }

  const isValidOperator = (token: string): boolean => operators.some(({ id }) => token === id)

  const isArithmetic = (token: string): boolean => operators.some(({ id, type }) => (type === 'arithmetic') && (id === token))

  const isBracket = (token: string): boolean => operators.some(({ id, type }) => (type === 'bracket') && (id === token))

  const getSide = (bracket: ValidOperators): Side => {
    if (!bracket || (bracket as GenericOperator).type !== 'bracket') return Side.NONE
    return (bracket as Bracket).side
  }

  const getAssociativity = (operator: ValidOperators): Side => {
    if (!operator || (operator as GenericOperator).type !== 'arithmetic') return Side.NONE
    return (operator as Arithmetic).associativity
  }

  return {
    add,
    find,
    isValidOperator,
    isArithmetic,
    isBracket,
    getSide,
    getAssociativity,
  }
}


export type RPN = (number | GenericOperator)[]


export const parser = (tokens: string[], controller: ReturnType<typeof OperatorsController>): RPN => {
  const output: (number | GenericOperator)[] = []
  const stack = OperatorsStack()

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index]

    if (isInt(+token)) {
      if (index - 1 >= 0) {
        let prev = +tokens[index - 1]
        if (isInt(+prev)) {
          if (isInt(+output[output.length - 1])) prev = +output[output.length - 1]
          output.pop()
          output.push(+`${prev}${token}`)
        } else {
          output.push(+token)
        }
      } else {
        output.push(+token)
      }
      continue
    }

    if (controller.isArithmetic(token)) {
      const operator = controller.find(token)
      const associativity = controller.getAssociativity(operator)

      while (
        (stack.size() > 0) &&
        (controller.getSide(stack.top()) !== Side.LEFT) &&
        ((stack.compare(operator) > 0) || ((stack.compare(operator) === 0) && (associativity === Side.LEFT)))
      ) {
        output.push(stack.pop())
      }

      stack.push(operator)
      continue
    }

    if (controller.isBracket(token)) {
      const bracket = controller.find(token)
      const side = controller.getSide(bracket)

      if (side === Side.LEFT) {
        stack.push(bracket)
        continue
      }

      if (side === Side.RIGHT) {
        while ((stack.size() > 0) && (controller.getSide(stack.top()) !== Side.LEFT)) {
          output.push(stack.pop())
        }

        /*TODO: If the stack runs out without finding a left parenthesis, then there are mismatched parentheses. */

        if (controller.getSide(stack.top()) === Side.LEFT) {
          stack.pop()
        }

        /*
        if there is a function token at the top of the operator stack, then:
            pop the function from the operator stack onto the output queue.
        */
      }
    }
  }

  /* After while loop, if operator stack not null, pop everything to output queue */
  while (stack.size() > 0) {
    /* If the operator token on the top of the stack is a parenthesis, then there are mismatched parentheses. */
    output.push(stack.pop())
  }

  return output
}


export const execute = (rpn: RPN): number | string => {
  const stack: number[] = []
  rpn.forEach((item) => {
    if (isInt(+item)) {
      stack.push(+item)
    } else {
      const { action } = item as Arithmetic
      if (!action) return
      const a = stack.pop()
      const b = stack.pop()
      stack.push(action(b, a))
    }
  })

  return stack.pop() || 'Invalid'
}


export const stringify = (rpn: RPN): string => rpn.map((item) => {
  if (isInt(+item)) return item
  return (item as GenericOperator).string()
}).join(' ')