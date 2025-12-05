import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `https://damaloy.vercel.app/`
})

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;