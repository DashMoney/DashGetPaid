import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import CloseButton from "react-bootstrap/CloseButton";

//Item needs
/**
 name:{
          type: 'string',
          minLength: 1,
          maxLength: 32,
        },
        price: { //this will be priced in duffs but i will have Dash, mDash for display
          type: 'integer',
          minimum: 0,
        },
        description: { 
          type: 'string',
          minLength: 1,
          maxLength: 250,
        },
        avail:{
          type: 'boolean'
        },
 */

class EditItemModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      nameInput: this.props.selectedItem.name,
      priceInput: this.props.selectedItem.price,
      descriptionInput: this.props.selectedItem.description,

      itemAvail: this.props.selectedItem.avail,

      validName: true,
      tooLongNameError: false,

      validPrice: true,
      
      validDescription:true,
      tooLongDescriptionError: false,

      validityAvail: false,
      validityCheck: false,
    };
  }

  handleCloseClick = () => {
    this.props.hideModal();
  };

  handleAvail = () => {
    if(this.state.itemAvail){
      this.setState({
        itemAvail: false,
      },()=>console.log(this.state.itemAvail));
    } else {
      this.setState({
        itemAvail: true,
      }
     // ,()=>console.log(this.state.itemAvail)
      );
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
     //console.log(event.target.id);


    //console.log(`id = ${event.target.id}`);

    if (event.target.id === "formItemName") {
      event.preventDefault();
    event.stopPropagation();
      this.itemNameValidate(event.target.value);
    }

    if (event.target.id === "formItemPrice") {
      event.preventDefault();
    event.stopPropagation();
      this.itemPriceValidate(event.target.value);
    }

    if (event.target.id === "formItemDescription") {
      event.preventDefault();
    event.stopPropagation();
      this.itemDescriptionValidate(event.target.value);
    }
    
    if (event.target.id === "custom-switch") {
      event.stopPropagation();
      this.handleAvail();
    }
  };

  itemNameValidate = (name) => {
    
    let regex = /^.{1,32}$/;
    let valid = regex.test(name);

    if (valid) {
    this.setState({
      nameInput: name,
      tooLongNameError: false,
      validName: true,
    });
    
  } else {

    if (name.length > 32) {
      this.setState({
        nameInput: name,
        tooLongNameError: true,
        validName:false,
      });
    } else {
      this.setState({
        nameInput: name,
        validName: false,
      });
  }
}
     
  };

  itemPriceValidate = (numberInput) => {
    //console.log(this.props.accountBalance);

    let regex = /(^[0-9]+[.,]{0,1}[0-9]{0,5}$)|(^[.,][0-9]{1,5}$)/;
    //CHANGED TO LIMIT TO minimum mDash possible
    //let regex = /(^[0-9]+[.,]{0,1}[0-9]*$)|(^[.,][0-9]+$)/;

    let valid = regex.test(numberInput);

//MAX SPENDABLE IS 1000 DASH
    if (valid && numberInput > 0 && numberInput <= 1000) {
      this.setState({
        priceInput: numberInput,
        validPrice: true,
      });
    } else {
      this.setState({
        priceInput: numberInput,
        validPrice: false,
      });
    }
  };

  itemDescriptionValidate = (description) => {
    
    let regex = /^.[\S\s]{0,250}$/; 

    let valid = regex.test(description);

    if (valid) { 
      this.setState({
        descriptionInput: description,
        validDescription: true,
        tooLongDescriptionError: false,
      });

    } else {

      if (description.length > 250) {
        this.setState({
          descriptionInput: description,
        validDescription: false,
        tooLongDescriptionError: true,
        });
      }else {
        this.setState({
          descriptionInput: description,
        validDescription: false,
        });
      }
      
    }
     
  };


  handleSubmitClick = (event) => {
    event.preventDefault();
    //console.log(event.target.ControlTextarea1.value);
    let correctFormPrice;
if(this.state.priceInput === this.props.selectedItem.price){
  correctFormPrice = Number(this.props.selectedItem.price);
}else{
  correctFormPrice = Number((this.state.priceInput * 100000000).toFixed(0));
}

        let newItem = {
          name: this.state.nameInput,
          price:  correctFormPrice,
          description: this.state.descriptionInput,
          avail: this.state.itemAvail
          };
          
          //console.log(newItem);
      this.props.editDGPItem(newItem);
      this.props.hideModal();
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
               <b>Edit Item</b>
               </h3>
            </Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
            <Form
              noValidate
              onSubmit={this.handleSubmitClick}
              onChange={this.onChange}
            >

              {/* ITEM NAME FORM BELOW */}
              <Form.Group className="mb-3" controlId="formItemName">
                  
                  <Form.Label><b>Item Name</b></Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={this.props.selectedItem.name}
                    required
              isInvalid={this.state.tooLongNameError}
              isValid={this.state.validName}
                  />
                  <p></p>
                  <Form.Control.Feedback type="invalid">
              Item name is too long.
            </Form.Control.Feedback>
                  <Form.Control.Feedback type="valid">
              Item name is acceptable!
            </Form.Control.Feedback>

{/* ITEM PRICE FORM BELOW */}

            <Form.Group className="mb-3" controlId="formItemPrice">
                  <Form.Label>Item Price (in Dash)</Form.Label>
 
                  
                    {/* <Form.Control
                      type="number"
                      placeholder={this.state.amountToSend}
                      readOnly
                    /> */}
                  
                    <Form.Control
                      type="number"
                      defaultValue={this.props.selectedItem.price/100000000}
                      required
                      isValid={this.state.validPrice}
                      isInvalid={!this.state.validPrice}
                    />
                  
                </Form.Group>
                  
                  {/* ITEM DESCRIPTION FORM BELOW */}
                </Form.Group>
              <Form.Group className="mb-3" controlId="formItemDescription"
              >
                <Form.Label><b>Item Description</b></Form.Label>

                <Form.Control
                  onChange={this.onChange}
                  as='textarea'
                  rows={2}
                  defaultValue={this.props.selectedItem.description}
                  required
                  isInvalid={this.state.tooLongDescriptionError}
                  isValid={this.state.validDescription}
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
<Form.Label><b>Item Availablility</b></Form.Label>
<Form.Check 
        type="switch"
        id="custom-switch"
        label={this.state.itemAvail?<b>Available</b>:<b>Unavailable</b>}
        //onChange={()=>this.handleAvail()}
      />
      <p></p>
        <p>
          <b>Available</b> means people can add the item to their carts and place orders for the item.
          </p>
      </Form.Group>
          
              {this.state.validName &&
              this.state.validPrice &&
              this.state.validDescription? (
                <Button variant="primary" type="submit">
                  Edit Item
                </Button>
              ) : (
                <Button variant="primary" disabled>
                  Edit Item
                </Button>
              )}
               

            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default EditItemModal;
