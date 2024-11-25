import 'bootstrap/dist/css/bootstrap.css'
import 'animate.css';
import { useEffect, useRef, useState } from 'react';
import '../styles/globals.css';
import { ToastProvider } from 'react-toast-notifications';
import { Router } from 'next/router';
import Loading from '../srcs/components/Loading';
import CustomToast from '../srcs/hooks/customToast';
import { MantineProvider } from "@mantine/core";



function MyApp({ Component, pageProps }) {

  useEffect(() => {
    typeof document !== undefined ? require('bootstrap/dist/js/bootstrap') : null
  }, [])

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const start = () => void setVisible(true);
    const complete = () => void setVisible(false);

    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', complete);
    Router.events.on('routeChangeError', complete);

    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', complete);
      Router.events.off('routeChangeError', complete);
    };
  }, []);

  if (visible) return (<Loading />)

  return (
	<MantineProvider withGlobalStyles withNormalizeCSS>
      <ToastProvider autoDismissTimeout={6000} components={{ Toast: CustomToast }}>
        <Component {...pageProps} />
      </ToastProvider>
	</MantineProvider>
  )
}

export default MyApp
