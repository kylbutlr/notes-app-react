import React from 'react';

export default ({ onSubmit, onChange, title, id }) => (
  <form onSubmit={onSubmit}>
    <label className='field'>
      <span className='label'>Name:</span>
      <input
        name='title'
        id='edit-tag-input'
        className='input'
        type='text'
        autoComplete='off'
        required
        value={title}
        onChange={e => onChange('title', e)}
      />
    </label>
    <input name='id' type='text' value={id} onChange={e => onChange('id', e)} />
    <input className='button is-dark is-text-light has-text-weight-semibold' type='submit' value='Save Tag' />
  </form>
);
