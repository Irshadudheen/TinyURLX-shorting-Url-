import express,{json} from 'express'
import 'express-async-errors'

// import { currentUserRouter,singinRouter,singoutRouter,singupRouter } from './routes/index'
import { errorhandler } from './middlewares/error-handler'
// import cookieSession from 'cookie-session'
import cors from 'cors'
import { NotFoundError } from './errors/not-found-error'
const app = express()

// app.set('trust proxy',true)
app.use(json())

// app.use(cookieSession({signed:false
//     ,secure:process.env.NODE_ENV!=='test'
// }))
app.use(cors())
// app.use(currentUserRouter)
// app.use(singinRouter)
// app.use(singoutRouter)
app.use(singupRouter)
app.all('*',async()=>{
    throw new NotFoundError();
})
app.use(errorhandler as express.ErrorRequestHandler)
export {app}