// import express, { Request, Response } from 'express'
// import { body} from 'express-validator';
// import { validateRequest } from '../../middlewares/validateRequest';
// import { User } from '../../models/user';
// import { BadRequestError } from '../../errors/bad-request-error';

// import jwt from 'jsonwebtoken';

// const router = express.Router()

// router.post('/api/users/signin',[
//     body('email')
//      .isEmail()
//      .withMessage('Email must be vaild')
     
// ],validateRequest,async (req:Request,res:Response)=>{
//     const {email}=req.body;
//     const existingUser = await User.findOne({email})
//     if(!existingUser){
//         throw new BadRequestError('Invalid credentials');
//     }
    
   
//     const userJWt = jwt.sign({
//         id:existingUser.id,
//         email:existingUser.email
//     },process.env.JWT_KEY!)
//     req.cookies={jwt:userJWt};
//     res.status(200).cookie('jwt',userJWt).send(existingUser);
// })

// export {router as singinRouter};