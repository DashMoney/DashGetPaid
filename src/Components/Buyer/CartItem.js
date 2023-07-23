import React from "react";
import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";

class CartItem extends React.Component {

  handleDenomDisplay = (duffs) => {
    if(duffs >= 1000000){
      return <span style={{ color: "#008de4" }}>{(duffs * this.props.item[1]/100000000).toFixed(3)} Dash</span>
    } else {
      return <span style={{ color: "#008de4" }}>{(duffs * this.props.item[1]/100000).toFixed(2)} mDash</span>
    }
  }


  render() {
    let cardBkg;
    let cardText;

    if (this.props.mode === "primary") {
      cardBkg = "white";
      cardText = "dark";

    } else {
      cardBkg = "dark";
      cardText = "white";
    }

    return (
      <Card id="card" key={this.props.index} bg={cardBkg} text={cardText}>
        <Card.Body>
          <Card.Title className="cardTitle">
          
            <span>{this.props.item[0].name}</span>
              <span>
                Qty:<span> </span><b> {this.props.item[1]}</b></span>
              

          </Card.Title>

          {/* <Card.Text>{this.props.item.description}</Card.Text> */}
          <p></p>
          <div className="cardTitle">
          <Button variant="primary"
             onClick={()=> this.props.handleEditItemModal(this.props.index)}
             
          >Edit Item
          </Button>
          <h4><b>{this.handleDenomDisplay(this.props.item[0].price)}</b></h4>
          </div>
        </Card.Body>
      </Card>
    );
  }
}

export default CartItem;
