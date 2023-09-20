import PocketBase from 'pocketbase';

const ip = process.env.NODE_ENV === "production" ? "http://localhost:8080" : "http://127.0.0.1:8090";

export const pb = new PocketBase(ip);