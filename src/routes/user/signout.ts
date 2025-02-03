import express from 'express'

const router = express.Router()

router.post('/api/users/signout',(req,res)=>{

    res.clearCookie('jwt').send({message:'you are logout'});
})

export {router as singoutRouter};