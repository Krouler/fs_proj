import { Component } from "react";
import CSRF_TOKENINPUT from "./CSRF_TokenInput";

class PostDetail extends Component {
    constructor(props){
        super(props);
        this.state = {
            postCreatedBy: ' ',
            postCaption: ' ',
            postCreatedById: ' ',
            postDescription: ' ',
            postCreatedAt: ' ',
            postUpdatedAt: ' ',
            postComments: ' ',
            isDataLoaded: false,
            debugState: 1,
            deleteWinodwIsActive: false,
            editDataIsActive: false,
            postData: {postId: 0},
        }

        this.representData = this.representData.bind(this)
        this.clearButtorHandler = this.clearButtorHandler.bind(this)
        this.showDeleteConfirmationWindow =  this.showDeleteConfirmationWindow.bind(this)
        this.declineDeleteConfirmationWindowButtonHandler =  this.declineDeleteConfirmationWindowButtonHandler.bind(this)
        this.deletePostButtonHandler = this.deletePostButtonHandler.bind(this)
        this.acceptDeletePost = this.acceptDeletePost.bind(this)
        this.performDelete = this.performDelete.bind(this)
        this.editPostButtonHandler = this.editPostButtonHandler.bind(this)
        this.showEditPostForm = this.showEditPostForm.bind(this)
        this.dataForRepresentation = this.dataForRepresentation.bind(this)

    }

    representData = () => {
        return (
            <div className="post-detail-list-item">
                <input type="button" className="post-detail-represent-clear-button" defaultValue={"❌"} onClick={() => this.clearButtorHandler()} />
                {this.state.editDataIsActive ? this.showEditPostForm() : this.dataForRepresentation()}
                {this.state.postData.postUserId === this.state.postData.userId ? this.activateButtonsIfAuthed.bind(this)() : null}
            </div>
        )
    }

    dataForRepresentation = () => {
        let comment_list = [];
        let flag = false
        if (this.state.postData.postComments.length > 0){
            flag = true
            this.state.postData.postComments.forEach(element => {
                comment_list.push(<div key={element.id} className="post-detail-comment-item">
                    <h3 className="post-detail-comment-item-created-by" >{element.commented_by}</h3>
                    <p className="post-detail-comment-item-text">{element.text}</p>
                    </div>)
            });
        }

        return (
            <div className="post-detail-list-item">
                <div className="post-detail-represent-info">
                    <h1 className="post-detail-caption">{this.state.postData.postCaption}</h1>
                    <p className="post-detail-text">{this.state.postData.postDescription}</p>
                    <p className="post-detail-created-by">{this.state.postData.postCreatedBy}</p>
                    <p className="post-detail-updated-at">{this.state.postData.postUpdatedAt}</p>
                </div>
                <div className="post-detail-comment-list">
                    {flag ? comment_list : <h3>No comments yet</h3>}
                </div>

            </div>
        )

    }

    activateButtonsIfAuthed = () => {
        return (
            <div className="button-container">
                <input type="button" className="post-detail-represent-update-button" defaultValue={"Изменить"} onClick={() => this.editPostButtonHandler()}/>
                <input type="button" className="post-detail-represent-delete-button" defaultValue={"Удалить"} onClick={() => this.deletePostButtonHandler()} />
            </div>
        )
    }   
    
    editPostButtonHandler = () => {
        this.setState({editDataIsActive: !this.state.editDataIsActive})
    }

    showEditPostForm = () => {
        return (
            <div className="edit-post-form">
                <form onSubmit="">
                    <CSRF_TOKENINPUT />
                    <label htmlFor="post-caption">Ваше имя</label>
                    <input id="post-caption" name="caption" type="text" defaultValue={this.state.postCaption} />
                    <label htmlFor="post-description">Ваше имя</label>
                    <textarea id="post-description" name="description" defaultValue={this.state.postDescription}></textarea>
                    <button type="submit">Изменить</button>
                </form>
            </div>
        )
    }

    deletePostButtonHandler = () => {
        this.setState({deleteWinodwIsActive: !this.state.deleteWinodwIsActive, editDataIsActive: false,})
    }

    showDeleteConfirmationWindow = () => {
        return (
            <div className="confirm-delete-window">
                <h1>Вы уверены, что хотите удалить запись? Это действие нельзя отменить!</h1>
                <input type="button" defaultValue={"Да"} className="confirm-delete-button-accept" onClick={() => this.acceptDeletePost()} />
                <input type="button" defaultValue={"Нет"} className="confirm-delete-button-decline" onClick={() => this.declineDeleteConfirmationWindowButtonHandler()} />
            </div>
        )
    }

    acceptDeletePost = async () => {
        await this.performDelete();
        this.props.clearData();
        this.props.setNeedUpdateData(true);
        this.setState({
            postData: {postId: 0},
            isDataLoaded: false,
            deleteWinodwIsActive: false,
            editDataIsActive: false,
        })
    }

    performDelete = async () => {
        let access_token = await this.props.authClass.getAccessToken();
        await fetch(this.props.authClass.getDomain() + "api/post/" + this.state.postData.postId + "/", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + access_token
            }
        })
    }

    declineDeleteConfirmationWindowButtonHandler = () => {
        this.setState({deleteWinodwIsActive: false, editDataIsActive: false,})
    }

    componentDidUpdate(prevProps, prevState){
        if (prevProps.postData.postId !== this.props.postData.postId){
            let tempArg;
            if (this.props.postData.postId !== 0) {
                tempArg = true;
            }
            this.setState({isDataLoaded: tempArg, postData: this.props.postData, userId: this.props.postData.userId, deleteWinodwIsActive: false, debugState: 1, editDataIsActive: false,})
        }
    }

    clearButtorHandler = () => {
        this.setState({
            postData: ({postId: 0}),
            isDataLoaded: false,
            deleteWinodwIsActive: false,
            editDataIsActive: false,
        })
        this.props.clearData();
    }

    render(){
        return (
            <div className="post-detail-represent">
                {this.state.isDataLoaded ? this.representData() : (<div><h1>CLICK ON POST ON RIGHT SIDE!</h1></div>)}
                {this.state.deleteWinodwIsActive ? this.showDeleteConfirmationWindow() : null}
            </div>
        )
    }

}


export default PostDetail