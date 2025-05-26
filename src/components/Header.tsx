import React from 'react';
import { ReactComponent as Logo } from '../image/logo.svg';

export const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="hamburger-menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <Logo className="logo" />
      </div>
      <div className="header-right">
        <div className="user-bubble">
          Sign Up
        </div>
      </div>
    </header>
  );
};