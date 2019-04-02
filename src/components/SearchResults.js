import React, { Component } from 'react';

export default class SearchResults extends Component {
  render() {
    return (
      <div
        className='view-search'
        style={{
          display:
            this.props.activeTab === this.props.tabs.VIEW_NOTES && this.props.searching === true
              ? 'block'
              : 'none',
        }}>
        <div className='search-title'>
          <h2 className='subtitle is-3 has-text-dark has-text-centered'>Search Results:</h2>
          <h3 className='subtitle is-4 has-text-dark has-text-centered'>
            {this.props.searchResults.length} found for {this.props.searchedTag.join(', ')}:
          </h3>
          <h4
            className='subtitle is-3 has-text-dark has-text-centered'
            style={{
              display: this.props.searchResults.length === 0 ? 'block' : 'none',
            }}>
            No Results Found
          </h4>
        </div>
        <ol>{this.props.searchResults.map(n => this.props.renderNote(n))}</ol>
      </div>
    );
  }
}
