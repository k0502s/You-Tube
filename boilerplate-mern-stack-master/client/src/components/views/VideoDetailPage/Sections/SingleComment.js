import React, {useState} from 'react';
import { Comment, Avatar, Button, Input} from 'antd';
import { useSelector } from 'react-redux' //리덕스에서 user 정보 가져옴
import Axios from 'axios'

const { TextArea } = Input;

function SingleComment(props) {

    const user = useSelector(state => state.user); //리덕스에서 user 정보 가져옴

    const [OpenReply, setOpenReply] = useState(false)
    const [CommentValue, setCommentValue] = useState("")

    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply)
    }

    const onHandleChange = (e) => {
        setCommentValue(e.currentTarget.CommentValue)
    }

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            content: CommentValue,
            writer: user.userData._id, //리덕스에서 user 정보 가져옴
            postId: props.postId,
            responseTo: props.comment._id
    
        }
    
      Axios.post('/api/comment/saveComment', variables)
      .then(response => {
          if(response.data.success){
               console.log(response.data.result)
               setCommentValue("")
               props.refreshFunction(response.data.result)
          }else {
            alert('댓글을 저장하지 못했습니다.')
        }
      })
     }
    



    const actions = [
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to">Reply to</span>
    ]
    return (
        <div>
            <Comment
            actions={actions}
            author={props.comment.writer.name}
            avatar={<Avatar src={props.comment.writer.image} alt />}
            content={<p>{props.comment.content}</p>}
            />

        {OpenReply &&  
            <form style={{display:'flex'}} onSubmit={onSubmit}>         
                <textarea
                style={{width: '100%', borderRadius: '5px'}}
                onChange={onHandleChange}
                value={CommentValue}
                placeholder="댓글 남기기"
                />
                <br />
                <button style={{width: '20%', height: '52px'}} onClick={onSubmit}>Submit</button>
            </form>}
           
        </div>
    )
}

export default SingleComment
