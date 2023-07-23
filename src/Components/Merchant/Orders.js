import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Badge from "react-bootstrap/Badge";

const Dash = require("dash");

const {
  Essentials: { Buffer },
  PlatformProtocol: { Identifier },
} = Dash;

class Orders extends React.Component {

  handleName = (msgDoc) =>{
    if(msgDoc.$ownerId === this.props.identity){
    return this.props.uniqueName
    }
    if(!this.props.LoadingOrders){
      let nameDoc = this.props.DGPOrdersNames.find(doc => {
        return msgDoc.$ownerId === doc.$ownerId
      })

      return nameDoc.label
    }

    return 'None Found'
  }

  getRelativeTimeAgo(messageTime, timeNow){

    //timeStamp: 2546075019551 - Date.now(),

    //How do I make he adjustments....
    //So the messageTime is the time Stamp
    // So messageTime = 2546075019551 - Time of message
    //So I want Time of message
    //There4 TOM = 2546075019551 - timeStamp -> okay

    let timeOfMessage = 2546075019551 - messageTime;

    let timeDifference = timeNow - timeOfMessage;
  
    if(timeDifference >= 84600000){
      let longFormDate = new Date();
       longFormDate.setTime(timeOfMessage);
      return longFormDate.toLocaleDateString();
    }
    
    /*
    Calculate milliseconds in a year
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const year = day * 365;
    */
  
    if(timeDifference < 15000){
      return "Just now"
    }else if(timeDifference <44000){
      return "A few moments ago"
    }else if(timeDifference <90000){
      return "1 minute ago"
    }else if(timeDifference <150000){
      return "2 minutes ago"
    }else if(timeDifference <210000){
      return "3 minutes ago"
    }else if(timeDifference <270000){
      return "4 minutes ago"
    }else if(timeDifference <330000){
      return "5 minutes ago"
    }else if(timeDifference <390000){
      return "6 minutes ago"
    }else if(timeDifference <450000){
      return "7 minutes ago"
    }else if(timeDifference <510000){
      return "8 minutes ago"  
    }else if(timeDifference <570000){
      return "9 minutes ago"  
    }else if(timeDifference <660000){
      return "10 minutes ago"
    }else if(timeDifference <840000){
      return "12 minutes ago"
    }else if(timeDifference <1020000){
      return "15 minutes ago"
    }else if(timeDifference <1140000){
      return "18 minutes ago"
    }else if(timeDifference <1380000){
      return "20 minutes ago"
    }else if(timeDifference <1650000){
      return "25 minutes ago"
    }else if(timeDifference <1950000){
      return "30 minutes ago"
    }else if(timeDifference <2250000){
      return "35 minutes ago"
    }else if(timeDifference <2550000){
      return "40 minutes ago"
    }else if(timeDifference <3000000){
      return "45 minutes ago"
    }else if(timeDifference <5400000){
      return "1 hour ago"
    }else if(timeDifference <9000000){
      return "2 hours ago"
    }else if(timeDifference <12600000){
      return "3 hours ago"
    }else if(timeDifference <18000000){
      return "5 hours ago"
    }else if(timeDifference <43200000){
      return "Many hours ago"
    }else if(timeDifference <84600000){
      return "About a day ago"
    }
  }

  handleDenomDisplay = (duffs, qty) => {
    if(duffs >= 1000000){
      return <span style={{ color: "#008de4" }}>{(duffs * qty/100000000).toFixed(3)} Dash</span>
    } else {
      return <span style={{ color: "#008de4" }}>{(duffs * qty/100000).toFixed(2)} mDash</span>
    }
  }

  handleTotalItems = (items) => {
    
    let numOfItems =0;
      items.forEach((tuple)=> {
         
        numOfItems += tuple[1];
      });

      return <span>{numOfItems} {numOfItems>1?<span>items</span>:<span>item</span>}</span>
  }

  handleTotal = (items) => {
    
    let theTotal = 0;
    
      items.forEach((tuple)=> {

        theTotal += tuple[1] * tuple[0].price;
        //console.log(theTotal);
      });



      if(theTotal >= 1000000){

        theTotal = Math.round(theTotal/100000);

        return <h4 className="indentMembers" style={{ color: "#008de4" }}><b>{(theTotal/1000).toFixed(3)} Dash</b></h4>
      } else {

        theTotal = Math.round(theTotal/1000);

        return <h4 className="indentMembers" style={{ color: "#008de4" }}><b>{(theTotal/100).toFixed(2)} mDash</b></h4>
      }

  }

