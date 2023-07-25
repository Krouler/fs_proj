import { Component } from "react";
import CSRF_TOKENINPUT from "./CSRF_TokenInput";

class AuthForm extends Component {
constructor(props) {
    super(props);
    this.state = {
        authenticationStatus: ' ',
        isRegistration: false,
        isAuthorization: false,
        endOfRegistrationProgress: false,
        registrationState: '',
        isRegistrationButtonEnabled: true,
    }
    this.formDispatcher = this.formDispatcher.bind(this);
    this.registrationQuery = this.registrationQuery.bind(this);
    this.createRegistrationForm = this.createRegistrationForm.bind(this);
    this.toggleRegistrationButton = this.toggleRegistrationButton.bind(this);
    this.authenticateUser = this.authenticateUser.bind(this);
    this.createAuthenticationForm = this.createAuthenticationForm.bind(this);
    this.authenticationButtonHandler = this.authenticationButtonHandler.bind(this)
    this.registrationButtonHandler = this.registrationButtonHandler.bind(this)
    this.toggleIsRegistration = this.toggleIsRegistration.bind(this)
    this.toggleIsAuthorization = this.toggleIsAuthorization.bind(this)
}

    toggleIsRegistration = () => {
        this.setState({isRegistration: !this.state.isRegistration, isAuthorization: this.state.isRegistration})
    }

    toggleIsAuthorization = () => {
        this.setState({isAuthorization: !this.state.isAuthorization, isRegistration: this.state.isAuthorization})
    }

    registrationQuery = async (event) => {
        event.preventDefault();

        this.toggleRegistrationButton();
        this.setState({registrationState: 'Registration in progress...'})
        let error = {username: '', password1:'', password2: ''}
        if (event.target.password1.value !== event.target.password2.value){
            this.setState({registrationState:'password1 and password2 are not equal!', isRegistrationButtonEnabled: true})
            return () => this.createRegistrationForm(error)
        }

        let response = await fetch('http://localhost:8000/auth/registration/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRFToken': event.target.csrfmiddlewaretoken.value
            },
            body: JSON.stringify({
                username: event.target.username.value,
                password: event.target.password1.value,
                profile: {first_name: event.target.first_name.value,
                          last_name: event.target.last_name.value,
                          email: event.target.email.value,
                          about_me: event.target.about_me.value}
                
            })
        });
        let response_json = await response.json();
        if (typeof response_json.id !== 'undefined') {
        this.setState({endOfRegistrationProgress: true})
        this.setState({registrationState: ''})
        let auth_response = await this.props.authClass.getAuthTokens(event.target.username.value, event.target.password1.value);
        this.props.updateIsAuthenticated();
        return auth_response           
        } else{
            this.setState({isRegistrationButtonEnabled: true})
            this.setState({registrationState: 'Some errors happens, see in console.'})
            console.log(response_json);
            return this.formDispatcher()
        }
    }

    formDispatcher = () => {
        console.log('in dispatcher')
        if (this.state.isRegistration) {
            // this.setState({isRegistrationButtonEnabled: true})
            console.log('after setState')
            let response = this.createRegistrationForm()
            return response;
        } else {
            return this.createAuthenticationForm();
        }
    }

    registrationButtonHandler = () => {
        return this.createRegistrationForm();
    }

    authenticationButtonHandler = () => {
        return this.createAuthenticationForm();
    }

    toggleRegistrationButton = () => {
        this.setState({isRegistrationButtonEnabled: !this.state.isRegistrationButtonEnabled})
    }

    createRegistrationForm = (error = {username: '', password1: '', password2: ''}) => {
        return (
            <div className="registration-form">
            <form onSubmit={this.registrationQuery}>
                <CSRF_TOKENINPUT />
                <div className="registration-form-auth">
                    <label htmlFor="username">Ваше имя пользователя</label>
                    <input id="username" name="username" type="text" defaultValue=""/>{error.username}
                    <label htmlFor="password1">Ваш пароль</label>
                    <input id="password1" name="password1" defaultValue="" type="password"/>{error.password1}
                    <label htmlFor="password2">Подтвердите пароль</label>
                    <input id="password2" name="password2" defaultValue="" type="password" />{error.password2}
                </div>
                <h3>{this.state.registrationState === '' ? 'Статус' : this.state.registrationState}</h3>
                <div className="registration-form-profile">
                    <label htmlFor="first_name">Ваше имя</label>
                    <input id="first_name" name="first_name" defaultValue="" type="text" />
                    <label htmlFor="last_name">Ваша фамилия</label>
                    <input id="last_name" name="last_name" defaultValue="" type="text" />
                    <label htmlFor="email">Ваша электропочта</label>
                    <input id="email" name="email" defaultValue="" type="email" className="email-input" />
                    <label id="label-textarea" htmlFor="o-sebe">Расскажите о себе</label>
                    <textarea id="o-sebe" name="about_me"></textarea>
                </div>
                <button type="submit" disabled={!this.state.isRegistrationButtonEnabled}>Регистрация</button>
            </form>
            <input className="vhod-button" type="button" onClick={this.toggleIsAuthorization} defaultValue={'Войти'} />
            </div>
        )
    }

    authenticateUser = async (event) => {
        event.preventDefault();
        let authenticate = await this.props.authClass.getAuthTokens(event.target.usernameauth.value, event.target.passwordauth.value)
        if (authenticate === false) {
            this.setState({authenticationStatus: 'Invalid username or password'})
        } else {
            this.setState({authenticationStatus: ''})
        }
        this.props.updateIsAuthenticated();
        return true
    }
    

    createAuthenticationForm = () => {
        return (
            <div className="authentication">
                <form className="authentication-form" onSubmit={this.authenticateUser}>
                    <CSRF_TOKENINPUT />
                    <label htmlFor="usernameauth">Имя пользователя</label>
                    <input id="usernameauth" name="usernameauth" type="text" defaultValue=""/>
                    <label htmlFor="passwordauth">Пароль</label>
                    <input id="passwordauth" name="passwordauth" defaultValue="" type="password"/>
                    <button type="submit">Авторизоваться</button>
                    {this.state.authenticationStatus}
                </form>
                <input className="vhod-button" type="button" onClick={this.toggleIsAuthorization} defaultValue={'Регистрация'} />
            </div>
        )
    }



    render() {
        return (
            <div className="profile-page">
                <div className="auth-registr-form">
                    {(this.state.isAuthorization === this.state.isRegistration && this.state.isAuthorization === false ? <div className="choose-auth-type"><input className="vhod-button" type="button" onClick={() => this.toggleIsRegistration()} defaultValue={'Регистрация'} /><input className="vhod-button" type="button" onClick={() => this.toggleIsAuthorization()} defaultValue={'Войти'} /></div>: (this.state.isRegistration ? this.createRegistrationForm(): this.createAuthenticationForm() ))}
                </div>
            </div>
        );
    }

}

export default AuthForm