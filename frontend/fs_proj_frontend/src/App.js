//import logo from './logo.svg';
import { useState } from 'react';
import './App.css';
import ChatPage from './components/Chat';
import ProfilePage from './components/Profile';
import AuthStateToken from './components/AuthHelper/AuthClass';

function App() {
  const [isChat, chatState] = useState(true)
  const authClass = new AuthStateToken()
  authClass.setDomain('http://localhost:8000/')
  authClass.setPathToToken('token/')
  

  const clickHandler = () => {
    chatState(true)
  }

  return (
    <div className="App" id='full-size' style={{position: 'static'}}>
      <input type='button' className='trigger-button' onClick={() => chatState(false)} defaultValue='Profile' />
      <div className='content'>
        <div className='chat' onClick={clickHandler}>
          <ChatPage authClass={authClass} />
        </div>
        <ProfilePage isChat={isChat} authClass={authClass} />
      </div>
    </div>
  );
}

export default App;
