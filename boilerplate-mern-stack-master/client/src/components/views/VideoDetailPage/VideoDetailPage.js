import React, {useEffect, useState } from 'react'
import { Row, Col, List, Avatar, Button} from 'antd';
import { Link } from "react-router-dom";
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';
import LikeDislikes from './Sections/LikeDislikes';


function VideoDetailPage(props) {

        
        const videoId = props.match.params.videoId 

        const variable = { videoId: videoId } 
        
        const [VideoDetail, setVideoDetail] = useState([])
        const [Comments, setComments] = useState([])


    useEffect(() => {
        //컴포넌트 실행되면 바로 id값을 토대로 비디오 정보들 가져온다.
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.videoDetail)
                    setVideoDetail(response.data.videoDetail)
                } else {
                    alert('비디오 가져오기 실패')
                }
            })
            //댓글 또한 id값을 토대로 가져온다.
        Axios.post('/api/comment/getComments', variable)
        .then(response => {
            if(response.data.success){
                setComments(response.data.comments)
                console.log(response.data.comments)
            } else {
                alert('댓글 가져오기 실패')
            }
        })

    }, [])

    //댓글 작성 후 submit 후 자동으로 초기화 시켜주어 댓글 바로 등장하게 함.
    const refreshFunction = (newComment) => {
        setComments(Comments.concat(newComment))
    }


    //비디오 삭제
    const deletevideo = () => {
        Axios.post('/api/video/getVideoDetailDelete', variable)
        .then(response => {
            if (response.data.success) {
                props.history.push('/')
            } else {
                alert('동영상 삭제 실패.')
            }
        })
    }

    


    if(VideoDetail.writer){
          //현재 로그인한 유저 정보와 비디오를 업로드한 유저정보가 일치 불일치에 따른 기능의 존재 유무설정가능.
        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && 
        //만약 업로드한 유저와 현재 로그인 한 유저가 같다면 구독 버튼 사라지게 하였다.
        <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')}/>
        return (

               <Row gutter={[16, 16]}>
               <Col lg={18} xs={24}>
               <div style={{width: '100%', padding: '3rem 4rem'}}>
                    <video style={{width: '100%'}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />
    
                    <List.Item
                    actions={[<LikeDislikes video userId={localStorage.getItem('userId')} videoId={videoId}/>, subscribeButton]}
                    >
                        <List.Item.Meta
                        avatar={<Avatar src={VideoDetail.writer.image}/>}
                        title={VideoDetail.writer.name}
                        description={VideoDetail.description}
                        />
    
                    </List.Item>
                    {VideoDetail.writer._id === localStorage.getItem('userId') && 
                     <Button onClick={deletevideo}>
                     삭제
                   </Button>
                   }
                     
                     {VideoDetail.writer._id === localStorage.getItem('userId') &&
                    <Link
                       to={"/Update/" + videoId}
                      className="badge badge-warning"
                     >
                     편집
                     </Link>
                    }
                   
                    {/* Comments*/}{/*Comment 콤퍼넌트에 비디오에 관한 여러 정보들을 porps로 보내줌. */}
                    <Comment refreshFunction={refreshFunction} commentLists={Comments} postId={videoId}/>
               </div>
               
               
               </Col>

               <Col lg={6} xs={24}>
                <SideVideo />
               </Col>
               
               </Row>
            
            
        )
    } else {
        return(
            <div>...loading</div>
        )
       
    }
    
}



export default VideoDetailPage
