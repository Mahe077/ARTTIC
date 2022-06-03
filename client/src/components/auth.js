import {useState} from 'react';
import { Button, Card, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";


const Auth = () => {
  
    // usetstate for storing and retrieving wallet details
    const [data, setdata] = useState({
      address: "",
      username: "",
    });
    
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
    
    return (
        <>
        <Card className="text-center">
          <Card.Header>
            <strong>Address: </strong>
            {data.address}
          </Card.Header>
          <Card.Body>
            <Button onClick={btnhandler} variant="primary">
              Connect to wallet
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
        </>
    );
  }

export default Auth;