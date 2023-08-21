import { Component } from "react";
import CSRF_TOKENINPUT from "./CSRF_TokenInput";


class CreatePost extends Component {
    constructor(props){
        super(props);
        this.state = {
            errMsgOverall: ' ',
            errMsg1: ' ',
            errMsg2: ' ',
        }

    }

    formSubmitHandler = async (event) => {
        event.preventDefault();
        let access_token = await this.props.authClass.getAccessToken()
        if (event.target.caption.value === '' || event.target.description.value === '') {
            this.setState({
                errMsgOverall: 'Заголовок или текст не может быть пустым!',
                errMsg1: ' ',
                errMsg2: ' '
            })
            return
        }
        if (event.target.caption.value.length <= 3){
            this.setState({
                errMsgOverall:' ',
                errMsg1: 'Заголовок слишком короткий! Давайте, я в вас верю, придумайте что то !',
                errMsg2: ' '
            })
            return
        }
        if (event.target.description.value.length <= 10){
            this.setState({
                errMsgOverall:' ',
                errMsg1: ' ',
                errMsg2: 'Текст слишком короткий! Давайте, я в вас верю, придумайте что то !'
            })
            return
        }
        await fetch(this.props.authClass.getDomain() + 'api/post/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + access_token,
                'X-CSRFToken': event.target.csrfmiddlewaretoken.value
            },
            body: JSON.stringify({
                'caption': event.target.caption.value,
                'description': event.target.description.value
            })
        })
        this.props.setNeedUpdateData(true);
        this.props.toggleIsPostCreation();
    }

    render(){
        return (
            <div className="post-create-form">
                <form onSubmit={this.formSubmitHandler}>
                    <CSRF_TOKENINPUT/>
                    {this.state.errMsgOverall}
                    <label htmlFor="caption">Заголовок поста</label>
                    <input type="text" id="caption" defaultValue="" name="caption" />
                    {this.state.errMsg1}
                    <label htmlFor="description">Текст поста</label>
                    <textarea type="text" id="description" name="description" defaultValue=""></textarea>
                    {this.state.errMsg2}
                    <button type="submit">Опубликовать</button>
                </form>
            </div>
        )
    }

}

export default CreatePost