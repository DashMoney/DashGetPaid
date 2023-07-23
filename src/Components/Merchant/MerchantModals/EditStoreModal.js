import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import CloseButton from "react-bootstrap/CloseButton";

//Store needs
/**
 *  description: { 
          type: 'string',
          minLength: 1,
          maxLength: 250,
        },
        open:{
          type: 'boolean'
        },
 */

class EditStoreModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      descriptionInput: "",
      storeStatus: this.props.DGPStore[0].open,
      tooLongError: false,
      validityAvail: false,
      validityCheck: false,
    };
  }

  handleCloseClick = () => {
    this.props.hideModal();
  };

  handleStatus = () => {
    if(this.state.storeStatus){
      this.setState({
        storeStatus: false,
      });
    } else {
      this.setState({
        storeStatus: true,
      });
    }
  }


  formValidate = (messageText) => {

    let regex = /^.[\S\s]{0,250}$/; 

    let valid = regex.test(messageText);

    if (valid) { //Put tag error here
      this.setState({
        messageInput: messageText,
        tooLongError: false,
      });
      return true;
    } else {
      if (messageText.length > 250) {
        this.setState({
          tooLongError: true,
        });
      }
      return false;
    }
  };

  onChange = (event) => {
    event.preventDefault();
    event.stopPropagation();

    //console.log(event.target.value);
    //this is the message body!!!

      if (this.formValidate(event.target.value) === true) {

        this.setState({
          validityCheck: true,
        });
      } else {
        this.setState({
          validityCheck: false,
        });
      }

    }

  handleSubmitClick = (event) => {
    event.preventDefault();
    console.log(event.target.ControlTextarea1.value);

    if (this.formValidate(event.target.ControlTextarea1.value)) {

    
        let newStore = {
          description: `${event.target.ControlTextarea1.value}`,
          open: this.state.storeStatus
          };

        
      this.props.editDGPStore(newStore);
      this.props.hideModal();

    } else {

      console.log('Invalid Store Creation');
        }
  };

  render() {
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


    return (
      <>
        <Modal show={this.props.isModalShowing} backdropClassName={modalBackdrop} contentClassName={modalBkg}>
          <Modal.Header>
            <Modal.Title>
               <h3>
               <b>Edit My Store/Menu</b>
               </h3>
            </Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            <Form
              noValidate
              onSubmit={this.handleSubmitClick}
               
            >
              <Form.Group className="mb-3" controlId="ControlTextarea1"
              >
                <Form.Label><b>My Store/Menu Description</b></Form.Label>

                <Form.Control
                  onChange={this.onChange}
                  as='textarea'
                  rows={2}
                  placeholder={this.props.DGPStore[0].description}
                  required
                  isInvalid={this.state.tooLongError}
                />

                {this.state.tooLongError ? (
                <Form.Control.Feedback className="floatLeft" type="invalid">
                Sorry, this is too long! Please use less than 250 characters.
              </Form.Control.Feedback>
                
              ) : (
                <></>
              )}

</Form.Group>

<Form.Group className="mb-3" id="formGridCheckbox">
<Form.Label><b>Store: Open or Closed</b></Form.Label>
<Form.Check 
        type="switch"
        id="custom-switch"
        label={this.state.storeStatus?'Open':'Closed'}
        onChange={() => this.handleStatus()}
      />
      <p></p>
      <p>
          <b>Open</b> means people can view your items and make payments to you. <b>Closed</b> means they can see your store when searching, but they can not view items or make purchases.
          </p>
      </Form.Group>
          
              {this.state.validityCheck ? (
                <Button variant="primary" type="submit">
                  Edit Store/Menu
                </Button>
              ) : (
                <Button disabled variant="primary">
                  Edit Store/Menu
                </Button>
              )}
               

            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default EditStoreModal;
