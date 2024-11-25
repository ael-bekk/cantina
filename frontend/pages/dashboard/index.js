import Layout from "../../srcs/hooks/Layout";
import DashboardPage from "../../srcs/components/DashboardPage";
import cookie from 'cookie';
import requireAuthentication from "../../srcs/hooks/requiredAuthentication";
import axiosService from "../../srcs/hooks/axiosService";
import Error from "next/error";


export default function index({ data, dataAnalytics, dataAnalyticsDefaultDate }) {
    const { status } = data;

    if (status === 503) {
        return <Error statusCode={status} title="Service not available" />
    }
    if (status === 403) {
        return <Error statusCode={status} title="You are not authorized" />
    }

    return (
        <Layout title={"1337 Restaurant | Dashboard"}>
            <DashboardPage data={data.data} dataAnalytics={dataAnalytics.data} dataAnalyticsDefaultDate={dataAnalyticsDefaultDate.data} />
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


    const data = await axiosService(`${process.env.NEXT_PUBLIC_SERVER_API_URL}dashboard/meals/`, cookies.token);

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


    const dataAnalytics = await axiosService(`${process.env.NEXT_PUBLIC_SERVER_API_URL}dashboard/meals/analytics/`, cookies.token);

    if (dataAnalytics.status === 401) {
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

    const dataAnalyticsDefaultDate = await axiosService(`${process.env.NEXT_PUBLIC_SERVER_API_URL}dashboard/meals/analytics/?__start_time=null&__end_time=null`, cookies.token);

    if (dataAnalyticsDefaultDate.status === 401) {
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

    return {
        props: { data, dataAnalytics, dataAnalyticsDefaultDate }
    }
})