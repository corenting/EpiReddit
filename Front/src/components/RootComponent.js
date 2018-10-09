import React, { Component } from "react";
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom'  
import GridThread from './GridThread'
import Thread from './Thread'
import Login from './Login'
import Register from "./Register";
import Navbar from "./Navbar";
import UserProfile from "./UserProfile";
import CreateThread from "./CreateThread";


class RootComponent extends Component {

    render() {
        return (
            <Router>
                <div>
                    <Route exact component={Navbar}/>
                    <div id="content" className="ui container">
                        <Route exact path="/" component={GridThread}/>
                        <Route exact path="/r/:category/:page?" component={GridThread}/>
                        <Route exact path="/Thread/:id" component={Thread}/>
                        <Route exact path="/u/:username" component={UserProfile}/>
                        <Route exact path="/Login" component={Login}/>
                        <Route exact path="/Register" component={Register}/>
                        <Route exact path="/CreateThread" component={CreateThread}/>
                    </div>
                </div>
            </Router>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const currstate = state.login_reducer;
    return { ...currstate}
}

export default connect(mapStateToProps)(RootComponent);