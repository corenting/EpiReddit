import React, { Component } from "react";
import { connect } from 'react-redux';
import { Button, Icon, Label } from 'semantic-ui-react'

class ButtonVote extends Component {
    constructor(props)
    {
        super(props);

        this.toggleup = this.toggleup.bind(this);
        this.toggledown = this.toggledown.bind(this);

        if (this.props.toggleup)
        {
            this.state = 
            {
                toggleupcolor : true, 
                toggledowncolor : false
            }
        }
        else if (this.props.toggledown)
        {
            this.state = 
            {
                toggleupcolor : false,
                toggledowncolor : true
            }        
        }
        else
        {
            this.state = 
            {
                toggleupcolor : false, 
                toggledowncolor : false
            } 
        }
    }

    componentWillReceiveProps(newProps){
        if (newProps.toggleup)
        {
            this.setState({ toggleupcolor : true, toggledowncolor : false });
        }
        else if (newProps.toggledown)
        {
            this.setState({ toggledowncolor : true, toggleupcolor : false });
        }
        else
        {
            this.setState({ toggledowncolor : false, toggleupcolor : false });
        }
    }

    toggleup(){
        if (this.state.toggleupcolor)
        {
            return this.toggleneutral();
        }
        this.setState({ toggleupcolor : true, toggledowncolor : false });
        this.props.voteup();
    }

    toggledown() {
        if (this.state.toggledowncolor)
        {
            return this.toggleneutral();
        }
        this.setState({ toggledowncolor : true, toggleupcolor : false });
        this.props.votedown();
    }

    toggleneutral() {
        this.setState({ toggledowncolor : false, toggleupcolor : false });
        this.props.voteneutral();
    }

    render() { return (
        <Button as='div' labelPosition='right'>
            <Button.Group size={this.props.size}>
                {this.state.toggleupcolor && <Button color="grey" onClick={() => this.toggleup()}><Icon name='arrow up' fitted color='green' ></Icon> </Button>}
                {!this.state.toggleupcolor && <Button onClick={() => this.toggleup()}><Icon name='arrow up' fitted color='green' ></Icon> </Button>}
                <Button.Or text=''/>
                {this.state.toggledowncolor && <Button color="grey" onClick={() => this.toggledown()}><Icon name='arrow down' fitted color='red'></Icon> </Button>}
                {!this.state.toggledowncolor && <Button onClick={() => this.toggledown()}><Icon name='arrow down' fitted color='red'></Icon> </Button>}
            </Button.Group>  
            <Label as='span' basic pointing='left'>{this.props.vote}</Label>
        </Button>)
    }
}

export default connect()(ButtonVote);