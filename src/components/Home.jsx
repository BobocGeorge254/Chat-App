import React, { useState, useEffect }  from 'react';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import Navbar from './navigation/Navbar';


function Home() {
  
  const storedLoginData = localStorage.getItem('loginData');
  const storedEmail = localStorage.getItem('email');

  const [loginData, setLoginData] = useState(storedLoginData === 'true');
  const [email, setEmail] = useState(storedEmail || '');
  
  const getStatus = (loginStatus) => {
    setLoginData(loginStatus);
    localStorage.setItem('loginData', loginStatus.toString());
  };
  
  const getEmail = (email) => {
    setEmail(email);
    localStorage.setItem('email', email);
  };

  const logout = () => {
    localStorage.removeItem('loginData');
    localStorage.removeItem('email');
    setLoginData(false);
    setEmail('');
  };

  const [activeComponent, setActiveComponent] = useState('SignIn');
  
  useEffect(() => {
    if (loginData) {
      setActiveComponent('SignIn');
    } 
    else {
      setActiveComponent('SignUp');
    }
  }, [loginData]);

  let componentToRender;
  if (activeComponent === 'SignIn') {
    componentToRender = <SignIn getStatus={getStatus} getEmail={getEmail}/>;
  } 
  else if (activeComponent === 'SignUp') {
    componentToRender = <SignUp />;
  }
  
  if (loginData === true) {
      const text = "Welcome back, " + email + "!";
      return (
        <div>
          <h1 style={{textAlign:'center'}}> {text} </h1>
          <button onClick={logout}
                  style={{
                        display: "flex",
                        margin: "auto",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#4CAF50", 
                        border: "none",
                        color: "white", 
                        width: "20vw",
                        height: "5vh",
                        fontSize: "2vh",
                        borderRadius: "5px", 
                        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)", 
                        transition: "0.3s", 
                        cursor: "pointer",
                    }}>
              Logout
          </button>
        </div>
      );
  }
  else {
    return (
      
      <div className="Home">
          
        <Navbar setActiveComponent={setActiveComponent} />
        {componentToRender}
      </div>
    );
  }
  
}

export default Home;
