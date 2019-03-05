import React from 'react';

export default ({ onSubmit, onChange, username, password, confirmPass }) => (
  <form onSubmit={onSubmit}>
    <label>
      <span>Username: (4-16)</span>
      <br />
      <input
        pattern='.{4,16}'
        name='username'
        type='text'
        autoComplete='off'
        required
        value={username}
        onChange={e => onChange('username', e)}
      />
    </label>
    <label>
      <span>Password: (4-16)</span>
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
    <label>
      <span>Confirm Password:</span>
      <br />
      <input
        name='confirmPass'
        type='password'
        autoComplete='off'
        required
        value={confirmPass}
        onChange={e => onChange('confirmPass', e)}
      />
    </label>
    <input type='submit' value='Register New User' />
  </form>
);
