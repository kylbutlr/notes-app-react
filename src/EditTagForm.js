import React from 'react';

export default ({ onSubmit, onChange, title, id }) => (
  <form onSubmit={onSubmit}>
    <label>
      <span>Name:</span>
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
    <input name='id' type='text' value={id} onChange={e => onChange('id', e)} />
    <input type='submit' value='Save Tag' />
  </form>
);
