import React from 'react';

export default ({ onSubmit, onChange, username, password, confirmPass }) => (
  <form onSubmit={onSubmit}>
    <label>
      Username: (4-16)
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
    <br />
    <label>
      Password: (4-16)
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
    <label>
      Confirm Password:
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
    <br />
    <input type='submit' value='Register' />
  </form>
);
