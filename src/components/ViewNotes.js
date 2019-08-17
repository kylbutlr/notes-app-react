import React, { Component } from 'react'

export default class ViewNotes extends Component {
  render() {
    return (
      <div
      className='view-notes'
      style={{
        display:
          this.props.activeTab === this.props.tabs.VIEW_NOTES && this.props.searching === false
            ? 'block'
            : 'none',
      }}>
      <h2 className='subtitle is-3 has-text-dark has-text-centered'>Notes:</h2>
      <ol
        style={{
          display: this.props.notes.length === 0 ? 'block' : 'none',
        }}>
        <li>
          <div className='list-info'>
            <h4 className='has-text-centered has-text-weight-semibold'>No notes currently exist.</h4>
            <h4>Try creating a new note or tag above!</h4>
          </div>
        </li>
      </ol>
      <ol>{this.props.notes.map(n => this.props.renderNote(n))}</ol>
    </div>
    )
  }
}
