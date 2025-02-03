import { Request, Response, Router } from "express";
import { currentUser } from "../../middlewares/current-user";
import { requireAuth } from "../../middlewares/require-auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { body } from "express-validator";
import { Url } from "../../models/url";
import { BadRequestError } from "../../errors/bad-request-error";

const router = Router();
router.post('/api/url',
    currentUser,
    requireAuth,
    [body('largeUrl').isEmpty().withMessage('Please provide a valid url')],
    validateRequest,
    async (req:Request,res:Response)=>{
        try {
            const {largeUrl} = req.body;
            const url =Url.build({clicks:3,createdAt:new Date,longUrl:'dd',shortUrl:"d",topic:"dd",userId:'d'})
            await url.save()
            res.send(url)
        } catch (error:any) {
            console.error(error.message)
            throw new BadRequestError(`Failed to create url ${error.message}`)
        }

})
export {router as createUrlRouter};