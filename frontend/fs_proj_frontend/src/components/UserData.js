import { Component } from "react";
import CSRF_TOKENINPUT from "./CSRF_TokenInput";

class UserData extends Component {
    constructor(props){
        super(props)
        this.state = {
            user_id: ' ',
            first_name: ' ',
            last_name: ' ',
            email: ' ',
            about_me: ' ',
            isEdit: false,
        }

        this.getUserData = this.getUserData.bind(this);
        this.retrieveUserData = this.retrieveUserData.bind(this);
        this.logoutButtonHandler = this.logoutButtonHandler.bind(this);
        this.toggleIsEdit = this.toggleIsEdit.bind(this)
        this.renderDependsOnIsEdit = this.renderDependsOnIsEdit.bind(this)
        this.editSubmitHandler = this.editSubmitHandler.bind(this)
        this.fetchingData = this.fetchingData.bind(this)
    }

    fetchingData = async (access_token) => {
        let userData = await fetch(this.props.authClass.getDomain()+'auth/profile/me/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + access_token,
            }
        });
        return userData
    }

    getUserData = async () => {
        let access_token = this.props.authClass.cookieClass.get("access")
        if (typeof access_token === 'undefined'){
            access_token = await this.props.authClass.getAccessToken()
        }
        let userData = await this.fetchingData(access_token);
        if (userData.status === 401){
            access_token = await this.props.authClass.getAccessToken()
            userData = await this.fetchingData(access_token);
        }
        let userData_json = await userData.json();
        return await userData_json.profile
    }

    retrieveUserData = async () => {
        let data = await this.getUserData();
        if (typeof data !== 'undefined'){
            this.setState({ user_id: data.user,
                            first_name: data.first_name,
                            last_name: data.last_name,
                            email: data.email,
                            about_me: data.about_me})
        }
    }

    async componentDidMount() {
        await this.retrieveUserData();
    }

    logoutButtonHandler = async () => {
        await this.props.authClass.logoutMethod();
        await this.props.authClass.setNotAuthenticated();
        this.props.updateIsAuthenticated();
    }

    toggleIsEdit = () => {
        this.setState({isEdit: !this.state.isEdit})
    }

    collectListOfFields = (event) => {
        let resultObject = {}
        if (this.state.first_name !== event.target.first_name.value) {
            resultObject.first_name = event.target.first_name.value;
        }
        if (this.state.last_name !== event.target.last_name.value) {
            resultObject.last_name = event.target.last_name.value;
        }
        if (this.state.email !== event.target.email.value) {
            resultObject.email = event.target.email.value;
        }
        if (this.state.about_me !== event.target.about_me.value) {
            resultObject.about_me = event.target.about_me.value;
        }
        return resultObject
    }

    editSubmitHandler = async (event) => {
        event.preventDefault();
        let inputData = this.collectListOfFields(event);
        let requestMethod = 'PATCH';
        if (Object.keys(inputData).length === 4) {
            requestMethod = 'PUT';
        } else if (Object.keys(inputData).length === 0){
            this.toggleIsEdit();
            return 
        }
        let access_token = await this.props.authClass.getAccessToken()
        if (await access_token === false) {
            this.logoutButtonHandler();
            return
        }
        let data = await fetch(this.props.authClass.getDomain()+'auth/profile/me/', {
            method: requestMethod,
            headers: {
                'X-CSRFToken': event.target.csrfmiddlewaretoken.value,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + access_token
            },
            body: JSON.stringify(inputData)
        })
        let data_json = await data.json();
        this.setState(await data_json)
        this.toggleIsEdit();
        return 
    }

    renderDependsOnIsEdit(){
        if (this.state.isEdit){
            return (
                <div className="edit-profile">
                    <div className="edit-profile-form">
                        <form onSubmit={this.editSubmitHandler}>
                            <CSRF_TOKENINPUT />
                            <div className="profile-form">
                                <label htmlFor="first_name">Ваше имя</label>
                                <input id="first_name" name="first_name" defaultValue={this.state.first_name} type="text" />
                                <label htmlFor="last_name">Ваша фамилия</label>
                                <input id="last_name" name="last_name" defaultValue={this.state.last_name} type="text" />
                                <label htmlFor="email">Ваша электропочта</label>
                                <input id="email" name="email" defaultValue={this.state.email} type="email" className="email-input" />
                                <label id="label-textarea" htmlFor="o-sebe">Расскажите о себе</label>
                                <textarea id="o-sebe" name="about_me" defaultValue={this.state.about_me}></textarea>
                            </div>
                            <button type="submit" >Изменить</button>
                        </form>
                    </div>
                    <div className="edit-profile-toggle-button">
                        <input type="button" defaultValue="Отмена" onClick={this.toggleIsEdit} />
                    </div>
                </div>
                )
        }
        return (<div className="user-data" >
        <div className="profile-content">
            <h1>{this.state.last_name + ' ' + this.state.first_name}</h1>
            <p className="email-profile">{this.state.email}</p>
            <p className="about-me-profile">{this.state.about_me}</p>
        </div>
        <div className="profile-footer">
            <input className="edit-profile-button" type="button" defaultValue="Изменить профиль" onClick={this.toggleIsEdit} />
            <input type="button" defaultValue='Выход' onClick={this.logoutButtonHandler} />
        </div>
    </div>)
    }



    render(){
        return(
            <div className="profile-page">
                { this.renderDependsOnIsEdit() } 
            </div>
        )
    }

}

export default UserData
