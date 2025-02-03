import { Router } from "express";

const router =Router();
router.get('/api/url/:shortUrl',(req,res)=>{
    res.send('Hello World');
})