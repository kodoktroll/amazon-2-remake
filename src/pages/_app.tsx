import { Provider } from 'react-redux'
import { store } from "../app/store"
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider as AuthProvider } from 'next-auth/client';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider session={pageProps.session}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </AuthProvider>
  )
}
export default MyApp
