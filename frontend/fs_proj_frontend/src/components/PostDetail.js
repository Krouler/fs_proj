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
            isDataLoaded: false
        }


    }

    retrievePostData = async () => {

    }

    componentDidMount(){

    }

    render(){
        return (
            <div className="post-detail-represent">

            </div>
        )
    }

}


export default PostDetail