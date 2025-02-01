
import mongoose from 'mongoose'
import {app} from './app'
import 'dotenv/config'
const port = 3000

const start = async()=>{
    if(!process.env.JWT_KEY){
        throw new Error('jwt key not found')
    }
    // try {
    //     await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
    //     console.log('conneted to mongodb')
    // } catch (error) {
    //     console.error(error)
    // }
    app.listen(port,()=>console.log('the server is running on 3000!!!'))
}
start()