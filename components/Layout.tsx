import React, { FunctionComponent } from 'react'
import Head from 'next/head'

import { LayoutWrapper } from './styled/Layout.styled'

export type LayoutProps = {
  title: string
}

export const Layout: FunctionComponent<LayoutProps> = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{`< ${title} /> - Diego Rodríguez`}</title>
        <meta charSet={'utf-8'} />
        <meta name={'viewport'} content={'initial-scale=1.0, width=device-width'} />

        <link rel={'preconnect'} href={'https://fonts.gstatic.com'} />
        <link href={'https://fonts.googleapis.com/css2?family=Overpass+Mono:wght@400;700&display=swap'} rel={'stylesheet'} />

        <link rel={'shortcut icon'} href={'/favicon.ico'} />
      </Head>
      <LayoutWrapper>
        {children}
      </LayoutWrapper>
    </>
  )
}