import React, { Component } from 'react';

export default class Footer extends Component {
  render() {
    return (
      <div className='footer-buttons'>
        <div
          className='delete-notes-button is-light has-text-dark'
          style={{ display: this.props.activeTab === this.props.tabs.VIEW_NOTES ? 'flex' : 'none' }}>
          <button className='button' onClick={this.props.handleDeleteAllNotes}>
            Delete All
          </button>
        </div>
        <div
          className='delete-tags-button is-light has-text-dark'
          style={{ display: this.props.activeTab === this.props.tabs.VIEW_TAGS ? 'flex' : 'none' }}>
          <button className='button' onClick={this.props.handleDeleteAllTags}>
            Delete All
          </button>
        </div>
        <div
          className='invisible-delete-button'
          style={{
            display:
              this.props.activeTab !== this.props.tabs.VIEW_NOTES && this.props.activeTab !== this.props.tabs.VIEW_TAGS
                ? 'flex'
                : 'none',
          }}
        />
        <div
          className='logout-button is-light has-text-dark'
          style={{
            display:
              this.props.activeTab !== this.props.tabs.LOGIN && this.props.activeTab !== this.props.tabs.REGISTER
                ? 'flex'
                : 'none',
          }}>
          <button className='button' onClick={() => this.props.logoutClick()}>
            Logout
          </button>
        </div>
      </div>
    );
  }
}
