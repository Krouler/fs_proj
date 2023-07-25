import Cookies from "universal-cookie";

class AuthStateToken {
    constructor() {
        this.cookieClass = new Cookies();
        this.domain = 'http://localhost:8000/';
        this.path_to_token = 'token/';
        this.isAuthenticated = false;
        this.setInitialIsAuthenticated();
    }

    logoutMethod = async () => {
        this.cookieClass.remove('access');
        this.cookieClass.remove('refresh');
    }

    setInitialIsAuthenticated = async () => {
        if (await this.getAccessToken() !== false){
            this.setAuthenticated();
        }
    }

    getIsAuthenticated = async () => {
        await this.getAccessToken();
        return this.isAuthenticated;
    }

    setNotAuthenticated(){
        this.isAuthenticated = false;
    }

    setAuthenticated(){
        this.isAuthenticated = true;
    }

    getDomain(){
        return this.domain;
    }

    setDomain(domain){
        this.domain = domain;
    }

    setPathToToken(path_to_token){
        this.path_to_token = path_to_token
    }

    getAuthTokens = async (username, password) => {
        let response = await fetch((this.domain + this.path_to_token), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': ''
            },
            body: JSON.stringify({
                'username': username,
                'password': password
            })
        })

        let response_json = await response.json()
        if (response_json.detail === "No active account found with the given credentials") {
            return false
        } 
        this.cookieClass.set('access', response_json.access, {maxAge: 60*3});
        this.cookieClass.set('refresh', response_json.refresh, {maxAge: 60*60*24}); 
        return await this.getAccessToken()
    }

    getAccessToken = async () => {
        if (typeof this.cookieClass.get('access') !== 'undefined' || typeof this.cookieClass.get('refresh') !== 'undefined') {
            let response_dataAccessToken = await this.checkAccessToken()
            if (response_dataAccessToken.code === 'token_not_valid') {
                if (typeof this.cookieClass.get('refresh') === 'undefined') {
                    this.setNotAuthenticated();
                    return false
                }
                let response_dataRefreshToken = await this.checkRefreshToken()
                if (response_dataRefreshToken.code === 'token_not_valid') {
                    this.setNotAuthenticated();
                    return false
                } else {
                    let token = await this.refreshAccessToken()
                    this.cookieClass.set('access', await token.access, {maxAge: 60})
                }
            }
            this.setAuthenticated();
            return this.cookieClass.get('access')
        }
        this.setNotAuthenticated();
        return false
    }

    checkAccessToken = async () => {
        let access_token = this.cookieClass.get('access')
        if (typeof access_token === 'undefined'){
            access_token = 'abc'
        }
        let response = await fetch((this.domain + this.path_to_token + 'verify/'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': ''
            },
            body: JSON.stringify({
                'token': access_token
            })
        })
        let response_json = await response.json()
        return response_json
    }

    checkRefreshToken = async () => {
        let response = await fetch((this.domain + this.path_to_token + 'verify/'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': ''
            },
            body: JSON.stringify({
                'token': this.cookieClass.get('refresh')
            })
        })
        let response_json = await response.json()
        return response_json
    }

    refreshAccessToken = async () => {
        let response = await fetch((this.domain + this.path_to_token + 'refresh/'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': ''
            },
            body: JSON.stringify({
                'refresh': this.cookieClass.get('refresh')
            })
        })
        let response_json = await response.json()
        return response_json
    }

}

export default AuthStateToken