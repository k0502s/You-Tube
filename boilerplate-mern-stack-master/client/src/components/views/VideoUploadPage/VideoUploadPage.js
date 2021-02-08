import React, { useState, useEffect } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useSelector } from 'react-redux';


const { Title } = Typography;
const { TextArea } = Input;


const PrivateOptions = [
    { value: 0, label: 'Private' },
    { value: 1, label: 'Public' }
]

const CatogoryOptions = [
    { value: 0, label: "Film & Animation" },
    { value: 0, label: "Autos & Vehicles" },
    { value: 0, label: "Music" },
    { value: 0, label: "Pets & Animals" },
    { value: 0, label: "Sports" },
]






function VideoUploadPage(props) {

    const user = useSelector(state => state.user);
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

               let variable = {
                   url:response.data.url,
                   fileName: response.data.fileName
               }

               
               setFilePath(response.data.url)


               Axios.post('/api/video/thumbnail', variable)
               .then(response => {
                   if(response.data.success){
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

    const onSumit = (e) => {
        e.preventDefault();

        const variables = {
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnail: ThumbnailPath
        }

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
