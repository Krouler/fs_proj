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
            needUpdateData: false,

            postId: 0,
            postUserId: 0,
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
        this.getNeedUpdateData = this.getNeedUpdateData.bind(this)
        this.setNeedUpdateData = this.setNeedUpdateData.bind(this)
        this.clearData = this.clearData.bind(this)
        this.getIsAuthenticated();

    }

    getNeedUpdateData = () => {
        return this.state.needUpdateData
    }

    setNeedUpdateData = (flag) => {
        this.setState({needUpdateData: flag})
    }

    clearData = () => {
        this.setState({
            postId: 0,
            postUserId: 0,
            postCaption: '',
            postDescription: '',
            postCreatedAt: '',
            postUpdatedAt: '',
            postCreatedBy: '',
            postComments: [],
            needUpdateData: false,
        })
    }

    setDataAfterPost = (data) => {
        this.setState({
            postId: data.id,
            postUserId: data.user_id,
            postCaption: data.caption,
            postDescription: data.description,
            postCreatedAt: data.created_at,
            postUpdatedAt: data.updated_at,
            postCreatedBy: data.created_by,
            postComments: data.comments,
            needUpdateData: true
        })
    }

    giveDataToRepresentation = () => {
        let userId = this.props.authClass.getUserId();
        return {
            postId: this.state.postId,
            postCaption: this.state.postCaption,
            postDescription: this.state.postDescription,
            postCreatedAt: this.state.postCreatedAt,
            postUpdatedAt: this.state.postUpdatedAt,
            postCreatedBy: this.state.postCreatedBy,
            postComments: this.state.postComments,
            postUserId: this.state.postUserId,
            userId: userId
        }
    }

    detailPostView = (postItemObject) => {
        this.setState({
            postId: postItemObject.id,
            postUserId: postItemObject.user_id,
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
                    {this.state.needUpdateOrCreatePost ? <PostCreationFormDispatcher setNeedUpdateData={this.setNeedUpdateData} toggleIsPostCreation={this.toggleIsPostCreation} toggleIsPostEdit={this.toggleIsPostEdit} setDataAfterPost={this.setDataAfterPost} isCreate={this.state.isPostCreation} authClass={this.props.authClass} />: <PostDetail postData={this.giveDataToRepresentation()} setNeedUpdateData={this.setNeedUpdateData} clearData={this.clearData} authClass={this.props.authClass} />}
                </div>
                <div className="posts">
                    <div className="post-list-header">
                    </div>
                    <div className="post-list">
                    <PostList detailPostView={this.detailPostView} authClass={this.props.authClass} getNeedUpdateData={this.getNeedUpdateData} setNeedUpdateData={this.clearData} />
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