import MealPage from "../../srcs/components/MealPage";
import Layout from "../../srcs/hooks/Layout";
import cookie from 'cookie';
import requireAuthentication from "../../srcs/hooks/requiredAuthentication";
import axiosService from "../../srcs/hooks/axiosService";
import Error from "next/error";


export default function index({ data }) {
    const { status } = data;

    if (status === 503) {
        return <Error statusCode={status} title="Service not available" />
    }
    if (status === 403) {
        return <Error statusCode={status} title="You are not authorized" />
    }
    return (
        <Layout title={"1337 Restaurant | Dinner"}>
            <MealPage mealName="dinner" data={data.data} />
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


    const data = await axiosService(`${process.env.NEXT_PUBLIC_SERVER_API_URL}meals/dinner/`, cookies.token);

    if (!data.data.is_active) {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            }
        }
    } 

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

    return {
        props: { data }
    }
})