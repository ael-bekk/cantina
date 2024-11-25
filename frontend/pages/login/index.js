import LoginPage from '../../srcs/components/LoginPage';
import cookie from 'cookie';
import Layout from '../../srcs/hooks/Layout';

export default function Index() {
    return (
        <Layout title="Login page">
            <LoginPage />
        </Layout>
    )
}

export const getServerSideProps = (context) => {
    const cookies = cookie.parse(context.req ? context.req.headers.cookie || "" : document.cookie);
    if (cookies.token) {
        return {
            redirect: {
                permanent: false,
                destination: '/',
            }
        }
    }
    return {
        props: {}
    }
}