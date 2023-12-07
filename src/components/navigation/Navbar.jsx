import React from 'react';

function Navbar({ setActiveComponent }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand" href="#">Chat App</a>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => setActiveComponent('SignIn')}>Sign In</button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => setActiveComponent('SignUp')}>Sign Up</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
