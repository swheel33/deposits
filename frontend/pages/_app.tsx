import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { NotificationsProvider } from '@mantine/notifications'

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const smallScreen = useMediaQuery('(max-width: 400px)')

  return (
    <>
      <Head>
        <title>SafeDeposit</title>
      </Head>

      <MantineProvider
        theme={{ colorScheme: 'dark' , primaryColor: 'gray'}}
        withGlobalStyles
        withNormalizeCSS
        defaultProps={{
          Button: {size: smallScreen ? 'sm' : 'lg'},
          Container: {fluid: true},
          Anchor: {target: '_blank'}
        }}
      >
        <NotificationsProvider position='top-right'>
          <Component {...pageProps} />
        </NotificationsProvider>
      </MantineProvider>
    </>
  );
}