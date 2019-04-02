import React, { Component } from 'react';

export default class SearchForm extends Component {
  render() {
    return (
      <div
        className='search'
        style={{
          display:
            this.props.activeTab !== this.props.tabs.LOGIN &&
            this.props.activeTab !== this.props.tabs.REGISTER
              ? 'block'
              : 'none',
        }}>
        <form onSubmit={this.props.onSubmit}>
          <label>
            <span className='search-span'>Search:</span>
            <input
              name='search'
              id='search-input'
              className='input'
              type='text'
              autoComplete='off'
              required
              value={this.props.searchInput}
              placeholder='Search by Tag(s)'
              onChange={e => this.props.onChange(e)}
            />
          </label>
          <input className='button is-light has-text-dark' type='submit' value='Search' />
        </form>
      </div>
    );
  }
}
