import React from 'react';

export default ({ onSubmit, onChange, title }) => (
  <form onSubmit={onSubmit}>
    <label>
      Title:
      <br />
      <input
        name='title'
        type='text'
        autoComplete='off'
        required
        value={title}
        onChange={e => onChange('title', e)}
      />
    </label>
    <br />
    <input type='submit' value='Create Tag' />
  </form>
);
