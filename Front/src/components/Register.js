import React, { Component } from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { Segment, Form, Button, Message } from 'semantic-ui-react'
import queryString from 'query-string';
import registerAction from '../actions/login/register'

class Register extends Component {
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
            confirmPass : "",
            errorConfirmPass: false,
            mail : "",
            errorMail : false,
            fetching : false,
            redirectUrl
        }

        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleMail = this.handleMail.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.isAuthenticated) {
            this.props.history.push(this.state.redirectUrl)
        }
    }

    handleSubmit(values) {
        values.preventDefault()
        if (this.state.username === '')
        {
            this.setState({ ...this.state, errorUser : true });
        }
        if (this.state.mail === '')
        {
            this.setState({ ...this.state, errorMail : true });
        }
        if (this.state.password === '')
        {
            this.setState({ ...this.state, errorPass : true });
        }

        if(this.state.errorMail || this.state.errorPass || this.state.errorUser || this.state.errorConfirmPass)
        {
            return;
        }
        this.setState({ ...this.state, fetching : true });
        this.props.dispatch(registerAction(this.state.username, this.state.password, this.state.mail));
    }

    handleUsername(event) {
        if (event.target.value === '')
        {
            this.setState({ ...this.state, username : event.target.value, errorUser : true });
        }
        else
        {
            this.setState({ ...this.state, username : event.target.value, errorUser : false });
        }
    }

    handleMail(event) {
        if (event.target.value === '')
        {
            this.setState({ ...this.state, mail : event.target.value, errorMail : true });
        }
        else
        {
            this.setState({ ...this.state, mail : event.target.value, errorMail : false });
        }    
    }

    handlePassword(event) {
        if (event.target.value === '')
        {
            this.setState({ ...this.state, password : event.target.value, errorPass : true });
        }
        else
        {
            this.setState({ ...this.state, password : event.target.value, errorPass : false });
        }    
    }

    handleConfirmPassword(event) {
        this.setState({ ...this.state, confirmPass : event.target.value});
        if (event.target.value !== this.state.password)
        {
            this.setState({ ...this.state, errorConfirmPass : true});
        }
        else
        {
            this.setState({ ...this.state, errorConfirmPass : false});
        }
    }

    render() {
        return (
            <div id="content" className="ui container">
                <Segment raised>
                    <h2>Register</h2>
                    <Form onSubmit={this.handleSubmit} error={this.state.errorMail || this.state.errorPass || this.state.errorUser || this.state.errorConfirmPass || this.props.isError } loading={this.props.isFetching}>              
                        <Form.Field>
                            <Form.Input error={this.state.errorUser} fluid label="Username" placeholder="Username" onChange={this.handleUsername}/>
                        </Form.Field>
                        <Form.Field>
                            <Form.Input error={this.state.errorMail} fluid label="Mail Address" type='email' placeholder="Mail Address" onChange={this.handleMail} />
                        </Form.Field>
                        <Form.Field>
                            <Form.Input error={this.state.errorConfirmPass || this.state.errorPass} fluid label='Password' type='password' placeholder='Password' onChange={this.handlePassword} />
                        </Form.Field>
                        <Form.Field>
                            <Form.Input error={this.state.errorConfirmPass} fluid label="Confirm password" type='password' placeholder="Confirm password" onChange={this.handleConfirmPassword}/>
                        </Form.Field>
                        <Link to={'/Login?redirectUrl=' + this.state.redirectUrl}>Already have an account ? Click here to login</Link>
                        <br />
                        <Button type='submit'>Register</Button>
                        <Message error>
                            <Message.Header>
                                Error:
                            </Message.Header>
                            <Message.Content>
                                <ul type="disc" >
                                    { this.state.errorUser && <li>Invalid username</li>}
                                    { this.state.errorPass && <li>Invalid password</li>}
                                    { this.state.errorMail && <li>Invalid Mail address</li>}
                                    { this.state.errorConfirmPass && <li>Passwords do not match </li>}
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

export default connect(mapStateToProps)(Register)