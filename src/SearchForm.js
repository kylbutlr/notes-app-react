import React from 'react';

export default ({ onSubmit, onChange, searchInput }) => (
  <form onSubmit={onSubmit}>
    <label>
      <span>Search:</span>
      <br />
      <input
        name='search'
        type='text'
        autoComplete='off'
        required
        value={searchInput}
        placeholder='Search by Tag(s)'
        onChange={e => onChange(e)}
      />
    </label>
    <input type='submit' value='Search' />
  </form>
);
