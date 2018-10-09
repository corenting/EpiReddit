import { Image, Menu } from "semantic-ui-react";
import React, { Component } from "react";
import jwtDecode from "jwt-decode";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { BASEURL } from '../config/baseurl'
import logoutAction from '../actions/login/logout'

let homeContent =
    <div>
        <Image size="mini" spaced="right" src="http://icons.iconarchive.com/icons/papirus-team/papirus-apps/512/reddit-icon.png" />
        EPI REDDIT
    </div>

class Navbar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            categories: [],
            isAuthenticated: localStorage.getItem("jwt"),
        }
    }

    componentWillMount() {
        // Fetch categories games on browser
        let self = this
        fetch(BASEURL + 'categories', { method: 'GET' })
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                let categories = json.map(child => child.name)
                self.setState({ categories: ['frontpage', ...categories] });
            })
            .catch(function (error) {
                console.log(error)
                self.setState({ categories: ['frontpage'] });
            });
    }

    componentWillReceiveProps(newProps) {
        if (!this.props.isAuthenticated && newProps.isAuthenticated) {
            this.setState({
                isAuthenticated: newProps.isAuthenticated,
            })
        }
    }

    logout() {
        this.props.dispatch(logoutAction())
        this.setState({ isAuthenticated: false, })
    }
    render() {
        let username = ''
        if(localStorage.getItem("jwt")) {
            username = jwtDecode(localStorage.getItem("jwt")).username
        }

        return (
            <div id="navbar" className="ui fixed main menu">
                <Menu fixed="top" inverted>
                    <a href='/' className="item" key= "home">{homeContent}</a>
                    <Menu.Menu position="left">
                        {this.state.categories.map((child) => {
                            let displayName = child.charAt(0).toUpperCase() + child.slice(1);
                            return (
                                <a className="item" href={'/r/' + child} key={'menuitem' + displayName}>
                                    {displayName}
                                </a>
                            )
                        })}
                    </Menu.Menu>
                    <Menu.Menu position="right">
                        {!this.state.isAuthenticated &&
                            <Menu.Item as={Link} content= "Login" to={"/Login?redirectUrl=" + this.props.location.pathname} />}
                        {!this.state.isAuthenticated &&
                            <Menu.Item as={Link} content= "Register" to={"/Register?redirectUrl=" + this.props.location.pathname}/>}
                        {this.state.isAuthenticated &&
                            <Menu.Item as={Link} content={username} to={"/u/" + username}/>}
                        {this.state.isAuthenticated &&
                            <Menu.Item as='a' content= "Logout" onClick={() => this.logout()}/>}
                    </Menu.Menu>
                </Menu>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const currstate = state.login_reducer;
    return { ...currstate}
}

export default connect(mapStateToProps)(Navbar);