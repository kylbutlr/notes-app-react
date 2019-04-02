import React, { Component } from 'react';

export default class Title extends Component {
  render() {
    return (
      <div className='title'>
        <div
          style={{
            display: this.props.loggedIn === false ? 'block' : 'none',
          }}>
          <h1 className='title has-text-light' onClick={() => this.props.tabClick(this.props.tabs.LOGIN)}>
            Notes
          </h1>
        </div>
      </div>
    );
  }
}
