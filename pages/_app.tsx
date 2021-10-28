import React, { FC } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { DefaultSeo } from 'next-seo';

import seoConfig from '@lib/seo.json';
import myTheme from '@lib/theme';

const theme = extendTheme(myTheme);

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
	return (
		<>
			<DefaultSeo {...seoConfig} />
			<Head>
				<link rel="icon" href="/favicon.png" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<ChakraProvider theme={theme}>
				<Component {...pageProps} />
			</ChakraProvider>
		</>
	);
};
export default MyApp;
