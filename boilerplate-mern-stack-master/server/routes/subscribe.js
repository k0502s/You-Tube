const express = require('express');
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");


//=================================
//            Subscribe
//================================

//구독자 수 처리
router.post('/subscribeNumber', (req, res) => {
   
    Subscriber.find({'userTo': req.body.userTo})
    .exec((err, subscribe) => {
        if(err) return res.status(400).send(err);
        return res.status(200).json({success: true, subscribeNumber: subscribe.length})
    })
  

})

//구독한 정보을 id값을 토대로 찾아 클라이언트로 보내줌
router.post('/subscribed', (req, res) => {
    Subscriber.find({ 'userTo': req.body.userTo, 'userFrom': req.body.userFrom})
    .exec((err, subscribe) => {
        if(err) return res.status(400).send(err);
        let result = false
        if(subscribe.length !== 0){
            result = true
        }
        res.status(200).json({success: true, subscribed: result})
    })
   
})

//구독 취소 처리
router.post('/unSubscribe', (req, res) => {
   
    Subscriber.findOneAndDelete({userTo:req.body.userTo, userFrom: req.body.userFrom})
    .exec((err, doc) => { //doc에는 Subscriber DB안에 들어있는 document 값이 들어있다.
        if(err) return res.status(400).json({ success: false, err})
        res.status(200).json({success: true, doc})
    })
   
});


//새롭게 구독 처리 해줌.
router.post('/subscribe', (req, res) => {

    const subscribe =new Subscriber(req.body)
   
    subscribe.save((err, doc) => {
        if(err) return res.json({success: false, err})
        res.status(200).json({success: true})
    })
   
});



module.exports = router;