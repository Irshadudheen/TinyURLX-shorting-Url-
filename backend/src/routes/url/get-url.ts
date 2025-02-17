import { Request, Response, Router } from "express";
import { Url } from "../../models/url";
import { BadRequestError } from "../../errors/bad-request-error";
import { trackAnalytics } from "../../middlewares/analytics";
import { getValue, setValue } from "../../service/redisService";
import { param } from "express-validator";

import { validateRequest } from "../../middlewares/validateRequest";
import { createURLLimiter } from "../../middlewares/rateLimiter";

const router =Router();
router.get('/api/url/:shortUrl',createURLLimiter,[param('shortUrl')
    .notEmpty().withMessage('Please provide a valid short URL')],validateRequest,
    trackAnalytics,async (req:Request,res:Response)=>{

    const {shortUrl}=req.params;
    const longUrl = await getValue(shortUrl)
   if(longUrl){

    res.redirect(longUrl)
   }else{
       
       const url = await Url.findOne({shortUrl})
       if(!url){
           throw new BadRequestError('Url not found')
        }
        url.clicks+=1;
        await url.save()
        await setValue(shortUrl,url.longUrl)
        res.redirect(url.longUrl)
    }
})
export {router as redirectUrlRouter};