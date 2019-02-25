import React from 'react';

export default ({ onSubmit, onChange, searchInput }) => (
  <form onSubmit={onSubmit}>
    <label>
      Search by Tag(s):
      <br />
      <input
        name='search'
        type='text'
        autoComplete='off'
        required
        value={searchInput}
        onChange={e => onChange(e)}
      />
    </label>
    <br />
    <input type='submit' value='Search' />
  </form>
);
