import React from 'react';

export default ({ onSubmit, onChange, title, text, tags }) => (
  <form onSubmit={onSubmit}>
    <label className='field'>
      <span className='label'>Title:</span>
      <input
        name='title'
        id='create-note-input'
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
      <span className='label'>Tag(s): (separated by commas)</span>
      <input
        name='tags'
        className='input'
        type='text'
        autoComplete='off'
        value={tags || ''}
        placeholder='Optional, tag(s) must exist'
        onChange={e => onChange('tags', e)}
      />
    </label>
    <input
      className='button is-dark is-text-light has-text-weight-semibold'
      type='submit'
      value='Create Note'
    />
  </form>
);
