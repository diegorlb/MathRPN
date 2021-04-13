import React, { FunctionComponent } from 'react'
import { Layout } from '../components/Layout'
import { MathWindow } from '../components/MathWindow'



const Index: FunctionComponent = () => {

  return (
    <Layout title={'Math RPN'}>
      <MathWindow />
    </Layout>
  )
}

export default Index