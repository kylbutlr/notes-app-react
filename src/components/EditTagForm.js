import React from 'react';

export default ({ tabs, activeTab, onSubmit, onChange, title, id }) => (
  <div
    className='edit-tag'
    style={{
      display: activeTab === tabs.EDIT_TAG ? 'block' : 'none',
    }}>
    <h2 className='subtitle is-3 has-text-dark has-text-centered'>Edit Tag:</h2>
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
      <input
        className='button is-dark is-text-light has-text-weight-semibold'
        type='submit'
        value='Save Tag'
      />
    </form>
  </div>
);
