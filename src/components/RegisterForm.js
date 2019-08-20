import React from 'react';

export default ({ tabs, activeTab, tabClick, onSubmit, onChange, username, password, confirmPass }) => (
  <div
    className='register'
    style={{
      display: activeTab === tabs.REGISTER ? 'flex' : 'none',
    }}>
    <h2 className='subtitle is-3 has-text-dark has-text-centered has-text-weight-semibold'>Register:</h2>
    <form onSubmit={onSubmit}>
      <label className='field'>
        <span className='label'>Username:</span>
        <input
          pattern='.{4,16}'
          name='username'
          id='register-input'
          className='input'
          type='text'
          autoComplete='off'
          required
          placeholder='4 - 16 characters'
          value={username}
          onChange={e => onChange('username', e)}
        />
      </label>
      <label className='field'>
        <span className='label'>Password:</span>
        <input
          name='password'
          id='register-password-input'
          className='input'
          type='password'
          autoComplete='off'
          required
          placeholder='4 - 16 characters'
          value={password}
          onChange={e => onChange('password', e)}
        />
      </label>
      <label className='field'>
        <span className='label'>Confirm Password:</span>
        <input
          name='confirmPass'
          className='input'
          type='password'
          autoComplete='off'
          required
          value={confirmPass}
          onChange={e => onChange('confirmPass', e)}
        />
      </label>
      <input
        className='button is-dark is-text-light has-text-weight-semibold'
        type='submit'
        value='Register'
      />
    </form>
    <div className='or'>or</div>
    <button
      className='button is-dark is-text-light has-text-weight-semibold'
      onClick={() => tabClick(tabs.LOGIN)}>
      Back to Login
    </button>
  </div>
);
