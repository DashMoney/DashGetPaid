import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CloseButton from 'react-bootstrap/CloseButton';

//const Dash = require('dash');

class TopUpIdentityModal extends React.Component{


  handleCloseClick=()=>{
    this.props.hideModal();
  }

  handleTopUp = () => {
    this.props.doTopUpIdentity(1000000);//this is where to set the top up amount**************
    this.props.hideModal();
  }

  handleDenomDisplay = (duffs, qty) => {
    if(duffs >= 1000000){
      return <span style={{ color: "#008de4" }}>{(duffs * qty/100000000).toFixed(3)} Dash</span>
    } else {
      return <span style={{ color: "#008de4" }}>{(duffs * qty/100000).toFixed(2)} mDash</span>
    }
  }

  render(){
    
    let modalBkg = "";
    let closeButtonColor;
    let modalBackdrop;

    if (this.props.mode === "primary") {
      modalBackdrop = "modal-backdrop-nochange";
      modalBkg = "modal-backcolor-primary";
      closeButtonColor = <CloseButton onClick={this.handleCloseClick} />;
    } else {
      modalBackdrop = "modal-backdrop-dark";
      modalBkg = "modal-backcolor-dark";
      closeButtonColor = (
        <CloseButton onClick={this.handleCloseClick} variant="white" />
      );
    }
 
    return(
      <Modal show={this.props.isModalShowing} backdropClassName={modalBackdrop} contentClassName={modalBkg}>
        <Modal.Header>
          <Modal.Title><h3>
               <b>Top Up Identity</b>
               </h3></Modal.Title>
          {closeButtonColor}
        </Modal.Header>
        <Modal.Body>
        {this.props.isLoadingWallet ? 
                <>
                  {/* <p> </p>
                  <div id="spinner">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                  <p> </p> */}
                  
                  <div className="paddingBadge">
                <b>Dash Balance</b>
                  
                    <h4>
                      Loading..
                    </h4>
                    </div>
                  
                  <p></p>
                </>
               : 
                <><div className="paddingBadge">
                <b>Dash Balance</b>
                  
                    <h4>
                      <b>{this.handleDenomDisplay(this.props.accountBalance,1)}</b>
                    </h4>
                    </div>
                  
                  <p></p>
                </>
              }
          
            Purchase 0.010 Dash worth of Dash Platform Credits. (This is enough for many actions on Dash Platform.) 
          
          </Modal.Body>
        <Modal.Footer>
          {this.props.isLoadingWallet?
          <Button variant="primary">
          <b>Wallet Loading..</b>
        </Button>:
        <Button variant="primary" onClick={this.handleTopUp}>
            <b>Top Up Identity</b>
          </Button>}
          
          
        </Modal.Footer>
      </Modal>
    );
  }
}

export default TopUpIdentityModal;
