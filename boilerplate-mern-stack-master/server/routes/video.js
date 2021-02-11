const express = require('express');
const router = express.Router();
const multer = require('multer');
var ffmpeg = require('fluent-ffmpeg');
const { Video } = require("../models/Video");
const { Subscriber }  = require("../models/Subscriber");





let storage = multer.diskStorage({
    destination: (req, file, cb) => { //동영상 업로드시 저장 파일 위치
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {//저장할 업로드 동영상 파일 이름 생성
        cb(null, `${Date.now()}_${file.originalname}`) //날짜시간 및 파일 이름을 합쳐 업로드 할 동영상 이름 만듬
    },
    fileFilter: (req, file, cb) => {// 파일 형식 필터링
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') { //mp4 형식만 통과토록 함
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
})

const upload = multer({ storage: storage }).single("file");

//=================================
//            Video
//================================

router.post('/uploadfiles', (req, res) => {

  //비디오 서버에 저장
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename })
    })

})


router.post('/uploadVideo', (req, res) => {

        //비디오 정보를 저장
        const video = new Video(req.body)

        video.save((err, doc) => {
            if(err) return res.json({ success: false, err })
            res.status(200).json({ success: true })
        })
   

})


router.get('/getVideos', (req, res) => {
        //비디오를 DB에서 가져와서 클라이언트에 보낸다.

        Video.find()
          .populate('writer') //populate을 해줘야 writer에서 받은 회원 정보 DB을 가져올 수 있다.
          .exec((err, videos) => {
              if(err) return res.status(400).send(err);
              res.status(200).json({success: true, videos})
          })
    

})

router.post('/getSubscriptionVideo', (req, res) => {
   
    // 자신의 아이디를 가지고 구독하는 사람들을 찾는다.
    Subscriber.find({userFrom: req.body.userFrom})
    .exec((err, subscriberInfo) => {
        if(err) return res.status(400).send(err);

        let SubscribedUser = [];

        //구독채널들의 정보 map으로 돌려 모두 저장
        subscriberInfo.map((subscriber, i) => {
            SubscribedUser.push(subscriber.userTo);
        })

        // 찾은 구독 채널의 주인들의 비디오를 가지고 온다.
        // $in은 몽고DB의 기능으로 하나가 아닌 여러명의 id을 가지고 복수의
        //writer들을 찾을 수 있게 되었다. 
        Video.find({writer : {$in :SubscribedUser }})
        .populate('writer')
        .exec((err, videos) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({success: true, videos})
        })


    })


    

})

router.put('/videoUpdate', (req, res) => {
    Video.findByIdAndUpdate({"_id" : req.body.videoId }, req.body)
    .exec((err) => {
        if(err) return res.status(400).send(err);
        return res.status(200).json({ success: true})
      })
    });
   



//비디오 업로드한 정보 가져오기
router.post('/getVideoDetail', (req, res) => {
   
    Video.findOne({"_id" : req.body.videoId })
     .populate('writer')
     .exec((err, videoDetail) => {
        if(err) return res.status(400).send(err);
        return res.status(200).json({ success: true, videoDetail})
    })

});


//비디오 업로드한 것 삭제
router.post('/getVideoDetailDelete', (req, res) => {
   
    Video.remove({"_id" : req.body.videoId })
     .exec((err) => {
        if(err) return res.status(400).send(err);
        return res.status(200).json({ success: true})
    })

});


//업로드 영상 썸내일 생성 처리
router.post('/thumbnail', (req, res) => {


    let filePath =""
    let fileDuration =""

    //썸네일을 ffmpeg 프로그램을 이용하여 업로드할 영상에서 생성함
    ffmpeg.ffprobe(req.body.url, function(err, metadata){
        console.dir(metadata);
        console.log(metadata.format.duration);
        //파일 듀레이션 지정
        fileDuration = metadata.format.duration
    })

    ffmpeg(req.body.url)//받은 파일 경로를 통해 해당 영상을 이용하여 썸내일 생성
    .on('filenames', function (filenames) {
        console.log('Will generate ' + filenames.join(', '))
        filePath = "uploads/thumbnails/" + filenames[0]; //썸네일 저장 파일 경로 지정
    })
    .on('end', function () {
        console.log('Screenshots taken');
                            //정해진 썸내일 파일경로와 파일듀레이션 클라이언트로 보내줌
        return res.json({ success: true, url: filePath, fileDuration: fileDuration})
    })
    .on('error', function (err){
        console.error(err);
        return res.json({success: false, err});
    })
    .screenshots({
        // Will take screens at 20%, 40%, 60% and 80% of the video
        count: 3,
        folder: 'uploads/thumbnails',
        size:'320x240',
        // %b input basename ( filename w/o extension )
        filename:'thumbnail-%b.png'
    })

   

})















module.exports = router;