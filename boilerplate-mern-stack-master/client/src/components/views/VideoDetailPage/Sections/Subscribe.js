import React, {useEffect, useState} from 'react'
import Axios from 'axios'



function Subscribe(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    
    let variable = {userTo: props.userTo }
    //컴포넌트 실행시 바로 구독자 수 서버에서 가져온다.
    Axios.post('/api/subscribe/subscribeNumber',variable)
    .then(response => {
        if(response.data.success){
            console.log(response.data)
            setSubscribeNumber(response.data.subscribeNumber)
        } else {
        alert('구독자 수 정보를 받지 못했습니다.')
    }
})
    //props로 받아온 해당 영상 업로드한 유저 Id와 현재 로그인 중인 유저 Id 가져와 변수로 담아줌.
    let subscribedVariable = {userTo: props.userTo, userFrom: localStorage.getItem('userId')}

    //과거에 구독했던 정보들을 해당 영상 업로드한 유저 Id와 현재 로그인 중인 유저 Id값을 토대로 가져옴
    Axios.post('/api/subscribe/subscribed', subscribedVariable)
    .then(response => {
        if(response.data.success){
            console.log(response.data)
            setSubscribed(response.data.subscribed)
        } else {
        alert('정보를 받지 못했습니다.')
    }
})

  }, [])


  //구독 버튼을 누르면 아래의 과정이 실행된다.
  const onSubscribe = () => {

    let subscribedvariable = {

        userTo: props.userTo, //props으로 비디오를 업로드한 유저 id가 들어있는 userTo 받는다.
        userFrom: props.userFrom//props으로 현재 로그인 되어있는 유저 id 값을 받는다.
    }


      //이미 구독 중이면
      if(Subscribed) {
        Axios.post('/api/subscribe/unSubscribe', subscribedvariable)
        .then(response => {
            if(response.data.success) {
                console.log(response.data)
                setSubscribeNumber(SubscribeNumber - 1) //구독상태에서 다시 누르면 구독수 감소 구현
                setSubscribed(!Subscribed)//구독, 미구독에 따른 버튼색 변화를 위한 구현

            } else {
                alert('구독 취소 실패.')
            }
        })

        //이미 구독 중이 아니라면
      } else {
        Axios.post('/api/subscribe/subscribe', subscribedvariable)
        .then(response => {
            if(response.data.success) {
                console.log(response.data)
                setSubscribeNumber(SubscribeNumber + 1)//구독이 아닌 상태에서 버튼 누르면 구독수 증가 구현
                setSubscribed(!Subscribed)//구독, 미구독에 따른 버튼색 변화를 위한 구현
            } else {
                alert('구독 실패.')
            }
        })
      }
  }

    return (                           //구독에 따른 버튼 색상 변화. 구독이면 회색, 구독이 아니면 빨강
        <div>                                   
           <button style ={{ backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius: '4px',
            color: 'white', padding: '10px 16px',
            fontWeight:'500', fontSize: '1rem', textTransform: 'uppercase' }}
            onClick={onSubscribe}
        >
              {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
           </button>
        </div>
    )
}

export default Subscribe
