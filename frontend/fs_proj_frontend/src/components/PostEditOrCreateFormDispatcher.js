import { Component } from "react";
import CreatePost from "./CreatePost";
import EditPost from "./EditPost";

class PostCreationFormDispatcher extends Component {
    constructor(props){
        super(props);
        this.state = {
            
        }
        this.getDataFromPost = this.getDataFromPost.bind(this)
    }

    getDataFromPost = () => {
        return this.props.dataForEdit();
    }

    render(){
        return(
            <div className="post-form-dispatcher">
                {this.props.isCreate ? <CreatePost authClass={this.props.authClass} toggleIsPostCreation={this.props.toggleIsPostCreation} setDataAfterPost={this.props.setDataAfterPost} />: <EditPost oldData={this.props.oldData} />}
            </div>
        )
    }

}


export default PostCreationFormDispatcher