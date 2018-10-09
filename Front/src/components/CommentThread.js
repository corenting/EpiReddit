import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Segment, Divider, Comment, Form, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'  
import { withRouter } from 'react-router'
import ButtonVote from "./ButtonVote";
import voteCommentAction from "../actions/comment/vote"
import replyCommentAction from "../actions/comment/reply"


class CommentThread extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            hide : false,
            reply : false,
            replymessage : ''
        };
        this.handleHideClick = this.handleHideClick.bind(this);
        this.handleReplyClick = this.handleReplyClick.bind(this);
        this.handleReplyChange = this.handleReplyChange.bind(this);
        this.replyClick = this.replyClick.bind(this);
    }

    handleHideClick = (e) => { 
        this.setState({ ...this.state, hide: !this.state.hide });
    };

    handleReplyClick = (e) =>  {
        this.setState({...this.state, reply: !this.state.reply });
    };

    handleReplyChange(event) {
        this.setState({...this.state, replymessage : event.target.value});
    }

    replyClick() {
        this.setState({...this.state, reply : false})
        this.props.dispatch(replyCommentAction(localStorage.getItem("jwt"), this.props.post_id, this.props.id, this.state.replymessage));
    }

    guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    voteup() {
        if (!localStorage.getItem("jwt")) {
            this.props.history.push('/Login?redirectUrl=' + this.props.location.pathname)
        }
        this.props.dispatch(voteCommentAction(localStorage.getItem("jwt"), this.props.post_id, this.props.id, true, false));
    }

    votedown() {
        if (!localStorage.getItem("jwt")) {
            this.props.history.push('/Login?redirectUrl=' + this.props.location.pathname)
        }
        this.props.dispatch(voteCommentAction(localStorage.getItem("jwt"), this.props.post_id, this.props.id, false, true));
    }

    voteneutral() {
        if (!localStorage.getItem("jwt")) {
            this.props.history.push('/Login?redirectUrl=' + this.props.location.pathname)
        }
        this.props.dispatch(voteCommentAction(localStorage.getItem("jwt"), this.props.post_id, this.props.id, false, false));
    }

    render() {
        return (
            <Segment color='blue'>
                <Comment collapsed={this.state.hide}>
                    <Comment.Content>
                        {!this.props.forUserProfile &&
                            <Comment.Author as='span'>
                                <ButtonVote toggleup={this.props.upvote} toggledown={this.props.downvote} vote={this.props.upvotes} 
                                    voteup={() => this.voteup()} votedown={() => this.votedown()} voteneutral={() => this.voteneutral()} size='mini'/>
                                <span className='vote-buttons-comment'>by <Link to={'/u/' + this.props.username}>{this.props.username}</Link></span>
                            </Comment.Author>
                        }
                        <Comment.Metadata>
                            {moment(this.props.createdAt).fromNow() + ' '}
                            {this.props.forUserProfile &&
                                <div>
                                    in <Link to={'/Thread/' + this.props.post.id}>{this.props.post.title}</Link>
                                </div>
                            }
                            
                        </Comment.Metadata>
                        <Divider/>
                        <Comment.Text>{this.props.content}</Comment.Text>
                        {!this.props.forUserProfile &&
                            <Comment.Actions>
                                <Comment.Action onClick={this.handleReplyClick} >Reply</Comment.Action>
                                <Comment.Action onClick={this.handleHideClick}>Hide</Comment.Action>
                            </Comment.Actions>
                        }
                    </Comment.Content>
                    
                    {this.state.reply && 
                    <Form reply>
                        <Form.TextArea onChange={this.handleReplyChange}/>
                        <Button size='mini' content='Reply' onClick={this.replyClick} labelPosition='right' icon='edit' primary />
                    </Form>}
                    {this.props.childComments && this.props.childComments.length > 0 &&
                    <Comment.Group>
                            {this.props.childComments.map((child) => <CommentThread post_id={this.props.post_id} forUserProfile={this.props.forUserProfile} dispatch={this.props.dispatch} {...child} key={this.guid()}/>)}
                    </Comment.Group>}
                </Comment>
                {this.state.hide &&
                    <a onClick={this.handleHideClick}>[ show content ]</a>
                }
            </Segment>
        )
    }
}
export default withRouter(connect()(CommentThread))