import React from 'react';

export default ({ tabs, activeTab, onSubmit, onChange, title }) => (
  <div
            className='create-tag'
            style={{
              display: activeTab === tabs.CREATE_TAG ? 'block' : 'none',
            }}>
            <h2 className='subtitle is-3 has-text-dark has-text-centered'>Create Tag(s):</h2>
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
  </div>
);
