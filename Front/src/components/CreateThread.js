import React, { Component } from "react";
import { Segment, Divider, Form, Button, Menu, Dropdown, Message } from 'semantic-ui-react'
import { Redirect } from 'react-router'
import { connect } from 'react-redux';
import getCategorieAction from '../actions/category/get'
import postLinkAction from '../actions/thread/postLink'
import postTextAction from '../actions/thread/postText'

class CreateThread extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            activeItem : 'text',
            urlText : '',
            postText : '',
            titleText : '',
            category_id : 1,
            error : false,
            errorMessage : '',
            postId : -1,

        }
        this.props.dispatch(getCategorieAction())
        this.handleItemClick = this.handleItemClick.bind(this);
        this.handleUrlChange = this.handleUrlChange.bind(this);
        this.handlePostChange = this.handlePostChange.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.createClick = this.createClick.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.postId !== -1)
        {
            this.setState({ postId : newProps.postId });
        }
    }

    handleItemClick = (e, { name }) => { 
        this.setState({ activeItem: name, error : false, errorMessage : '' });
    }

    handleTitleChange(event) {
        this.setState({...this.state, titleText : event.target.value, error : false, errorMessage : ''});
    }

    handlePostChange(event) {
        this.setState({...this.state, postText : event.target.value, error : false, errorMessage : ''});
    }

    handleUrlChange(event) {
        this.setState({...this.state, urlText : event.target.value, error : false, errorMessage : ''});
    }

    handleCategoryChange(event, { value }) {
        this.setState({ category_id : value});
    }

    createClick() {
        if (!this.state.titleText.trim())
        {
            this.setState({...this.state, error : true, errorMessage : 'Invalid Title, please enter a title'});
            return;
        }
        if (this.state.activeItem === 'url') 
        {
            if (!this.state.urlText.trim())
            {
                this.setState({...this.state, error : true, errorMessage : 'Invalid url, please enter an Url'});
                return;
            }
            this.props.dispatch(postLinkAction(localStorage.getItem("jwt"), this.state.category_id, this.state.titleText, this.state.urlText));
        }
        else if (this.state.activeItem === 'text')
        {
            if (!this.state.postText.trim())
            {
                this.setState({...this.state, error : true, errorMessage : 'Invalid text, please enter the text of the post'});
                return;
            }
            this.props.dispatch(postTextAction(localStorage.getItem("jwt"), this.state.category_id, this.state.titleText, this.state.postText));
        }
    }

    render() {
        if (!localStorage.getItem("jwt")) {
            return <Redirect to={'/Login?redirectUrl=' + this.props.location.pathname}/>
        }

        if (typeof(this.state.postId) !== 'undefined' && this.state.postId !== -1) {
            return <Redirect to={'/Thread/' + this.state.postId}/>
        }

        return (
            <div>
                <h1> Post a new Thread </h1>
                <Divider/>
                <Dropdown placeholder='Select a category to post' defaultValue={1} fluid selection options={this.props.categories} onChange={this.handleCategoryChange} />
                <Divider hidden/>
                <Menu inverted attached='top' pointing fluid widths={2}>
                    <Menu.Item name='text' active={this.state.activeItem === 'text'} onClick={this.handleItemClick} />
                    <Menu.Item name='url' active={this.state.activeItem === 'url'} onClick={this.handleItemClick} />
                </Menu>

                <Segment attached='bottom'>
                    <Divider hidden/>
                    {this.state.error && <Message error header='Problem occured' content={this.state.errorMessage}/>}
                    <Form.Input fluid placeholder='Write the name of your post'onChange={this.handleTitleChange} />
                    <Divider hidden/>
                    <Form reply>
                        {this.state.activeItem === 'text' && <Form.TextArea  placeholder="Write the content of your new post" onChange={this.handlePostChange}/>}
                        {this.state.activeItem === 'url' && <Form.Input fluid placeholder='Url of your post'onChange={this.handleUrlChange} />}
                        <Button size='mini' content='Create new thread' onClick={this.createClick} labelPosition='right' icon='edit' primary />
                    </Form>
                </Segment>
            </div>
    
        )
    }
}

function mapStateToProps(state, ownProps) {
    let currstate = state.category_reducer;
    currstate.categories = currstate.categories.map((item) => item = {key : item.id, text : item.name, value : item.id});
    return { ...currstate, postId: state.thread_reducer.post_id}
}

export default connect(mapStateToProps)(CreateThread)