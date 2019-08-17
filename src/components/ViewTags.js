import React, { Component } from 'react'

export default class ViewTags extends Component {
  render() {
    return (
      <div
        className='view-tags'
        style={{
          display: this.props.activeTab === this.props.tabs.VIEW_TAGS ? 'block' : 'none',
        }}>
        <div className='tags-title'>
          <h2 className='subtitle is-3 has-text-dark has-text-centered has-text-weight-semibold'>
            All Tags:
          </h2>
        </div>
        <ol
          style={{
            display: this.props.tags.length === 0 ? 'block' : 'none',
          }}>
          <li>
            <div className='list-info'>
              <h4 className='has-text-centered has-text-weight-semibold'>No tags currently exist.</h4>
              <h4>Try creating a new tag above!</h4>
            </div>
          </li>
        </ol>
        <ol>{this.props.tags.map(n => this.props.renderTag(n))}</ol>
      </div>
    )
  }
}
