import axios from 'axios';

export default axios.create({
    baseURL: import.meta.env.VITE_APP_HASURA_URL,
    headers: {
        'X-Hasura-Admin-Secret': import.meta.env.VITE_APP_HASURA_SECRET_KEY,
    },
});