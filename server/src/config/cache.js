import memjs from 'memjs';


const CACHE_HOST = process.env.CACHE_HOST;
const CACHE_PORT = process.env.CACHE_PORT;

const cache = memjs.Client.create(`${CACHE_HOST}:${CACHE_PORT}`);

export const cacheHelper = {
    async set(key, value, expires = 3600) {
        await cache.set(
            key,
            JSON.stringify(value),
            { expires }
        );
    },

    async get(key) {
        const result = await cache.get(key);

        if (!result.value) {
            return null;
        }

        return JSON.parse(result.value.toString());
    },

    async delete(key) {
        await cache.delete(key);
    },

    async has(key) {
        const result = await cache.get(key);
        return !!result.value;
    }
};