import {registerAs} from "@nestjs/config";

export default registerAs('app', () => ({
    env: process.env.APP_ENV,
    url: process.env.APP_URL,
    port: process.env.APP_PORT,
    jwtSecret: process.env.APP_JWT_SECRET,
    jwtExpiresIn: process.env.APP_JWT_EXPIRES_IN,
    domain: process.env.APP_DOMAIN,
    perchwellUsername: process.env.PERCHWELL_USERNAME,
    perchwellPassword: process.env.PERCHWELL_PASSWORD
}))
