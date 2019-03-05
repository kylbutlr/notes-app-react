import React from 'react';

export default ({ onSubmit, onChange, username, password }) => (
  <form onSubmit={onSubmit}>
    <label>
      <span>Username:</span>
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
    <label>
      <span>Password:</span>
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
    <input type='submit' value='Login' />
  </form>
);
