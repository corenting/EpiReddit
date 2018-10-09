import React, { Component } from "react";
import { Segment, Grid, Divider, Comment, Form, Button, Message } from 'semantic-ui-react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import CommentThread from './CommentThread'
import getThreadAction from '../actions/thread/get'
import getCommentAction from '../actions/comment/get'
import ButtonVote from "./ButtonVote";
import replyCommentAction from "../actions/comment/reply"
import voteThreadAction from "../actions/thread/vote"

class Thread extends Component {
    constructor(props)
    {
        super(props)
        this.state = {
            replymessage : ""
        };
        this.loadthread();
        this.loadcomment();
        this.handleReplyChange = this.handleReplyChange.bind(this);
        this.replyClick = this.replyClick.bind(this);
        this.voteup = this.voteup.bind(this);
        this.voteneutral = this.voteneutral.bind(this);
        this.votedown = this.votedown.bind(this);
        this.loadthread = this.loadthread.bind(this);
    }

    handleReplyChange(event) {
        this.setState({...this.state, replymessage : event.target.value});
    }

    replyClick() {
        this.props.dispatch(replyCommentAction(localStorage.getItem("jwt"), this.props.match.params.id, null, this.state.replymessage));
    }

    loadthread() {
        this.props.dispatch(getThreadAction(localStorage.getItem("jwt"), this.props.match.params.id));
    }

    loadcomment() {
        this.props.dispatch(getCommentAction(localStorage.getItem("jwt"), this.props.match.params.id));
    }

    voteup() {
        if (!localStorage.getItem("jwt")) {
            this.props.history.push('/Login?redirectUrl=' + this.props.location.pathname)
        }
        this.props.dispatch(voteThreadAction(localStorage.getItem("jwt"), this.props.thread.id, true, false, this.loadthread));
    }

    votedown() {
        if (!localStorage.getItem("jwt")) {
            this.props.history.push('/Login?redirectUrl=' + this.props.location.pathname)
        }
        this.props.dispatch(voteThreadAction(localStorage.getItem("jwt"), this.props.thread.id, false, true, this.loadthread));
    }

    voteneutral() {
        if (!localStorage.getItem("jwt")) {
            this.props.history.push('/Login?redirectUrl=' + this.props.location.pathname)
        }
        this.props.dispatch(voteThreadAction(localStorage.getItem("jwt"), this.props.thread.id, false, false, this.loadthread));
    }

    render() {
        return (
            <div className='thread-coponent'>
                <Segment raised color='red'>
                    <Grid centered verticalAlign='middle' columns={16}>
                        <Grid.Row>
                            <Grid.Column width="2">
                                <ButtonVote toggleup={this.props.thread.upvote} toggledown={this.props.thread.downvote} vote={this.props.thread.upvotes} 
                                        voteup={() => this.voteup()} votedown={() => this.votedown()} voteneutral={() => this.voteneutral()} size='tiny'/>                            </Grid.Column>
                                <Grid.Column width="fourteen">
                                <h2>{this.props.thread.title}</h2>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Divider/>
                    {this.props.thread.content && <p>{this.props.thread.content}</p>}
                    {this.props.thread.link && <p><a href={this.props.thread.link}>{this.props.thread.link}</a></p>}
                </Segment>
                <h3>Comments</h3>
                <Divider/>
                <h4>Add new comment</h4>               
                {this.props.postedComment && <Message attached info
                    header='This comment has been posted !'
                    content='You can now see in the comment part of this thread <3'
                />}
                {localStorage.getItem("jwt") &&
                <Form className='attached fluid' reply>
                    <Form.TextArea onChange={this.handleReplyChange}/>
                    <Button size='mini' content='Add comment' onClick={this.replyClick} labelPosition='right' icon='edit' primary />
                </Form>
                }
                {!localStorage.getItem("jwt") &&
                <p>You need to be logged in to comment on a post!</p>
                }    
                <Divider/>
                <Comment.Group>
                    {this.props.comments.map((comment) => <CommentThread post_id={this.props.match.params.id} {...comment} key={comment.id}/>)}
                </Comment.Group>
            </div>
            
        )
    }
}

function mapStateToProps(state, ownProps) {
    const thread_state = state.thread_reducer;
    const comment_state = state.comment_reducer;
    return { ...thread_state, ...comment_state }
}

export default withRouter(connect(mapStateToProps)(Thread))