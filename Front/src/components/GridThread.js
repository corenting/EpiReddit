import React, { Component } from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'  
import { Card, Menu, Divider, Button, Icon, Loader} from 'semantic-ui-react'
import '../App.css'
import ThreadCard from './ThreadCard'
import getAllAction from '../actions/thread/getall'

class GridThread extends Component {

    constructor(props)
    {
        super(props);

        // Get page number from route
        let page = 0
        if (typeof(this.props.match.params.page) !== 'undefined') {
            page = parseInt(this.props.match.params.page, 10)
        }

        // Check if frontpage or not
        let isFrontpage = false
        if (typeof(this.props.match.path) !== 'undefined' && (this.props.match.path === '/' || this.props.match.path === '/:page')) {
            isFrontpage = true
        }

        // Get subreddit from route
        let category = 'frontpage'
        if (typeof(this.props.match.params.category) !== 'undefined') {
            category = this.props.match.params.category
        }

        this.state = {
            activeItem : "HOT",
            page,
            isFrontpage,
            category,
        }

        this.handleItemClick = this.handleItemClick.bind(this);
        this.loadPage = this.loadPage.bind(this);
        this.loadPage();
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log('shouldUpdate')
        return true;
    }

    loadPage() {
        this.props.dispatch(getAllAction(localStorage.getItem("jwt"), this.state.activeItem.toLowerCase(), this.state.page, this.state.category));
    }

    handleItemClick(e, { name }) {
        this.setState({ activeItem: name }, () => this.loadPage())
    }

    render() {
        // Pagination links according to current page / subreddit
        let displayPrevious = this.state.page !== 0;
        let previous = this.state.page - 1;
        let next = this.state.page + 1;
        let previousLink = '/r/' + this.state.category + '/' + previous;
        let nextLink = '/r/' + this.state.category + '/' + next;
        return (
            <div>
                <Menu pointing secondary>
                    <Menu.Item name='HOT' active={this.state.activeItem === 'HOT'} onClick={this.handleItemClick} />
                    <Menu.Item name='NEW' active={this.state.activeItem === 'NEW'} onClick={this.handleItemClick} />
                    <Menu.Menu position="right">
                        <Menu.Item as={Link} content='CREATE NEW THREAD' to={"/CreateThread?redirectUrl=" + this.props.location.pathname}></Menu.Item>
                    </Menu.Menu>
                </Menu>
                <h2>Page {this.state.page + 1}</h2>
                {this.props.isError &&
                    <h3>No posts to display</h3>
                }
                <Loader inline='centered' active={this.props.isFetching}>Loading posts...</Loader>
                <Card.Group>
                    {this.props.threads.map((item) => <ThreadCard load={() => this.loadPage()} {...item} key={item.id + 'post'}/>)}
                </Card.Group>
                <Divider/>
                <div className="page-buttons">
                    {displayPrevious &&
                        <a href={previousLink}>
                            <Button icon labelPosition='left'>
                                Previous
                                <Icon name='left arrow' />
                            </Button>
                        </a>
                    }
                    <a href={nextLink}>
                        <Button icon labelPosition='right'>
                            Next
                            <Icon name='right arrow' />
                        </Button>
                    </a>
                </div>
            </div>
        )
    }
}



function mapStateToProps(state, ownProps) {
    const currstate = state.thread_reducer;
    return { ...currstate}
}

export default connect(mapStateToProps)(GridThread)