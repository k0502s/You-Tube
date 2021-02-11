import React, {useEffect, useState} from 'react'
import { FaCode } from "react-icons/fa";
import { Card, Avatar, Col, Typography, Row} from 'antd';
import Axios from 'axios';
import moment from 'moment';
import '../../../index.css';

const { Title } = Typography;
const { Meta } = Card;


function LandingPage(props) {

const [Video, setVideo] = useState([])



    useEffect(() => {
        //DB에 저장된 비디오들 다 불러온다.
        Axios.get('/api/video/getVideos')
        .then(response => {
            if(response.data.success){
                console.log(response.data)
                setVideo(response.data.videos)
            }else{
                alert('비디오 가져오기 실패.')
            }
        })


    }, []) //[]이면 딱 한 번 실행, [] 없으면 계속 실행되버림

//불러온 비디오들을 map을 이용하여 뿌려준다. 그리고 변수화하여 모듈화
    const renderCards = Video.map((video, index) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);
        
       return  <Col lg={6} md={8} xs={24}  key={index}>
       
           <div style={{ position: 'relative' }}>
           <a href={`/video/${video._id}`} >
           <img style={{ width: '100%' }} alt="thumbnail" src={`http://localhost:5000/${video.thumbnail}`} />
           <div className="duration">
               <span>{minutes} : {seconds}</span>
               </div>
               </a>
           </div>
       <br />
       <Meta
           avatar={
               <Avatar src={video.writer.image} />
           }
           title={video.title}
           description=""
       />
       <span>{video.writer.name} </span><br />
       <span style={{ marginLeft: '3rem' }}> {video.views} views</span> 
       - <span> {moment(video.createdAt).format("MMM Do YY")} </span>
   </Col>
    })

    return (
        <div style={{width:'85%', margin:'3rem auto'}}>

            <Title level={2}>Recommended</Title>
         <hr />
         <Row gutter={[32, 16]}>
         {renderCards} {/*모듈화한 비디오 정보를 보여주는 코드를 담은 변수를 여기에 적용 */}
            



         </Row>
        </div>
    )
}

export default LandingPage
