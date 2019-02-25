import React from 'react';

export default ({ onSubmit, onChange, title, text, tags }) => (
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
    <label>
      Text:
      <br />
      <input
        name='text'
        type='text'
        autoComplete='off'
        required
        value={text}
        onChange={e => onChange('text', e)}
      />
    </label>
    <br />
    <label>
      Tag(s):
      <br />
      <input
        name='tags'
        type='text'
        autoComplete='off'
        value={tags || ''}
        onChange={e => onChange('tags', e)}
      />
    </label>
    <br />
    <input type='submit' value='Create Note' />
  </form>
);
