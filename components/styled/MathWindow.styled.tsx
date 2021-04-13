import styled from 'styled-components'

export const MathContainer = styled.div`
  position: relative;
  background-color: #1D1F21;
  width: 80%;
  max-width: 500px;
  border-radius: 12px;
  padding: 32px 8px;

  display: flex;
  flex-direction: column;
`

const Text = styled.p`
  width: 100%;
  color: white;
  font-family: 'Overpass Mono', monospace;
  font-size: 42px;
  margin: 0;
`

export const Title = styled(Text)`
  font-size: 42px;
  text-align: center;
  margin-bottom: 32px;
`

export const FieldName = styled(Text)`
  font-size: 22px;
`

const Field = styled.div`
  width: 100%;
  min-height: 42px;
  color: black;
  font-family: 'Overpass Mono', monospace;
  font-size: 20px;
  line-height: 42px;
  background-color: #f5f5f5;
  resize: none;
  margin-bottom: 32px;
`

export const InputField = styled(Field)`
  border: none;
`

export const RPNField = styled(Field)`
  
`

export const OutputField = styled(Field)`

`