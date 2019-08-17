import React from 'react';

export default ({ tabs, activeTab, tabClick, onSubmit, onChange, username, password }) => (
  <div
    className='login'
    style={{
      display: activeTab === tabs.LOGIN ? 'flex' : 'none',
    }}>
    <h2 className='subtitle is-3 has-text-dark has-text-centered has-text-weight-semibold'>Login:</h2>
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
    <div className='or'>or</div>
    <button
      className='button is-dark is-text-light has-text-weight-semibold'
      onClick={() => tabClick(tabs.REGISTER)}>
      Register
    </button>
  </div>
);
