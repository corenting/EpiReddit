import React, { Component } from 'react';
import moment from 'moment';
import { Segment, Divider, Comment, Loader } from 'semantic-ui-react'
import CommentThread from './CommentThread'
import ThreadCard from './ThreadCard'
import { BASEURL } from '../config/baseurl'

class UserProfile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user: [],
            posts: [],
            comments: [],
            userError: false,
            commentsError: false,
            postsError: false,
            karmaLoaded: false,
            commentsLoaded: false,
            postsLoaded: false,
        }
    }

    componentWillMount() {
        let self = this

        // Fetch user profile
        fetch(BASEURL + 'users/profile?username=' + this.props.match.params.username, { method: 'GET' })
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                if (typeof(json.success) !== 'undefined' && !json.success) {
                    throw new Error('Invalid response');
                }
                self.setState({ user: json, userError: false, karmaLoaded: true });
            })
            .catch(function (error) {
                console.log(error)
                self.setState({ user: [], userError: true, karmaLoaded: false });
            });
        
        // Fetch user comments
        fetch(BASEURL + 'users/comments?username=' + this.props.match.params.username, { method: 'GET' })
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            if (typeof(json.success) !== 'undefined' && !json.success) {
                throw new Error('Invalid response');
            }
            self.setState({ comments: json, commentsError: false, commentsLoaded: true });
        })
        .catch(function (error) {
            self.setState({ comments: [], commentsError: true, commentsLoaded: false});
        });

        // Fetch user posts
        fetch(BASEURL + 'users/posts?username=' + this.props.match.params.username, { method: 'GET' })
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            if (typeof(json.success) !== 'undefined' && !json.success) {
                throw new Error('Invalid response');
            }
            self.setState({ posts: json, postsError: false, postsLoaded: true });
        })
        .catch(function (error) {
            console.log(error)
            self.setState({ posts: [], postsError: true, postsLoaded: false });
        });
    }

    render() {
        return (
            <div className='thread-coponent'>
                <Segment raised color='red'>
                    <h2 class="ui header">
                        {this.props.match.params.username}
                        {!this.state.userError && 
                            <div class="sub header">Member since {moment(this.state.user.registerDate).fromNow()}</div>
                        }
                    </h2>
                    <Divider/>
                    {!this.state.userError && this.state.karmaLoaded &&
                        <div>
                            <h3>
                                <span class="profile-score">{ this.state.user.postsKarma + ' ' }</span>
                                posts karma
                            </h3>
                            <h3>
                                <span class="profile-score">{ this.state.user.commentsKarma + ' ' }</span>
                                comments karma
                            </h3>
                        </div>
                    }
                    {this.state.userError && 
                        <p>No user informations to display</p>
                    }
                    <Loader inline='centered' active={!this.state.karmaLoaded && !this.state.userError}>Loading user profile...</Loader>
                </Segment>
                <h3>Latest comments</h3>
                {!this.state.commentsError && this.state.commentsLoaded &&
                    this.state.comments.map((item) => {
                        return (
                            <Comment.Group>
                                <CommentThread forUserProfile="false" {...item}/>
                            </Comment.Group>
                        )
                    })
                }
                {((this.state.commentsError && this.state.commentsLoaded) || this.state.comments.length === 0) &&
                    <p>No comments to display</p>
                }
                <Loader inline='centered' active={!this.state.commentsLoaded && !this.state.commentsError}>Loading comments...</Loader>
                <Divider/>
                <h3>Latest posts</h3>
                {!this.state.postsError && this.state.postsLoaded &&
                    this.state.posts.map(item => <ThreadCard {...item}/>)
                }
                {((this.state.postsError && this.state.postsLoaded) || this.state.posts.length === 0) &&
                    <p>No posts to display</p>
                }
                <Loader inline='centered' active={!this.state.postsLoaded && !this.state.postsError}>Loading posts...</Loader>
                <Divider/>
                <Comment.Group>
                </Comment.Group>
            </div>       
        )
    }
}

export default UserProfile