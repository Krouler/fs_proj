import { Component } from "react";


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
            postData: {postId: 123},
        }

        this.representData = this.representData.bind(this)

    }

    retrievePostData = async () => {

    }

    representData = () => {

        let comment_list = [];
        let flag = false
        if (this.state.postData.postComments !== null){
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
                <h1 className="post-detail-caption">{this.state.postData.postCaption}</h1>
                <p className="post-detail-text">{this.state.postData.postDescription}</p>
                <p className="post-detail-created-by">{this.state.postData.postCreatedBy}</p>
                <p className="post-detail-updated-at">{this.state.postData.postUpdatedAt}</p>
                <div className="post-detail-comment-list">
                    {flag ? comment_list : <h3>No comments yet</h3>}
                </div>
            </div>
        )
    }

    componentDidUpdate(prevProps, prevState){
        if (prevProps.postData !== this.props.postData){
            let tempArg;
            if (this.props.postData.postId !== '') {
                tempArg = true;
            }
            this.setState({isDataLoaded: tempArg, postData: this.props.postData})
        }
    }

    render(){
        return (
            <div className="post-detail-represent">
                {this.state.isDataLoaded ? this.representData() : (<div><h1>CLICK ON POST ON RIGHT SIDE!</h1></div>)}
            </div>
        )
    }

}


export default PostDetail