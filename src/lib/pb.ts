import PocketBase from 'pocketbase';

const ip = process.env.NODE_ENV === "production" ? "https://homeflix-v2.pockethost.io/" : "http://127.0.0.1:8090";

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("IP:", ip);

export const pb = new PocketBase(ip);