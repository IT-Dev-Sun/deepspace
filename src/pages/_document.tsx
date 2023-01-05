import Document, { Head, Html, Main, NextScript } from 'next/document'
import config from '../config'
import { ServerStyleSheet } from 'styled-components'
import { assetURL } from '../functions/deepspace'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }
  render() {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <link rel="apple-touch-icon" sizes="180x180" href={assetURL("icons/apple-touch-icon.png")} />

          <link rel="manifest" href="/site.webmanifest" />

          <link rel="mask-icon" href={assetURL("icons/safari-pinned-tab.svg")} color="#5bbad5" />

          <link rel="apple-touch-icon" href={assetURL("icons/touch-icon-iphone.png")} />
          <link rel="apple-touch-icon" sizes="152x152" href={assetURL("icons/touch-icon-ipad.png")} />
          <link rel="apple-touch-icon" sizes="180x180" href={assetURL("icons/touch-icon-iphone-retina.png")} />
          <link rel="apple-touch-icon" sizes="167x167" href={assetURL("icons/touch-icon-ipad-retina.png")} />

          <link rel="apple-touch-icon" href={assetURL("icons/apple-touch-icon.png")} />
          <link rel="apple-touch-icon-precomposed" sizes="180x180" href={assetURL("icons/apple-touch-icon-precomposed.png")} />

          <link rel="apple-touch-icon" sizes="57x57" href={assetURL("icons/apple-touch-icon-57x57.png")} />
          <link rel="apple-touch-icon-precomposed" sizes="57x57" href={assetURL("icons/apple-touch-icon-57x57-precomposed.png")} />

          <link rel="apple-touch-icon" sizes="60x60" href={assetURL("icons/apple-touch-icon-60x60.png")} />
          <link rel="apple-touch-icon-precomposed" sizes="60x60" href={assetURL("icons/apple-touch-icon-60x60-precomposed.png")} />

          <link rel="apple-touch-icon" sizes="72x72" href={assetURL("icons/apple-touch-icon-72x72.png")} />
          <link rel="apple-touch-icon-precomposed" sizes="72x72" href={assetURL("icons/apple-touch-icon-72x72-precomposed.png")} />

          <link rel="apple-touch-icon" sizes="76x76" href={assetURL("icons/apple-touch-icon-76x76.png")} />
          <link rel="apple-touch-icon-precomposed" sizes="76x76" href={assetURL("icons/apple-touch-icon-76x76-precomposed.png")} />

          <link rel="apple-touch-icon" sizes="114x114" href={assetURL("icons/apple-touch-icon-114x114.png")} />
          <link rel="apple-touch-icon-precomposed" sizes="114x114" href={assetURL("icons/apple-touch-icon-114x114-precomposed.png")} />

          <link rel="apple-touch-icon" sizes="120x120" href={assetURL("icons/apple-touch-icon-120x120.png")} />
          <link rel="apple-touch-icon-precomposed" sizes="120x120" href={assetURL("icons/apple-touch-icon-120x120-precomposed.png")} />

          <link rel="apple-touch-icon" sizes="144x144" href={assetURL("icons/apple-touch-icon-144x144.png")} />
          <link rel="apple-touch-icon-precomposed" sizes="144x144" href={assetURL("icons/apple-touch-icon-144x144-precomposed.png")} />

          <link rel="apple-touch-icon" sizes="152x152" href={assetURL("icons/apple-touch-icon-152x152.png")} />
          <link rel="apple-touch-icon-precomposed" sizes="152x152" href={assetURL("icons/apple-touch-icon-152x152-precomposed.png")} />

          <link rel="apple-touch-icon" sizes="180x180" href={assetURL("icons/apple-touch-icon-180x180.png")} />
          <link rel="apple-touch-icon-precomposed" sizes="180x180" href={assetURL("icons/apple-touch-icon-180x180-precomposed.png")} />

          <link
            href={assetURL("icons/iphone5_splash.png")}
            media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          <link
            href={assetURL("icons/iphone6_splash.png")}
            media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          <link
            href={assetURL("icons/iphoneplus_splash.png")}
            media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)"
            rel="apple-touch-startup-image"
          />
          <link
            href={assetURL("icons/iphonex_splash.png")}
            media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
            rel="apple-touch-startup-image"
          />
          <link
            href={assetURL("icons/iphonexr_splash.png")}
            media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          <link
            href={assetURL("icons/iphonexsmax_splash.png")}
            media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)"
            rel="apple-touch-startup-image"
          />
          <link
            href={assetURL("icons/ipad_splash.png")}
            media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          <link
            href={assetURL("icons/ipadpro1_splash.png")}
            media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          <link
            href={assetURL("icons/ipadpro3_splash.png")}
            media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />
          <link
            href={assetURL("icons/ipadpro2_splash.png")}
            media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
            rel="apple-touch-startup-image"
          />

          <link rel="icon" type="image/png" sizes="32x32" href={assetURL("icons/favicon-32x32.png")} />
          <link rel="icon" type="image/png" sizes="96x96" href={assetURL("icons/favicon-96x96.png")} />
          <link rel="shortcut icon" href={assetURL("icons/favicon.ico")} />

          <link rel="manifest" href="/manifest.json" />

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Goldman:wght@400;700&family=Lato:wght@400;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body
          style={{
            background: `url("${config.ASSETS_BASE_URI}/app/deepspace-background.jpg")`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            overflow: 'auto'
          }}
        >
          <Main />
          <NextScript />
          <div id="modal-root-next"></div>
        </body>
      </Html>
    )
  }
}
