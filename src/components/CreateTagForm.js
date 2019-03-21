import React from 'react';

export default ({ onSubmit, onChange, title }) => (
  <form onSubmit={onSubmit}>
    <label className='field'>
      <span className='label'>Tag Name(s):</span>
      <input
        name='title'
        id='create-tag-input'
        className='input'
        type='text'
        autoComplete='off'
        required
        value={title}
        placeholder='Separate multiple by commas'
        onChange={e => onChange('title', e)}
      />
    </label>
    <input className='button is-dark is-text-light has-text-weight-semibold' type='submit' value='Create Tag' />
  </form>
);