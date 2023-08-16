import { Component } from "react";
import PostCreationFormDispatcher from "./PostEditOrCreateFormDispatcher";
import PostDetail from "./PostDetail";
import PostList from "./PostList";

class PostPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            isAuthenticated: false,
            isAfterPost: false,
            isPostCreation: false,
            needUpdateOrCreatePost: false,

            postId: '',
            postCaption: '',
            postDescription: '',
            postCreatedAt: '',
            postUpdatedAt: '',
            postCreatedBy: '',
            postComments: [],
        }

        this.postCreateButtonHandler = this.postCreateButtonHandler.bind(this)
        this.getIsAuthenticated = this.getIsAuthenticated.bind(this)
        this.toggleIsPostCreation = this.toggleIsPostCreation.bind(this)
        this.toggleIsPostEdit = this.toggleIsPostEdit.bind(this)
        this.giveDataForEdit = this.giveDataForEdit.bind(this)
        this.giveDataToRepresentation = this.giveDataToRepresentation.bind(this)
        this.setDataToEdit = this.setDataToEdit.bind(this)
        this.setDataAfterPost = this.setDataAfterPost.bind(this)
        this.detailPostView = this.detailPostView.bind(this)
        this.getIsAuthenticated();

    }

    setDataAfterPost = (data) => {
        this.setState({
            postId: data.postId,
            postCaption: data.postCaption,
            postDescription: data.postDescription,
            postCreatedAt: data.postCreatedAt,
            postUpdatedAt: data.postUpdatedAt,
            postCreatedBy: data.postCreatedBy,
            postComments: [],
            isAfterPost: true
        })
    }

    giveDataToRepresentation = () => {
        return {
            postId: this.state.postId,
            postCaption: this.state.postCaption,
            postDescription: this.state.postDescription,
            postCreatedAt: this.state.postCreatedAt,
            postUpdatedAt: this.state.postUpdatedAt,
            postCreatedBy: this.state.postCreatedBy,
            postComments: this.state.postComments,
        }
    }

    detailPostView = (postItemObject) => {
        this.setState({
            postId: postItemObject.id,
            postCaption: postItemObject.caption,
            postDescription: postItemObject.description,
            postCreatedAt: postItemObject.created_at,
            postUpdatedAt: postItemObject.updated_at,
            postCreatedBy: postItemObject.created_by,
            postComments: postItemObject.comments,
        })

    }

    setDataToEdit = (data) => {
        this.setState({
            postCaption: data.postCaption,
            postDescription: data.postDescription,
        })
    }

    giveDataForEdit = () => {
        return {
            postId: this.state.postId,
            postCaption: this.state.postCaption,
            postDescription: this.state.postDescription,
        }
    }

    componentDidMount(){
        this.getIsAuthenticated();
    }

    getIsAuthenticated = async () => {
        let flag = await this.props.authClass.getIsAuthenticated();
        this.setState({isAuthenticated: await flag})
        return await flag
    }

    toggleIsPostEdit = () => {
        this.setState({needUpdateOrCreatePost: !this.state.needUpdateOrCreatePost,
            isPostCreation: false})
    }

    toggleIsPostCreation = () => {
        this.setState({needUpdateOrCreatePost: !this.state.needUpdateOrCreatePost,
            isPostCreation: !this.isPostCreation})
    }

    postCreateButtonHandler = async () => {
        let flag = await this.getIsAuthenticated()
        if (flag){
            this.toggleIsPostCreation();
        } else {
            this.props.toggleIsPost();
        }
    }

    render(){
        return(
            <div className="post-page-class">
                <div className="post-detail">
                    {this.state.needUpdateOrCreatePost ? <PostCreationFormDispatcher toggleIsPostCreation={this.toggleIsPostCreation} toggleIsPostEdit={this.toggleIsPostEdit} setDataAfterPost={this.setDataAfterPost} isCreate={this.state.isPostCreation} authClass={this.props.authClass} />: <PostDetail postData={this.giveDataToRepresentation()} />}
                </div>
                <div className="posts">
                    <div className="post-list-header">
                    </div>
                    <div className="post-list">
                    <PostList detailPostView={this.detailPostView} authClass={this.props.authClass}/>
                    </div>
                    <div className="posts-add-new">
                    <input type="button" defaultValue="Создать пост" onClick={this.postCreateButtonHandler} />
                    </div>
                </div>
            </div>
        )
    }

}

export default PostPage