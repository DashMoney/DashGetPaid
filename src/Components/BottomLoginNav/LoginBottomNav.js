import React from "react";
//import Container from 'react-bootstrap/Container';
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import "./LoginBottomNav.css";

class LoginBottomNav extends React.Component {

    render(){

      let buttonColor;
      if(this.props.mode==='dark'){
        buttonColor='primary';
      }else{
        buttonColor='secondary'
      }

    return (
      <>
        <Navbar
        
        className="bottomNav"  bg={this.props.mode}
        variant={this.props.mode} fixed="bottom">
          
          <Nav  className="one-level-nav">
          
          <Nav.Item>
        <Nav.Link>
        
          <Button
            variant={buttonColor}
            onClick={() => {
              this.props.showModal('ConnectWalletModal');
            }}
            >
            <div className="ms-2 me-auto">
              <div className="fw-bold">Connect Wallet</div>
              <Badge bg="light" text="dark" pill>
             Get Paid
              </Badge>
            </div>
          </Button>
          
        </Nav.Link>
        </Nav.Item>

          </Nav>
          {/* </Navbar.Collapse> */}
          
         </Navbar>
      </>
    );
  }
}
export default LoginBottomNav;
