import React from "react";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import CloseButton from 'react-bootstrap/CloseButton';

import "./ConnectWalletModal.css";

class ConnectWalletModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enteredMnem: '',
      validated: true,
      validityCheck: false,
    };
  }


  handleCloseClick = () => {
    this.props.hideModal();
  };

  onChange = (event) => {
    //console.log(event.target.value);
    if (this.formValidate(event.target.value) === true) {
      event.preventDefault();
      event.stopPropagation();
      this.setState({
        validityCheck: true,
      });
    } else {
      event.preventDefault();
      event.stopPropagation();
      this.setState({
        validityCheck: false,
      });
    }
  };

  handleSubmitClick = (event) => {
    event.preventDefault();
    console.log(event.nativeEvent.submitter.id); //Found it - identifies the button pressed
    
     if (this.formValidate(event.target.validationCustom01.value)) {
      if(event.nativeEvent.submitter.id==="Buyer-Login"){
        this.props.handleWalletConnection(event.target.validationCustom01.value,'buyer');
        this.props.closeTopNav();
        this.props.hideModal();
        //console.log('Successful Buyer login');

      }else if(event.nativeEvent.submitter.id==="Merchant-Login"){
      this.props.handleWalletConnection(event.target.validationCustom01.value,'merchant');
      this.props.closeTopNav();
      this.props.hideModal();
      //console.log('Successful Merchant login');
      //}
    } else {
      console.log(`Invalid Mnemonic: ${event.target.validationCustom01.value}`);
    }
    }
  };

  formValidate = (mnemonic) => {
    let regex = /^([a-z]+[ ]){11}[a-z]+$/m;
    let valid = regex.test(mnemonic);

    if (valid) {
      this.setState({
        enteredMnem: mnemonic,
      });
      return true;
    } else {
      return false;
    }
  };

  // handlePaste = async () => {
      
  //     let pastedText = await navigator.clipboard.readText()

  //     console.log(pastedText);

  //   if (this.formValidate(pastedText)) {
  //     this.props.handleWalletConnection(pastedText);
  //     this.props.hideModal();
  //   } else {
  //     console.log(`Invalid Mnemonic: ${pastedText}`);
  //   }
  // }

  render() {
    let modalBkg = "";
    let closeButtonColor;
    let modalBackdrop;
    
    if(this.props.mode === "primary"){
      modalBackdrop = "modal-backdrop-nochange";
      modalBkg = "modal-backcolor-primary";
      closeButtonColor = <CloseButton onClick={this.handleCloseClick}/>
    }else{
      modalBackdrop = "modal-backdrop-dark";
      modalBkg = "modal-backcolor-dark";
      closeButtonColor = <CloseButton onClick={this.handleCloseClick} variant="white"/>
    }

    return (
      <>
        <Modal 
      show={this.props.isModalShowing} backdropClassName={modalBackdrop} 
      contentClassName={modalBkg}>
        <Modal.Header >
          <Modal.Title><b>Connect Wallet</b></Modal.Title>
          {closeButtonColor}
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            onSubmit={this.handleSubmitClick}
            onChange={this.onChange}
          >
            <Form.Group className="mb-3" controlId="validationCustom01">
              <Form.Label>Enter Wallet Mnemonic</Form.Label>
              <Form.Control
                type="text"
                placeholder= "Enter Mnemonic (12 word passphrase) here..."
                required
                isInvalid={!this.state.validityCheck}
                isValid={this.state.validityCheck}
              />
              

              <Form.Control.Feedback type="invalid">
                Please provide valid mnemonic.
              </Form.Control.Feedback>

              <Form.Control.Feedback type="valid">
              Mnemonic looks good, so long as everything is spelled correctly.
            </Form.Control.Feedback>

              
                <p></p>
                <ul>
                  <li>
                    The 12 word phrase provided upon creation of your
                    wallet.
                  </li>
                  <li>No spaces at the beginning or the end.</li>
                  <li>Use lowercase for all words.</li>
                  <li>Only one space between words.</li>
                </ul>

            </Form.Group>
            
             
            <>
            {/* <div className="positionButtons">
              <span></span>
              <span>Buy Stuff</span>
              <span></span>
              <span></span>
              <span>Sell Stuff</span>
              <span></span>
            </div> */}
            <p></p>
            <div className="positionButtons">
              {/* <div>
              <p>Buy Stuff</p> */}
            <Button id="Buyer-Login" variant="primary" type="submit">
              <b>Customer Login</b>
              {/* <Badge bg="light" text="dark" pill>
                </Badge> */}
            </Button>
            {/* </div> */}
            <Button id="Merchant-Login" variant="primary" type="submit">
            <b>Merchant Login</b>
              {/* <Badge bg="light" text="dark" pill>
                  Merchant
                </Badge> */}
              
            </Button>
            </div>
            
            
            {/* <Form.Text className="text-muted">
                <p></p>
                <p><b>Login Buyer</b> means you can find merchants and place orders </p><p> 
                <b>Login Merchant</b> means you can view orders placed and add or edit items on your merchant page.
                </p>
                </Form.Text> */}
            </>
            

            {/* <Button variant="primary" type="submit">
              <b>Connect Wallet</b>
            </Button> */}

            {/* }  */}
           
              
            
          </Form>
          <p></p>

        </Modal.Body>

        <Modal.Footer>
        <p></p>

<p>
  If you do not have a wallet, go to{" "}<a rel="noopener noreferrer" target="_blank" href="https://dashgetnames.com/">
  <Badge bg="primary" text="light" pill>
    DashGetNames.com
  </Badge>
 </a>
  {" "} and get your wallet and name!
</p>
        {/* <p></p>
           
        <p>If you want to get paid, <b>Login as Merchant</b> below.</p>
                  
        <Button id="Merchant-Login"  variant="primary" onClick={() => {
                    this.props.showModal('CreateNewWalletModal');
                  }}><b>Merchant Login</b>
                  
        </Button> */}
        </Modal.Footer>
      </Modal>
      </>
    );
  }
}

export default ConnectWalletModal;
