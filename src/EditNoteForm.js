import React from 'react';

export default ({ onSubmit, onChange, title, text, tags, id }) => (
  <form onSubmit={onSubmit}>
    <label>
      <span>Title:</span>
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
    <label>
      <span>Text:</span>
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
    <label>
      <span>Tags:</span>
      <br />
      <input
        name='tags'
        type='text'
        autoComplete='off'
        value={tags || ''}
        onChange={e => onChange('tags', e)}
      />
    </label>
    <input name='id' type='text' value={id} onChange={e => onChange('id', e)} />
    <input type='submit' value='Save Note' />
  </form>
);
