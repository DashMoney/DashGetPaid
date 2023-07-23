import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CloseButton from 'react-bootstrap/CloseButton';

class StoreStatusModal extends React.Component {

  handleCloseClick = () => {
    this.props.hideModal();
  };

  handleStoreStatus = () => {
    let storeObject = {
      description: this.props.DGPStore[0].description,
      open: !this.props.DGPStore[0].open,
    };
    
    this.props.editDGPStore(storeObject);
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
          <Modal.Title>{this.props.DGPStore[0].open?<b>Close My Store/Menu</b>:<b>Open My Store/Menu</b>}</Modal.Title>
          {closeButtonColor}
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to {this.props.DGPStore[0].open?<b>Close</b>:<b>Open</b>} store?</p>
          <p>Or</p>

          <Button variant="primary"
              onClick={() => this.props.showModal('EditStoreModal')}
          >Edit store/menu
          </Button>
        </Modal.Body>

        <Modal.Footer>
        <Button variant="primary" onClick={this.handleStoreStatus}>
        {this.props.DGPStore[0].open?<b>Close Store</b>:<b>Open Store</b>}
            </Button>
        </Modal.Footer>
      </Modal>
      </> 
    );
  }
}

export default StoreStatusModal;
