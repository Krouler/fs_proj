import { Component } from "react";
import AuthForm from "./AuthForm";
import UserData from "./UserData";

class ProfilePage extends Component {
    constructor(props){
        super(props)
        this.state = {
            isButtonClicked: false,
            isRegistrationInstance: false,
            isAuthenticated: false,
        }
        this.getIsAuthenticated = this.getIsAuthenticated.bind(this)
    }

    componentDidMount() {
        this.getIsAuthenticated();
    }

    getIsAuthenticated = () => {
    let flag = this.props.authClass.getIsAuthenticated();
    this.setState({isAuthenticated: flag})
    }

    render(){
    return(
        <div className="profile" style={this.props.isPostPage ? {width: 0, opacity: 0, left: -40 + '%'}: {width: 100 + '%'}}>
            <div className="profile-header">
                <h1>Профиль</h1>
            </div>
            {this.state.isAuthenticated ? <UserData authClass={this.props.authClass} updateIsAuthenticated={this.getIsAuthenticated} />: <AuthForm authClass={this.props.authClass} updateIsAuthenticated={this.getIsAuthenticated} />}
        </div>
    )
    }

}

export default ProfilePage