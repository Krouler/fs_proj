import getCookie from "./AuthHelper/csrf";

const CSRF_TOKENINPUT = () => {
    return(
        <input type='hidden' name='csrfmiddlewaretoken' value={getCookie('csrftoken')}></input>
    )
}
export default CSRF_TOKENINPUT