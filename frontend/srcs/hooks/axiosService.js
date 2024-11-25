import axios from "axios"

export default async function axiosService(url, token, method = 'get', data = null, restype = null, upload = false) {
    return await axios({
        method: method,
        url,
        headers: {
            "Content-Type": upload ? "text/csv" : "application/json",
            "Authorization": `Token ${token}`,
            // restype && "Response-Type": ""
        },
        data: data !== null && data,
        responseType: restype !== null && 'blob'
    })
        .then((res) => {
            return {
                data: res.data,
                status: res.status
            }
        })
        .catch((error) => {
            if (error.response) {
                return {
                    data: error.response.data,
                    status: error.response.status
                }
            } return {
                data: [],
                status: 503
            }
        })
}