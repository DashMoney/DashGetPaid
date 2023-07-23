import React from "react";
import Card from "react-bootstrap/Card";

class RecentOrdersDisplayComponent extends React.Component {

/**
 *    recentOrders={this.props.recentOrders} 
      recentOrdersStores={this.props.recentOrdersStores}
      recentOrdersNames={this.props.recentOrdersNames}
      recentOrdersDGMAddresses={this.props.recentOrdersDGMAddresses}
 */

  handleOpen = (theStoreDoc) => {
    if(theStoreDoc.open){
      return <span style={{ color: "#008de4" }}>Open</span>
    } else {
      return <span style={{ color: "#008de4" }}>Closed</span>
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

    let orderNameDoc = this.props.recentOrdersNames.find((doc)=>{
      return doc.$ownerId === this.props.orderToId;
    });

    let orderStoreDoc = this.props.recentOrdersStores.find((doc)=>{
      return doc.$ownerId === this.props.orderToId;
    });

    let orderDGMDoc = this.props.recentOrdersDGMAddresses.find((doc)=>{
      return doc.$ownerId === this.props.orderToId;
    });

    return (
      <>
      {orderDGMDoc === undefined ?
      <></>
      :
      <Card id="card" key={this.props.index} bg={cardBkg} text={cardText}
      onClick={()=>this.props.handleSelectRecentOrActive(this.props.orderToId, orderNameDoc.label, orderStoreDoc, orderDGMDoc)}>
        <Card.Body>
          <Card.Title className="cardTitle">
            <span>{orderNameDoc.label}</span>
            {this.handleOpen(orderStoreDoc)}

          </Card.Title>

          <Card.Text>{orderStoreDoc.description}</Card.Text>
          {/* <Button variant="primary"
           
             
          >Go to Store/Menu
          </Button> */}
        </Card.Body>
      </Card>
        }
        </>
    );
  }
}

export default RecentOrdersDisplayComponent;
