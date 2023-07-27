//import logo from './logo.svg';
import { useState } from 'react';
import './App.css';
import PostPage from './components/Post';
import ProfilePage from './components/Profile';
import AuthStateToken from './components/AuthHelper/AuthClass';

function App() {
  const [isPostPage, postPageState] = useState(true)
  const authClass = new AuthStateToken()
  authClass.setDomain('http://localhost:8000/')
  authClass.setPathToToken('token/')
  
  const clickHandlerIfNotAuthed = () => {
    postPageState(false);
  }

  const clickHandler = () => {
    postPageState(true);
  }

  return (
    <div className="App" id='full-size' style={{position: 'static'}}>
      <input type='button' className='trigger-button' onClick={() => postPageState(false)} defaultValue='Профиль' />
      <div className='content'>
        <div className='post-page' onClick={clickHandler}>
          <PostPage authClass={authClass} toggleIsPost={clickHandlerIfNotAuthed} />
        </div>
        <ProfilePage isPostPage={isPostPage} authClass={authClass} />
      </div>
    </div>
  );
}

export default App;
