import cookie from 'cookie';


export default function requireAuthentication(gssp) {
    return async (ctx) => {
        const { req } = ctx;
        if (req.headers.cookie) {
            const { token } = cookie.parse(req.headers.cookie);
            if (token === undefined) {
                return {
                    redirect: {
                        permanent: false,
                        destination: '/login',
                    },
                };
            }
        } else {
            return {
                redirect: {
                    permanent: false,
                    destination: '/login',
                },
            };
        }

        return await gssp(ctx);
    };
}