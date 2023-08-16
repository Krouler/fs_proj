import { Component } from "react";


class PostList extends Component {
    constructor(props){
        super(props);
        this.state = {
            responseObject: null,
            needUpdateData: false,
            updateButtonEnable: true,
        }

        this.fetchData = this.fetchData.bind(this)
        this.toggleNeedUpdateData = this.toggleNeedUpdateData.bind(this)

    }

    componentDidMount(){
        this.fetchData()
    }

    componentDidUpdate(prevProps, prevState){
        if (this.state.needUpdateData) {
            this.fetchData();
            this.setState({needUpdateData: false})
        }
    }

    toggleNeedUpdateData = () => {
        this.setState({needUpdateData: true})
    }
    
    fetchData = async () => {
        let data = await fetch(this.props.authClass.getDomain() + 'api/post/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        })
        let data_json = await data.json()
        this.setState({responseObject: await data_json})
    }

    anyCaptionOnClickHandler(id){
        this.state.responseObject.results.forEach(element => {
            if (element.id === id) {
                this.props.detailPostView(element)
            }
        })
    }

    render(){
        let post_list_rows = [];
        let flag = false
        if (this.state.responseObject !== null){
            flag = true
            this.state.responseObject.results.forEach(element => {
                post_list_rows.push(<div key={element.id} className="post-list-item">
                    <h3 className="post-list-item-caption" onClick={this.anyCaptionOnClickHandler.bind(this, element.id)}>{element.caption}</h3>
                    <p>{element.description.length < 15 ? element.description : element.description.substring(0, 12) + "..."}</p>
                    </div>)
            });
        }
        return(
            <div className="post-list-items">
                <input type="button" className="update-post-list" defaultValue={"↻"} onClick={() => this.toggleNeedUpdateData()} />
                {flag ? post_list_rows : (<h3>no posts yet</h3>)}
            </div>
        )
    }

}

export default PostList