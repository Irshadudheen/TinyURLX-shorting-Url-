import { Request, Response, Router } from "express";
import { currentUser } from "../../middlewares/current-user";
import { requireAuth } from "../../middlewares/require-auth";
import Analytics from "../../models/Analytics";
import { Url } from "../../models/url";

const router = Router();
router.get('/api/analysis/overall',currentUser,requireAuth,
    async (req:Request,res:Response)=>{
        const userId = req.currentUser!.id;
      const urls = await Url.find({ userId });
      const analytics = await Analytics.aggregate([
        { $match: { urlId: { $in: urls.map((url) => url._id) } } },
        {
          $group: {
            _id: "$deviceType",
            totalClicks: { $sum: 1 },
            uniqueUsers: { $addToSet: "$uniqueVisitorId" }
          }
        }
      ]);

      // Clicks by date (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const clicksByDate = await Analytics.aggregate([
        {
          $match: {
            urlId: { $in: urls.map((url) => url._id) },
            timestamp: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            clicks: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Process device type data
      const deviceTypeData = analytics.map((item) => ({
        deviceName: item._id || "Unknown",
        uniqueClicks: item.uniqueUsers.length
      }));

      const recentActivity = await Analytics.aggregate([
        { $match: { urlId: { $in: urls.map((url) => url._id) } } },
        { $sort: { timestamp: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "urls",
            localField: "urlId",
            foreignField: "_id",
            as: "urlDetails"
          }
        },
        { $unwind: "$urlDetails" },
        {
          $project: {
            action: {
              $concat: ["Link '", "$urlDetails.shortUrl", "' was clicked"]
            },
            time: {
              $let: {
                vars: {
                  now: new Date(),
                  timeDiff: { $subtract: [new Date(), "$timestamp"] }
                },
                in: {
                  $switch: {
                    branches: [
                      {
                        case: { $lt: ["$$timeDiff", 3600000] },
                        then: {
                          $concat: [
                            {
                              $toString: {
                                $floor: { $divide: ["$$timeDiff", 60000] }
                              }
                            },
                            " minutes ago"
                          ]
                        }
                      },
                      {
                        case: { $lt: ["$$timeDiff", 86400000] },
                        then: {
                          $concat: [
                            {
                              $toString: {
                                $floor: { $divide: ["$$timeDiff", 3600000] }
                              }
                            },
                            " hours ago"
                          ]
                        }
                      }
                    ],
                    default: {
                      $concat: [
                        {
                          $toString: {
                            $floor: { $divide: ["$$timeDiff", 86400000] }
                          }
                        },
                        " days ago"
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      ]);
      res.json({
        totalUrls: urls.length,
        totalClicks: analytics.reduce((sum, a) => sum + a.totalClicks, 0),
        uniqueUsers: new Set(analytics.flatMap((a) => a.uniqueUsers)).size,
        clicksByDate: clicksByDate.map((item) => ({
          date: item._id,
          clicks: item.clicks
        })),
        deviceType: deviceTypeData,
        recentActivity: recentActivity
      });
    }
)
export {router as getOverallAnalyticsRouter};