import React from 'react';

export default ({ onSubmit, onChange, username, password }) => (
  <form onSubmit={onSubmit}>
    <label className='field'>
      <span className='label'>Username:</span>
      <input
        name='username'
        id='login-input'
        className='input'
        type='text'
        autoComplete='off'
        required
        value={username}
        onChange={e => onChange('username', e)}
      />
    </label>
    <label className='field'>
      <span className='label'>Password:</span>
      <input
        name='password'
        id='login-password-input'
        className='input'
        type='password'
        autoComplete='off'
        required
        value={password}
        onChange={e => onChange('password', e)}
      />
    </label>
    <input
      className='button is-dark is-text-light has-text-weight-semibold'
      type='submit'
      value='Login'
    />
  </form>
);
