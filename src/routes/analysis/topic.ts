import { Request, Response, Router } from "express";
import { param } from "express-validator";
import { validateRequest } from "../../middlewares/validateRequest";
import { currentUser } from "../../middlewares/current-user";
import { requireAuth } from "../../middlewares/require-auth";
import { createAnalyticsLimiter } from "../../middlewares/rateLimiter";
import { Url } from "../../models/url";
import Analytics from "../../models/Analytics";

const router = Router()
router.get('/api/analysis/topic/:topic',[param('topic').notEmpty()
    .withMessage('Please provide a valid topic')
],validateRequest,currentUser,requireAuth,
createAnalyticsLimiter,
async(req:Request,res:Response)=>{
    const {topic} = req.params;
    const urls = await Url.find({ userId: req.currentUser!.id, topic });
      const urlIds = urls.map((url) => url._id);

      const analytics = await Analytics.aggregate([
        { $match: { urlId: { $in: urlIds } } },
        {
          $group: {
            _id: "$urlId",
            clicks: { $sum: 1 },
            uniqueUsers: { $addToSet: "$uniqueVisitorId" }
          }
        }
      ]);

      console.log(analytics, "the analytics");

      const urlStats = urls.map((url) => {
        const urlAnalytics = analytics.find((a) => a._id.equals(url._id)) || {};
        return {
          shortUrl: url.shortUrl,
          totalClicks: urlAnalytics.clicks || 0,
          uniqueUsers: urlAnalytics.uniqueUsers?.length || 0
        };
      });

      res.json({
        topic,
        totalUrls: urls.length,
        totalClicks: analytics.reduce((sum, a) => sum + a.clicks, 0),
        uniqueUsers: new Set(analytics.flatMap((a) => a.uniqueUsers)).size,
        urls: urlStats
      });

})
export {router as topicAnalyticsRouter};