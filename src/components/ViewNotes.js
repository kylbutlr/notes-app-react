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
      <ol>{this.props.notes.map(n => this.props.renderNote(n))}</ol>
    </div>
    )
  }
}
