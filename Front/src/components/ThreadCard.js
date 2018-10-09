import React, { Component } from "react";
import { Card, Button, Grid } from 'semantic-ui-react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import moment from 'moment';
import ButtonVote from "./ButtonVote";
import voteThreadAction from "../actions/thread/vote"


class ThreadCard extends Component {

    constructor(props)
    {
        super(props);


        this.voteup = this.voteup.bind(this);
        this.voteneutral = this.voteneutral.bind(this);
        this.votedown = this.votedown.bind(this);
    }

    voteup() {
        if (!localStorage.getItem("jwt")) {
            this.props.history.push('/Login?redirectUrl=' + this.props.location.pathname)
        }
        this.props.dispatch(voteThreadAction(localStorage.getItem("jwt"), this.props.id, true, false, this.props.load));
    }

    votedown() {
        if (!localStorage.getItem("jwt")) {
            this.props.history.push('/Login?redirectUrl=' + this.props.location.pathname)
        }
        this.props.dispatch(voteThreadAction(localStorage.getItem("jwt"), this.props.id, false, true, this.props.load));
    }

    voteneutral() {
        if (!localStorage.getItem("jwt")) {
            this.props.history.push('/Login?redirectUrl=' + this.props.location.pathname)
        }
        this.props.dispatch(voteThreadAction(localStorage.getItem("jwt"), this.props.id, false, false, this.props.load));
    }

    render() {
        return (
            <Card fluid color='pink'  >
                <Grid centered verticalAlign='middle'columns={16}>
                    <Grid.Row>
                        <Grid.Column width="14">
                            <Card.Content className="thread-card-component">
                                <Card.Header>
                                    <Grid centered verticalAlign='middle' columns={16}>
                                        <Grid.Row >
                                            <Grid.Column width="2">
                                                <ButtonVote toggleup={this.props.upvote} toggledown={this.props.downvote} vote={this.props.upvotes} 
                                                voteup={() => this.voteup()} votedown={() => this.votedown()} voteneutral={() => this.voteneutral()} size='tiny' />
                                            </Grid.Column>
                                            <Grid.Column width="14">
                                                <h3 className='thread-card-title'>
                                                    {this.props.content && <Link to={'/Thread/' + this.props.id}>{this.props.title}</Link>}
                                                    {this.props.link && <a href={this.props.link}>{this.props.title}</a>}
                                                </h3>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Card.Header>
                                <Card.Description className='thread-card-description'>
                                    Submitted <strong> {moment(this.props.createdAt).fromNow()} {' '}</strong>by 
                                    <strong><Link to={'/u/' + this.props.username}> {this.props.username} </Link></strong>
                                </Card.Description>
                            </Card.Content>
                            <Card.Content extra className="thread-card-component">
                                <Link className='comment-button' to={'/Thread/' + this.props.id}>
                                    <Button size='mini' positive>
                                        Comments
                                    </Button> 
                                </Link>
                            </Card.Content>
                        </Grid.Column>
                        <Grid.Column width="2">
                            {this.props.picture && <a  href={this.props.picture}><img className="right tiny ui image thread-card-component" src={this.props.picture} alt='thread'/></a>}
                            {!this.props.picture && <img className="right tiny ui image thread-card-component" src={require('../asset/no-image.svg')} alt='not found'/>}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Card> 
        )
    }
}

export default withRouter(connect()(ThreadCard))