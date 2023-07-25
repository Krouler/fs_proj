import { Component } from "react";

class ChatPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            isAuthenticated: false,
            postIsOpened: false,
        }

        this.testButtonHandler = this.testButtonHandler.bind(this)
        this.getIsAuthenticated = this.getIsAuthenticated.bind(this)
        this.getIsAuthenticated();

    }

    componentDidMount(){
        this.getIsAuthenticated();
    }

    getIsAuthenticated = async () => {
        let flag = await this.props.authClass.getIsAuthenticated();
        this.setState({isAuthenticated: await flag})
        return await flag
    }

    testButtonHandler = async () => {
        if (await this.getIsAuthenticated()){
            console.log('pepega')
        } else { console.log('popoga')}
    }
    

    render(){
        return(
            <div className="chat-class">
                <div className="post-detail">
                    <h1>TIS DETAIL PAGE</h1>
                </div>
                <div className="posts">
                    <div className="post-list-header">
                    </div>
                    <div className="post-list">
                    <h1>TIS LIST PAGE</h1>
                    </div>
                    <div className="posts-add-new">
                    <input type="button" defaultValue="Создать пост" onClick={this.testButtonHandler} />
                    </div>
                </div>
            </div>
        )
    }

}

export default ChatPage