  verifyPayment = (theItems, theOrder) => { 
  //  console.log('An Order: ', theOrder);

// 1) make sure the createdAt and Updated AT are the same else there was an edit so it
    if(theOrder.$createdAt !== theOrder.$updatedAt ){
      return <Badge bg="danger">Fail</Badge>;
    }

  //8) DID i handle the Self Pay ro Self Order?? -> if toId and OwnerId of order match
  if(theOrder.toId === theOrder.$ownerId ){
    return <Badge bg="warning">Self Order</Badge>;
  }


// 2)Check for duplicated do a count on the order.txIds for all the orders

    let numOfOrdersWithTxId = this.props.DGPOrders.filter(order => {
      return order.txId === theOrder.txId
    })
    if(numOfOrdersWithTxId.length !==1){
      return <Badge bg="danger">Fail</Badge>;
    }

//3) Make sure there is a wallet TX that matches order txId

let walletTx = this.props.accountHistory.find(tx =>{
  //console.log('Wallet TX: ', tx);
  return tx.txId === theOrder.txId;
})
if(walletTx === undefined){
  return <Badge bg="danger">Fail</Badge>;
} 

// 4) check that the order createAT and tx time are within a few minutes

let walletTxTime = new Date(walletTx.time);
//console.log('Wallet TX Time valueOf: ', walletTxTime.valueOf());

if((walletTxTime.valueOf() - theOrder.$createdAt) > 350000 ){
  //console.log(walletTxTime.valueOf() - theOrder.$createdAt)
  return <Badge bg="danger">Fail</Badge>;
} 


//5) make sure the tx amt === order amt otherwise check if any items $updateAt changed more recently
      
        let theTotal = 0;
          theItems.forEach((tuple)=> {
        theTotal += tuple[1] * tuple[0].price;
        //console.log(theTotal);
      });

        if(theTotal === walletTx.satoshisBalanceImpact){
        return <Badge bg="primary">Paid</Badge>;
        }else{

          theItems.forEach(tuple => {
            if(tuple[0].$updatedAt > theOrder.$createdAt){
              return <Badge bg="warning">Old Price</Badge>;
            }
          });

          return <Badge bg="danger">Fail</Badge>;;         
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

    let d = Date.now()
    
//##################################################################

//##################################################################


    let ordersForDisplay = [];

    if(!this.props.isLoadingWallet &&
      !this.props.LoadingStore &&
      !this.props.LoadingItems &&
      !this.props.LoadingOrders &&
      this.props.DGPStore !== 'No Store' &&
      this.props.DGPOrders !== 'No Orders'){

        //console.log('Tx History', this.props.accountHistory);

    ordersForDisplay = this.props.DGPOrders.map(
      (order, index) => { 

        //console.log(order);
        let orderNameDoc = this.props.DGPOrdersNames.find((doc)=>{
          return doc.$ownerId === order.$ownerId;
        });

        let orderMsgDocs = this.props.DGPOrdersMsgs.filter((doc)=>{
          return doc.orderId === order.$id;
        });

        orderMsgDocs.reverse() //To put in the right order

        let msgsToDisplay = []; 

        if(orderMsgDocs.length > 0){

          msgsToDisplay = orderMsgDocs.map((msg, index )=>{
           // console.log('Order Msg:', msg);
            return(
                <Card id="comment" key={index} bg={cardBkg} text={cardText}>
              <Card.Body>
                <Card.Title className="cardTitle">
                <b style={{ color: "#008de4" }}>{this.handleName(msg)}</b>
                <span 
                   className="textsmaller"
                  >
                    {this.getRelativeTimeAgo(msg.timeStamp, d)}
                  </span>
                  </Card.Title>
                  <Card.Text>
                  {msg.msg}
                </Card.Text>
              </Card.Body>
            </Card>
            )
          });
        }

        let orderItemsAndQty = order.cart.map(tuple => {
           let itemDoc = this.props.DGPItems.find(item => {

            //console.log('TEST: ', Identifier.from(tuple[0], 'base64').toJSON());

            return item.$id === Identifier.from(tuple[0], 'base64').toJSON(); //Identifier.from()
           })
          return [itemDoc, tuple[1]]
        });

       // console.log('Order Items and Qty:', orderItemsAndQty);

        let orderItems = orderItemsAndQty.map((item, index)=>{
          return <Row key={index}>
          <Col xs={6} md={4}><h5>{item[0].name}</h5> </Col>
          <Col xs={1} md={4}><h5>{item[1]}</h5> </Col>
          <Col xs={5} md={4}><h5><b>{this.handleDenomDisplay(item[0].price, item[1])}</b></h5></Col>
          </Row>
    
          //  return <div key={index} className="cardTitle">
          // <h5>{item[0].name}</h5> 
          // <h5>{item[1]}</h5> 
          // <h5><b>{this.handleDenomDisplay(item[0].price, item[1])}</b></h5> 
          // </div>
    
        });

        //I can use this for display and to check against the wallet tx for accurate payment
        
        // this one is filter also ithink -> yeah!!
        //Do I even need to do this, why don't i just use my merchant items.
        //unless this is the actualthing i will display. so like this is the thing that gets from the order.cart
/**
 * indices: [      
        {
          name: 'orderIdandtimeStamp',
          properties: [{ orderId: 'asc' }, { timeStamp: 'asc' }],
          unique: false,
        }

        wHAT IF THESE MESSAGES COULD SOMEHOW BE USED AS REVIEWS ? 
 */ 

        //let orderMsgs = this.props.DGPOrderMsgs.filter((doc)=>{
         // return doc.orderId === order.$id;


        //This may be changed from original becuase i think i just want to query by the txId or orderId??

        return (

    <Card id="card" key={index} bg={cardBkg} text={cardText}>
        <Card.Body>
          <Card.Title className="cardTitleUnderlineBelow">

            <h2
              style={{ color: "#008de4" }}
             ><b>{orderNameDoc.label}</b>
              
              </h2>
              
                {this.verifyPayment(orderItemsAndQty, order)}
              
            
            {/* {this.props.uniqueName === this.props.tuple[0] ? (
              <span style={{ color: "#008de4" }}>{this.props.tuple[0]}</span>
            ) : (
              <span >{this.props.tuple[0]}</span>
            )} //This is like a comment thing*/}


            <span 
            // className="textsmaller"
            >
              {this.getRelativeTimeAgo(order.timeStamp, d)}
            </span>
          </Card.Title>

          <Row>
          <Col xs={1} md={1}> </Col>
      <Col xs={4} md={4}><h5>Item</h5> </Col>
      <Col  xs={2} md={2}><h5>Qty</h5> </Col>
      <Col xs={4} md={4}><h5>Subtotal</h5> </Col>
      <Col xs={1} md={1}></Col>
      </Row>
          <Container>
            {orderItems}
       </Container>

       <p></p>
                    <div className='Underline' >
                      <h4><b>Total</b> ({this.handleTotalItems(orderItemsAndQty)})<b>:</b></h4>
                      
                      {this.handleTotal(orderItemsAndQty)}
                    </div> 
            <p></p>
          <div className='cardTitleUnderlineAbove' >
          <h5>Order Messages</h5>
          </div>

          {order.comment !== undefined ? 
          <>
          

          <Card id="comment" bg={cardBkg} text={cardText}>
        <Card.Body>
          <Card.Title className="cardTitle">
          <b style={{ color: "#008de4" }}>{orderNameDoc.label}</b>
          <span 
             className="textsmaller"
            >
              {this.getRelativeTimeAgo(order.timeStamp, d)}
            </span>
            </Card.Title>
            <Card.Text>
            {order.comment}
          </Card.Text>
        </Card.Body>
      </Card>
    
            </>
          :<></>}

{msgsToDisplay}

<div className="ButtonRightNoUnderline">
      <Button variant="primary"
      onClick={()=>this.props.handleMerchantOrderMsgModalShow(order.$id,orderNameDoc.label)}
      ><b>Add Message</b></Button>
          </div>
          
          <Card.Text>
          </Card.Text>
        </Card.Body>
      </Card>
      )}
      );
            } //This closes the if statement
   


    //##################################################################

    //##################################################################

    

    return (
      <> 





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
                  
                  
                </>
               : 
                <><div className="paddingBadge">
                <b>Dash Balance</b>
                  <div className="cardTitle">
                    <h4>
                      <b>{this.handleDenomDisplay(this.props.accountBalance,1)}</b>
                    </h4>
                    <Button
                    variant="primary" 
                    onClick={()=>this.props.showModal('WalletTXModal')}
                    >Wallet Transactions</Button>
                    </div>
                    </div>
                  
                  
                </>
              }

{this.props.DGPStore === 'No Store' && !this.props.LoadingStore && !this.props.LoadingOrders ?

<div className="d-grid gap-2" id="button-edge">
          <Button
            variant="primary"
            onClick={() => {
                      this.props.showModal('CreateStoreModal');
                    }}
          >
            <b>Create New Store/Menu</b>
          </Button>
        </div>
        :
        <></>
}


{this.props.DGPStore !== "No Store" && !this.props.LoadingStore  && !this.props.LoadingOrders ? (
          <>
          <div id='card' >
          <h2>{this.props.uniqueName} Orders</h2>
          </div>
          </>
):
<></>
}

{!this.props.isLoadingWallet &&
 !this.props.LoadingOrders && this.props.newOrderAvail ?

<div className="d-grid gap-2" id="button-edge">
          <Button
            variant="primary"
            onClick={() => {
                      this.props.handleLoadNewOrder(); 
                    }}
          >
            <b>Load New Order</b>
          </Button>
        </div>
        :
        <></>
}

{this.props.LoadingOrders || this.props.isLoadingWallet || this.props.LoadingStore ? (
              <>
                <p></p>
                <div id="spinner">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              </>
            ) : (
              <></>
            )}

            {!this.props.LoadingOrders && !this.props.LoadingStore && this.props.DGPStore !== "No Store" && this.props.DGMAddress !== 'No Address' && this.props.DGPOrders === 'No Orders' ?
            <p>This is where orders from your customers will appear.</p>:
            <></>}



{!this.props.isLoadingWallet &&
!this.props.LoadingStore &&
!this.props.LoadingItems &&
!this.props.LoadingOrders &&
this.props.DGPStore !== 'No Store' &&
this.props.DGPOrders !== 'No Orders' ?
<><div id="cardtext" className="footer">
          
          {ordersForDisplay}
        
    </div></>:<></>
   

        }
      
        
      </>
    );
  }
}

export default Orders;
