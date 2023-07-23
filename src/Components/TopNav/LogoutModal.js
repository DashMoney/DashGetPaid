import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CloseButton from 'react-bootstrap/CloseButton';

class LogoutModal extends React.Component {

  handleCloseClick = () => {
    this.props.hideModal();
  };

  handleDisconnect = () => {
    this.props.handleLogout();
    this.props.closeTopNav();
    this.handleCloseClick();
  }


  render() {
    let modalBkg = "";
    let closeButtonColor;
    
    if(this.props.mode === "primary"){
      modalBkg = "modal-backcolor-primary";
      closeButtonColor = <CloseButton onClick={this.handleCloseClick}/>
    }else{
      modalBkg = "modal-backcolor-dark";
      closeButtonColor = <CloseButton onClick={this.handleCloseClick} variant="white"/>
    }
    return (
      <>
        <Modal show={this.props.isModalShowing}
        contentClassName={modalBkg}>
        <Modal.Header >
          <Modal.Title>Log out</Modal.Title>
          {closeButtonColor}
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to disconnect?</p>
        </Modal.Body>

        <Modal.Footer>
        <Button variant="primary" onClick={this.handleDisconnect}>
              Log Out
            </Button>
        </Modal.Footer>
      </Modal>
      </> 
    );
  }
}

export default LogoutModal;
