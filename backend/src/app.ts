import express,{json, urlencoded} from 'express'
import 'express-async-errors'
import { currentUserRouter,singoutRouter ,googleAuthRouter,createUrlRouter,redirectUrlRouter,getURLAnalyticsRouter, getOverallAnalyticsRouter, topicAnalyticsRouter} from './routes/index'
import { errorhandler } from './middlewares/error-handler'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { NotFoundError } from './errors/not-found-error'


const app = express()


app.use(json())
app.use(urlencoded({extended:true}))
//cookie parser
app.use(cookieParser())
//cors
app.use(cors())
//routes
app.use(googleAuthRouter)
app.use(currentUserRouter)
app.use(singoutRouter)
app.use(createUrlRouter)
app.use(redirectUrlRouter)
app.use(getURLAnalyticsRouter)
app.use(getOverallAnalyticsRouter)
app.use(topicAnalyticsRouter)
//not found route
app.all('*',async()=>{
    throw new NotFoundError();
})
//error handler
app.use(errorhandler as express.ErrorRequestHandler)
export {app}