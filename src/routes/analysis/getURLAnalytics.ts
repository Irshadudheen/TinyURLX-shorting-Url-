import { Request, Response, Router } from "express";
import { param } from "express-validator";
import { validateRequest } from "../../middlewares/validateRequest";
import { Url } from "../../models/url";
import { BadRequestError } from "../../errors/bad-request-error";
import { currentUser } from "../../middlewares/current-user";
import { requireAuth } from "../../middlewares/require-auth";
import Analytics from "../../models/Analytics";
import {Types} from "mongoose";
import { createAnalyticsLimiter } from "../../middlewares/rateLimiter";

const router = Router();
router.get('/api/analysis/url/:urlId',[param('urlId').isMongoId()
    .withMessage('Please provide a valid URLId')],validateRequest,
    currentUser,
    requireAuth,
    createAnalyticsLimiter,
    async (req:Request,res:Response)=>{
        const {urlId} = req.params;
        const url = await Url.findById(urlId);
        if(!url||url.userId.toString()!==req.currentUser!.id){
            throw new BadRequestError('Url not found')
        }
        const analytics = await Analytics.aggregate([
            { $match: { urlId: new Types.ObjectId(url._id as string) } },
            {
              $group: {
                _id: null,
                totalClicks: { $sum: 1 },
                uniqueUsers: { $addToSet: "$uniqueVisitorId" },
                osType: { $addToSet: "$osType" },
                deviceTypes: { $addToSet: "$deviceType" }
              }
            }
          ]);
    
          // Aggregate click counts by date for the given URL (last 7 days)
          const clicksByDate = await Analytics.aggregate([
            { $match: { urlId: new Types.ObjectId(url._id as string) } },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                clicks: { $sum: 1 }
              }
            },
            { $sort: { _id: -1 } },
            { $limit: 7 }
          ]);
    
          res.json({
            totalClicks: analytics[0]?.totalClicks || 0,
            uniqueUsers: analytics[0]?.uniqueUsers.length || 0,
            clicksByDate: clicksByDate.map((item) => ({
              date: item._id,
              clicks: item.clicks
            })),
            osType: analytics[0]?.osType || [],
            deviceTypes: analytics[0]?.deviceTypes || []
          });
    }
)
export {router as getURLAnalyticsRouter};