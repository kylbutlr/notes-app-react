import React from 'react';

export default ({ onSubmit, onChange, username, password }) => (
  <form onSubmit={onSubmit}>
    <label>
      Username:
      <br />
      <input
        name='username'
        type='text'
        autoComplete='off'
        required
        value={username}
        onChange={e => onChange('username', e)}
      />
    </label>
    <br />
    <label>
      Password:
      <br />
      <input
        name='password'
        type='password'
        autoComplete='off'
        required
        value={password}
        onChange={e => onChange('password', e)}
      />
    </label>
    <br />
    <input type='submit' value='Login' />
  </form>
);
