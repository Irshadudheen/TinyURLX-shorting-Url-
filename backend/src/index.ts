
import mongoose from 'mongoose'
import 'dotenv/config'
import {app} from './app'
const port = 3000

const start = async()=>{
    if(!process.env.JWT_KEY){
        throw new Error('jwt key not found')
    }
    if(!process.env.MONGODB_URL){
        throw new Error('mongodb url not found')
    }
    if(!process.env.REDISPORT){
        throw new Error('redis port not found')
    }
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('conneted to mongodb')
    } catch (error) {
        console.error(error)
    }
    finally{

        app.listen(port,()=>console.log('the server is running on 3000!!!'))
    }
}
start()