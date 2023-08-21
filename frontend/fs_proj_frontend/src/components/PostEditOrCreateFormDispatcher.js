import { Component } from "react";
import CreatePost from "./CreatePost";
import EditPost from "./EditPost";

class PostCreationFormDispatcher extends Component {
    constructor(props){
        super(props);
        this.state = {
            
        }
        this.setDataAfterPostMedium = this.setDataAfterPostMedium.bind(this)
        this.setNeedUpdateDataMedium = this.setNeedUpdateDataMedium.bind(this)
        this.getDataFromPost = this.getDataFromPost.bind(this)
    }

    getDataFromPost = () => {
        return this.props.dataForEdit();
    }

    setDataAfterPostMedium = (data) => {
        console.log(data)
        this.props.setDataAfterPost(data);
    }

    setNeedUpdateDataMedium = (flag) => {
        this.props.setNeedUpdateData(flag)
    }

    render(){
        return(
            <div className="post-form-dispatcher">
                {this.props.isCreate ? <CreatePost setNeedUpdateData={this.props.setNeedUpdateData} authClass={this.props.authClass} toggleIsPostCreation={this.props.toggleIsPostCreation} setDataAfterPost={this.props.setDataAfterPost} />: <EditPost oldData={this.props.oldData} />}
            </div>
        )
    }

}


export default PostCreationFormDispatcher