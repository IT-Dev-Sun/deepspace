import '../bootstrap'
import '../styles/index.css'
import '../styles/starflow.scss'
import '../styles/customstyle.scss'
import * as plurals from 'make-plural'

import { Fragment, FunctionComponent } from 'react'
import { NextComponentType, NextPageContext } from 'next'
import store, { persistor } from '../state'

import type { AppProps } from 'next/app'
import ApplicationUpdater from '../state/application/updater'
import DefaultLayout from '../layouts/Default'
import Dots from '../components/Dots'
import Head from 'next/head'
import { I18nProvider } from '@lingui/react'
import ListsUpdater from '../state/lists/updater'
import MulticallUpdater from '../state/multicall/updater'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider as ReduxProvider } from 'react-redux'
import TransactionUpdater from '../state/transactions/updater'
import UserUpdater from '../state/user/updater'
import Web3ReactManager from '../components/Web3ReactManager'
import { Web3ReactProvider } from '@web3-react/core'
import dynamic from 'next/dynamic'
import getLibrary from '../functions/getLibrary'
import { i18n } from '@lingui/core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Web3ProviderNetwork = dynamic(() => import('../components/Web3ProviderNetwork'), { ssr: false })

if (typeof window !== 'undefined' && !!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

function MyApp({
  Component,
  pageProps,
}: AppProps & {
  Component: NextComponentType<NextPageContext> & {
    Guard: FunctionComponent
    Layout: FunctionComponent
    Provider: FunctionComponent
  }
}) {
  const { locale } = useRouter()

  useEffect(() => {
    async function load(locale) {
      i18n.loadLocaleData(locale, { plurals: plurals[locale?.split('_')[0]] })
      i18n.activate(locale)
    }

    if (locale !== undefined) {
      load(locale)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [locale])

  // Allows for conditionally setting a provider to be hoisted per page
  const Provider = Component.Provider || Fragment

  // Allows for conditionally setting a layout to be hoisted per page
  const Layout = Component.Layout || DefaultLayout

  // Allows for conditionally setting a guard to be hoisted per page
  const Guard = Component.Guard || Fragment

  return (
    <Fragment>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <title key="title">{process.env.NEXT_PUBLIC_PAGE_TITLE}</title>

        <meta key="description" name="description" content="" />

        <meta name="application-name" content="DEEPSPACE App" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="DEEPSPACE App" />

        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#F338C3" />

        <meta key="twitter:card" name="twitter:card" content="app" />
        <meta key="twitter:title" name="twitter:title" content="DEEPSPACE App" />
        <meta key="twitter:url" name="twitter:url" content="https://twitter.com/DeepSpaceBSC" />
        <meta
          key="twitter:description"
          name="twitter:description"
          content="DEEPSPACE crypto game & supporting NFT marketplace."
        />
        <meta key="twitter:image" name="twitter:image" content="https://branding.deepspace.game/DPS_logo_200.png" />
        <meta key="twitter:creator" name="twitter:creator" content="" />
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:site_name" property="og:site_name" content="DEEPSPACE App" />
        <meta key="og:url" property="og:url" content="" />
        <meta key="og:image" property="og:image" content="https://branding.deepspace.game/DPS_logo_96.png" />
        <meta key="og:description" property="og:description" content="" />
      </Head>
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <I18nProvider i18n={i18n} forceRenderOnLocaleChange={false}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ProviderNetwork getLibrary={getLibrary}>
            <Web3ReactManager>
              <ReduxProvider store={store}>
                <PersistGate loading={<Dots>loading</Dots>} persistor={persistor}>
                  <>
                    <ListsUpdater />
                    <UserUpdater />
                    <ApplicationUpdater />
                    <TransactionUpdater />
                    <MulticallUpdater />
                  </>
                  <Provider>
                    <Layout>
                      <Guard>
                        <Component {...pageProps} />
                      </Guard>
                    </Layout>
                  </Provider>
                </PersistGate>
              </ReduxProvider>
            </Web3ReactManager>
          </Web3ProviderNetwork>
        </Web3ReactProvider>
      </I18nProvider>
    </Fragment>
  )
}

export default MyApp
