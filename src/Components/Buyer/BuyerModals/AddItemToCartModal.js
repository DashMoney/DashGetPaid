import React from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Badge from "react-bootstrap/Badge";
import CloseButton from "react-bootstrap/CloseButton";

class AddItemToCartModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemQuantity:1,
    };
  }

  handleCloseClick = () => {
    this.props.hideModal();
  };

  handleQuantityClick = (input) => {
    this.setState({
      itemQuantity: this.state.itemQuantity + input,
    })
  }
  handleDenomDisplay = (duffs) => {
    if(duffs >= 1000000){
      return <span style={{ color: "#008de4" }}>{(duffs * this.state.itemQuantity/100000000).toFixed(3)} Dash</span>
    } else {
      return <span style={{ color: "#008de4" }}>{(duffs * this.state.itemQuantity/100000).toFixed(2)} mDash</span>
    }
  }

  handleSubmitClick = () => {
    
    if(this.state.itemQuantity > 0){
        
      this.props.addToCart(this.state.itemQuantity);
      this.props.hideModal();

    } else {

      console.log('Nothing Added to Cart');
      this.props.hideModal();
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
               <b>Add to Cart</b>
               </h3>
            </Modal.Title>
            {closeButtonColor}
          </Modal.Header>
          <Modal.Body>
<div className="cardTitle">
           <h5>{this.props.selectedItem.name}</h5> 
           <ButtonGroup aria-label="Basic example">
            {this.state.itemQuantity === 0 ? 
            <Button  className="ButtonFontBigger" variant="primary"
       disabled >
        <b> - </b></Button> 
        :
        <Button  className="ButtonFontBigger" variant="primary"
        onClick={()=> this.handleQuantityClick(-1)}>
         <b> - </b></Button>}
      

      <Button  variant="primary"><b>{this.state.itemQuantity}</b></Button>

      <Button  className="ButtonFontBigger" variant="primary"
      onClick={()=> this.handleQuantityClick(1)}
      ><b>+</b></Button>
    </ButtonGroup>
           </div>
<p></p>
           <p>{this.props.selectedItem.description}</p>

           {this.state.itemQuantity > 0 ? 
           <h5 className="PriceRight"><b>{this.handleDenomDisplay(this.props.selectedItem.price)}</b></h5>
          :
          <p></p>
          }
          
              {this.state.itemQuantity > 0 ? (
                <Button variant="primary" 
                onClick={()=>this.handleSubmitClick()}>
                  <b>Add to cart</b>
                </Button>
              ) : (
                <Button  disabled variant="primary">
                <b>Add to cart</b>
              </Button>
              )}
               

            
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default AddItemToCartModal;
