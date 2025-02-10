import { Request, Response, Router } from "express";
import { currentUser } from "../../middlewares/current-user";
import { requireAuth } from "../../middlewares/require-auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { body } from "express-validator";
import { Url } from "../../models/url";
import { BadRequestError } from "../../errors/bad-request-error";
import nanoi from "nanoid";
import { setValue } from "../../service/redisService";
import { createURLLimiter } from "../../middlewares/rateLimiter";
import { v6 } from "uuid";

const router = Router();
router.post('/api/url',
    currentUser,
    requireAuth,
   
        [body('longUrl')
        .trim()
        .notEmpty()
        .withMessage('Please provide a valid URL')
        .matches(/^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/[\w./?%&=-]*)?$/)
        .withMessage('Invalid URL format')],
    validateRequest,
    createURLLimiter
    ,
    async (req:Request,res:Response)=>{
        try {
            const {longUrl,topic} = req.body;
            let {shortUrl} = req.body;
            const checkUrl = await Url.findOne({userId:req.currentUser!.id,longUrl})
            if(!shortUrl){
                shortUrl =  v6().slice(-6) ;
            }
            if(checkUrl){
                throw new BadRequestError('the Url already created')
            }
           

            console.log(shortUrl)
            console.log(req.currentUser)
            
            const url =Url.build({clicks:0,createdAt:new Date,longUrl,shortUrl,topic,userId:req.currentUser!.id})
            await url.save()
            await setValue(shortUrl, longUrl)
            res.send(url)
        } catch (error:any) {
            console.error(error.message)
            throw new BadRequestError(`Failed to create url ${error.message}`)
        }

})
export {router as createUrlRouter};