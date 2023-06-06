import 'dotenv/config'

import fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static'
import { uploadRoutes } from './routes/upload';
import { memoriesRoute } from "./routes/memories";
import { authRoutes } from "./routes/auth";
import { resolve } from 'path';

const app = fastify();

app.register(fastifyStatic,{
    root: resolve(__dirname, '../uploads'),
    prefix: '/uploads'
})
app.register(multipart)
app.register(cors, {
    origin: true,
})
app.register(jwt, {
    secret: 'spacetime',
})
app.register(uploadRoutes)
app.register(memoriesRoute)
app.register(authRoutes)
app.listen({
    port:3333,
}).then(()=>{
    console.group('Http server running on http://localhost:3333')
})