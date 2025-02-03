import express,{json} from 'express'
import 'express-async-errors'

import { currentUserRouter,singoutRouter ,googleAuthRouter,createUrlRouter} from './routes/index'
import { errorhandler } from './middlewares/error-handler'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { NotFoundError } from './errors/not-found-error'
const app = express()

// app.set('trust proxy',true)
app.use(json())

app.use(cookieParser())
app.use(cors())
app.use(googleAuthRouter)
app.use(currentUserRouter)
app.use(singoutRouter)
app.use(createUrlRouter)
app.all('*',async()=>{
    throw new NotFoundError();
})
app.use(errorhandler as express.ErrorRequestHandler)
export {app}