const express = require('express');
const router = express.Router();
const { Comment } = require("../models/Comment");


//=================================
//            Comment
//================================


router.post('/saveComment', (req, res) => {

        const comment = new Comment(req.body)

        comment.save((err, comment) => {
            if(err) return res.json({success: false, err})
            //new 생성자로 만든 함수 comment에서는 .populate을 쓸 수 없으므로
            //Comment 자체에서 find을 이용하여 comment._id을 찾아온다.
            //그래야 .populate을 사용할 수 있다.
            Comment.find({'_id': comment._id})
            .populate('writer')
            .exec((err, result) => {
                if(err) return res.json({success: false, err})
                res.status(200).json({success: true, result})
            })


        })
     
});


router.post('/getComments', (req, res) => {

    Comment.find({"postId": req.body.videoId})
    .populate('writer')
    .exec((err, comments) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({success: true, comments})
    })
   
  });




module.exports = router;