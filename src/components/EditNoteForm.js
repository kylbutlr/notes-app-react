import React from 'react';

export default ({ tabs, activeTab, onSubmit, onChange, title, text, tags, id }) => (
  <div
    className='edit-note'
    style={{
      display: activeTab === tabs.EDIT_NOTE ? 'block' : 'none',
    }}>
    <h2 className='subtitle is-3 has-text-dark has-text-centered'>Edit Note:</h2>
    <form onSubmit={onSubmit}>
      <label className='field'>
        <span className='label'>Title:</span>
        <input
          name='title'
          id='edit-note-input'
          className='input'
          type='text'
          autoComplete='off'
          required
          value={title}
          onChange={e => onChange('title', e)}
        />
      </label>
      <label className='field'>
        <span className='label'>Text:</span>
        <input
          name='text'
          className='input'
          type='text'
          autoComplete='off'
          required
          value={text}
          onChange={e => onChange('text', e)}
        />
      </label>
      <label className='field'>
        <span className='label'>Tag(s):</span>
        <input
          name='tags'
          className='input'
          type='text'
          autoComplete='off'
          value={tags || ''}
          placeholder='Optional; Tag(s) must exist'
          onChange={e => onChange('tags', e)}
        />
        <p className='help is-dark has-text-centered'>(Separate by commas)</p>
      </label>
      <input name='id' type='text' value={id} onChange={e => onChange('id', e)} />
      <input
        className='button is-dark is-text-light has-text-weight-semibold'
        type='submit'
        value='Save Note'
      />
    </form>
  </div>
);
