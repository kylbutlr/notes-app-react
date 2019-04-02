import React, { Component } from 'react';

export default class Navigation extends Component {
  render() {
    return (
      <div className='navigation'>
        <button
          id='tabsVIEW_NOTES'
          className='button is-light has-text-dark'
          style={{
            display:
              this.props.activeTab === this.props.tabs.VIEW_TAGS ||
              this.props.activeTab === this.props.tabs.CREATE_NOTE ||
              this.props.activeTab === this.props.tabs.CREATE_TAG ||
              this.props.activeTab === this.props.tabs.EDIT_NOTE ||
              this.props.activeTab === this.props.tabs.EDIT_TAG ||
              this.props.searching === true
                ? 'block'
                : 'none',
          }}
          onClick={() => this.props.tabClick(this.props.tabs.VIEW_NOTES)}>
          Back to Notes
        </button>
        <button
          id='tabsCREATE_NOTE'
          className='button is-light has-text-dark'
          style={{
            display:
              this.props.activeTab === this.props.tabs.VIEW_NOTES && this.props.searching === false
                ? 'block'
                : 'none',
          }}
          onClick={() => this.props.tabClick(this.props.tabs.CREATE_NOTE)}>
          Create Note
        </button>
        <button
          id='tabsVIEW_TAGS'
          className='button is-light has-text-dark'
          style={{
            display:
              this.props.activeTab === this.props.tabs.CREATE_TAG || this.props.activeTab === this.props.tabs.EDIT_TAG
                ? 'block'
                : 'none',
          }}
          onClick={() => this.props.tabClick(this.props.tabs.VIEW_TAGS)}>
          Back to Tags
        </button>
        <button
          id='tabsVIEW_TAGS'
          className='button is-light has-text-dark'
          style={{
            display:
              this.props.activeTab === this.props.tabs.VIEW_NOTES ||
              this.props.activeTab === this.props.tabs.CREATE_NOTE ||
              this.props.activeTab === this.props.tabs.EDIT_NOTE
                ? 'block'
                : 'none',
          }}
          onClick={() => this.props.tabClick(this.props.tabs.VIEW_TAGS)}>
          View Tags
        </button>
        <button
          id='tabsCREATE_TAG'
          className='button is-light has-text-dark'
          style={{
            display: this.props.activeTab === this.props.tabs.VIEW_TAGS ? 'block' : 'none',
          }}
          onClick={() => this.props.tabClick(this.props.tabs.CREATE_TAG)}>
          Create Tag
        </button>
      </div>
    );
  }
}
