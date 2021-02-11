import React, { useState, useEffect } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useSelector } from 'react-redux'; //리덕스를 통해 유저 정보 가져옴


const { Title } = Typography;
const { TextArea } = Input;


const PrivateOptions = [
    { value: 0, label: 'Private' },
    { value: 1, label: 'Public' }
]

const CatogoryOptions = [
    { value: 0, label: "Film & Animation" },
    { value: 1, label: "Autos & Vehicles" },
    { value: 2, label: "Music" },
    { value: 3, label: "Pets & Animals" },
    { value: 4, label: "Sports" },
]






function VideoUploadPage(props) {

    const user = useSelector(state => state.user);//리덕스를 통해 가져온 유저 정보 변수화
    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState("Flim & Animation")
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")
    
    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value)
    }
    
    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value)
    }

    const onCatogoryChange = (e) => {
        setCategory(e.currentTarget.value)
    }
    //업로드 영상 드랍시 실행
    const onDrop = (files) => {

        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", files[0])
        
        Axios.post('/api/video/uploadfiles', formData, config)
        .then(response => {
            if(response.data.success){
               console.log(response.data)
                //서버에서 업로드 영상 파일의 파일 경로의 url 및 이름을 받아옴
               let variable = {
                   url:response.data.url,
                   fileName: response.data.fileName
               }

               //state 값에 업로드 영상파일이 있는 파일 경로 url 담아줌
               setFilePath(response.data.url)

               //업로드할 영상 이름과 업로드 영상파일이 있는 파일 경로 url을 서버에 보내 해당 영상 썸내일 찾아옴
               Axios.post('/api/video/thumbnail', variable)
               .then(response => {
                   if(response.data.success){
                    //찾아온 썸내일 정보들을 state 값으로 넣어줌
                    setDuration(response.data.fileDuration)
                    setThumbnailPath(response.data.url)
                   }else {
                       alert('썸네일 생성 실패.')
                   }
               })


        } else {
               alert('업로드 실패.')
        }
        })
    }


    //전송버튼 실행
    const onSumit = (e) => {
        e.preventDefault();

        const variables = {
            writer: user.userData._id, //유저 정보 담아줌
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnail: ThumbnailPath
        }
        //받은 유저 정보와 입력한 폼에서 얻은 값을 서버에 보내주어 업로드한다.
        Axios.post('/api/video/uploadVideo', variables)
        .then(response => {
            if(response.data.success){
                 console.log(response.data)
                message.success('업로드 성공.')

                setTimeout(() => {
                    props.history.push("/")
                }, 3000);


            } else {
                alert('업로드 실패.')
            }
        })

    }



    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>

            
            {/*드랍 존*/}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2} > Upload Video</Title>
            </div>

            <Form onSubmit={onSumit}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Dropzone
              onDrop={onDrop}
              multiple={false}
              maxSize={100000000}
              >
                 {({ getRootProps, getInputProps }) => (
                 <div style={{ width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                 {...getRootProps()}>
                     <input {...getInputProps()} />
                     <Icon type="plus" style={{ fontSize: '3rem' }} />

                 </div>
                )}
            </Dropzone>


            {/*썸네일*/}
                {ThumbnailPath && 
                 <div>
                   <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
                 </div>
               }
              
             </div>

             <br />
             <br />

             <label>Title</label>
             <Input
             onChange={onTitleChange}
             value={VideoTitle}
             />

             <br />
             <br />

             <label>Description</label>
             <TextArea
             onChange={onDescriptionChange}
             value={Description}
             />

             <br />
             <br />

             <select onChange={onPrivateChange}>
             {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
             </select>
             <br />
             <br />
             <select onChange={onCatogoryChange}>
             {CatogoryOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
             </select>
             <br />
             <br />

            <Button type="primary" size="large" onClick={onSumit}>
                submit        
            </Button>
            </Form>

         </div>   
    )
}

export default VideoUploadPage
