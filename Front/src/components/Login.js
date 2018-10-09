import React, { Component } from "react";
import { connect } from 'react-redux';
import { Segment, Form, Button, Message } from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import queryString from 'query-string';
import loginAction from '../actions/login/login';


class Login extends Component {
    constructor(props)
    {
        super(props)

        // Get redirect URL
        let redirectUrl = '/';
        if (typeof(this.props.location.search) !== 'undefined') {
            redirectUrl = queryString.parse(this.props.location.search).redirectUrl;
        }

        this.state = 
        {
            username : "",
            errorUser : false,
            password : "",
            errorPass : false,
            redirectUrl,
        }
        console.log(this.state.redirectUrl)

        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.isAuthenticated) {
            this.props.history.push(this.state.redirectUrl)
        }
    }

    handleSubmit(values) {
        values.preventDefault()
        let isValid = true;
        if (!this.state.username.trim())
        {
                isValid = false
        }

        if (!this.state.password.trim())
        {
            this.setState({ ...this.state, errorUser : !isValid, errorPass : true });
            isValid = false;
        }

        if(!isValid)
        {
            return;
        }
        this.props.dispatch(loginAction(this.state.username, this.state.password));
    }

    handleUsername(event) {
        if (!event.target.value.trim())
        {
            this.setState({ ...this.state, username : event.target.value, errorUser : true });
        }
        else
        {
            this.setState({ ...this.state, username : event.target.value, errorUser : false });
        }
    }

    handlePassword(event) {
        if (!event.target.value.trim())
        {
            this.setState({ ...this.state, password : event.target.value, errorPass : true });
        }
        else
        {
            this.setState({ ...this.state, password : event.target.value, errorPass : false });
        }    
    }

    render() {
        return (
            <div id="content" className="ui container">
                <Segment raised>
                    <h2>Login</h2>
                    <Form onSubmit={this.handleSubmit} error={this.state.errorMail || this.state.errorPass || this.state.errorUser || this.state.errorConfirmPass || this.props.isError} loading={this.props.isFetching}>              
                        <Form.Field>
                            <Form.Input error={this.state.errorUser} fluid label="Username" placeholder="Username" onChange={this.handleUsername}/>
                        </Form.Field>
                        <Form.Field>
                            <Form.Input error={this.state.errorConfirmPass || this.state.errorPass} fluid label='Password' type='password' placeholder='Password' onChange={this.handlePassword} />
                        </Form.Field>
                        <Link to={'/Register?redirectUrl=' + this.state.redirectUrl}>Don't have an account ? Click here to register</Link>
                        <br />
                        <Button type='submit'>Login</Button>
                        <Message error>
                            <Message.Header>
                                Error:
                            </Message.Header>
                            <Message.Content>
                                <ul type="disc" >
                                    { this.state.errorUser && <li>Invalid username</li>}
                                    { this.state.errorPass && <li>Invalid password</li>}
                                    { this.props.isError && <li> {this.props.errorMessage} </li>}
                                </ul>
                            </Message.Content>
                        </Message>
                    </Form>
                </Segment>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const currstate = state.login_reducer;
    return { ...currstate}
}

export default connect(mapStateToProps)(Login)