import React from 'react';
import { useState, useEffect } from 'react';
import { Button, Card, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import MetaMaskOnboarding from '@metamask/onboarding';


const Auth = () => {

    const forwarderOrigin = 'http://localhost:3000';
    // usetstate for storing and retrieving wallet details
    const [data, setdata] = useState({
      address: "",
      username: "",
    });

    //We create a new MetaMask onboarding object to use in our app
    const onboarding = new MetaMaskOnboarding({ forwarderOrigin });

    const [ onboardButton, setButtonText ] = useState({text:"" , func:()=>{}});

       //------Inserted Code------\\
    const MetaMaskClientCheck = () => {
      //Now we check to see if MetaMask is installed
      if (!isMetaMaskInstalled()) {
        //If it isn't installed we ask the user to click to install it
        setButtonText({text:'Click here to install MetaMask!',func:onClickInstall});
      } else {
        //If it is installed we change our button text
        setButtonText({text:'Connect',func:btnhandler});
        // setButtonText({func:{btnhandler}});
      }
    };
    
    const onClickInstall = () => {
      //On this object we have startOnboarding which will start the onboarding process for our end user
      setButtonText({text:'Onboarding in progress',func:btnhandler});
      onboarding.startOnboarding();
    }

    //Created check function to see if the MetaMask extension is installed
    const isMetaMaskInstalled = () => {
      //Have to check the ethereum binding on the window object to see if it's installed
      return Boolean( window.ethereum && window.ethereum.isMetaMask);
    }

    // Button handler button for handling a
    // request event for metamask
    const btnhandler = () => {
    
      // Asking if metamask is already present or not
      if (window.ethereum) {
        // res[0] for fetching a first wallet
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((res) => accountChangeHandler(res[0]));
      } else {
        alert("install metamask extension!!");
      }
    };
    
    // getbalance function for getting a balance in
    // a right format with help of ethers
    
    // Function for getting handling all events
    const accountChangeHandler = (account) => {
      // Setting an address data
      setdata({
        address: account,
      });
    };

    const handleChange = (event) =>{
        const name = event.target.name;
        const value = event.target.value;
        setdata(values => ({...values, [name]: value})) 

    }
    const handleSubmit = (e) => {  
        e.preventDefault();
        fetch("http://localhost:5000/", {
          method: "POST",
          headers: {"Content-Type": "application/JSON"},
          body: JSON.stringify(data) 
        }).then((response) => {
            console.log(response);
            return response.json();
        })
    }

    React.useEffect(() => MetaMaskClientCheck, []);
    
    return (
        <div className='root'>
        <Card className="text-center">
          <Card.Header>
            <strong>Address: </strong>
            {data.address}
          </Card.Header>
          <Card.Body>
            <Button onClick={onboardButton.func} className="connectButton" variant="primary">
              {onboardButton.text}
            </Button>
          </Card.Body>
        </Card>

        <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3' controlId='formBasicText'>
                <Form.Label>User name</Form.Label>
                <Form.Control 
                  name='username' 
                  value={data.username || ""}  
                  onChange={handleChange} 
                  type='text' 
                  placeholder='Enter username' 
                />
                <Form.Text className='text-muted'>
                    We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>

            <Button variant='primary' type='submit'>Submit</Button>

        </Form>
        </div >
    );
  }

export default Auth;