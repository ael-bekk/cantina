import DashboardSettings from "../../../srcs/components/DashboardSettings";
import Layout from "../../../srcs/hooks/Layout";
import requireAuthentication from "../../../srcs/hooks/requiredAuthentication";
import cookie from 'cookie';
import axiosService from "../../../srcs/hooks/axiosService";

export default function index({ data, identity }) {
    return (
        <Layout title={"1337 Restaurant | Dashboard Settings"}>
            <DashboardSettings data={data.data} identity={identity.data} />
        </Layout>
    )
}


export const getServerSideProps = requireAuthentication(async context => {
    const cookies = cookie.parse(context.req ? context.req.headers.cookie || "" : document.cookie);

    if (cookies.token === undefined) {
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            }
        }
    }


    const data = await axiosService(`${process.env.NEXT_PUBLIC_SERVER_API_URL}dashboard/users/`, cookies.token);

    if (data.status === 401) {
        context.res.setHeader(
            "Set-Cookie", [
            `token=deleted; Max-Age=0`,
            `is_admin=deleted; Max-Age=0`]
        );

        return {
            redirect: {
                permanent: false,
                destination: '/login'
            }
        }
    }

    const identity = await axiosService(`${process.env.NEXT_PUBLIC_SERVER_API_URL}dashboard/identity/`, cookies.token);


    return {
        props: { data, identity }
    }
})