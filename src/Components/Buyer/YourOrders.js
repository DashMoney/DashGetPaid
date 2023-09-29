import React from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

const Dash = require("dash");

const {
 // Essentials: { Buffer },
  PlatformProtocol: { Identifier },
} = Dash;

class YourOrders extends React.Component {

  handleName = (msgDoc) =>{
    if(msgDoc.$ownerId === this.props.identity){
    return this.props.uniqueName
    }
    if(!this.props.isLoadingRecentOrders){
      let nameDoc = this.props.recentOrdersNames.find(doc => {
        return msgDoc.$ownerId === doc.$ownerId
      })

      //The issue is if your first order is a self order..
      if(nameDoc === undefined){
        return 'Not Found'
      }
      return nameDoc.label
    }

    return 'None Found'
  }
   
  getRelativeTimeAgo(messageTime, timeNow){

    let timeDifference = timeNow - messageTime;
  
    if(timeDifference >= 84600000){
      let longFormDate = new Date();
       longFormDate.setTime(messageTime);
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
      return "Few moments ago"
    }else if(timeDifference <90000){
      return "1 min ago"
    }else if(timeDifference <150000){
      return "2 min ago"
    }else if(timeDifference <210000){
      return "3 min ago"
    }else if(timeDifference <270000){
      return "4 min ago"
    }else if(timeDifference <330000){
      return "5 min ago"
    }else if(timeDifference <390000){
      return "6 min ago"
    }else if(timeDifference <450000){
      return "7 min ago"
    }else if(timeDifference <510000){
      return "8 min ago"  
    }else if(timeDifference <570000){
      return "9 min ago"  
    }else if(timeDifference <660000){
      return "10 min ago"
    }else if(timeDifference <840000){
      return "12 min ago"
    }else if(timeDifference <1020000){
      return "15 min ago"
    }else if(timeDifference <1140000){
      return "18 min ago"
    }else if(timeDifference <1380000){
      return "20 min ago"
    }else if(timeDifference <1650000){
      return "25 min ago"
    }else if(timeDifference <1950000){
      return "30 min ago"
    }else if(timeDifference <2250000){
      return "35 min ago"
    }else if(timeDifference <2550000){
      return "40 min ago"
    }else if(timeDifference <3000000){
      return "45 min ago"
    }else if(timeDifference <5400000){
      return "1 hr ago"
    }else if(timeDifference <9000000){
      return "2 hrs ago"
    }else if(timeDifference <12600000){
      return "3 hrs ago"
    }else if(timeDifference <18000000){
      return "5 hrs ago"
    }else if(timeDifference <43200000){
      return "Many hrs ago"
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
        // this.props.merchantItems.find((item)=>{
        //   return item.$id === tuple[0].$id
        // })  
        numOfItems += tuple[1];
      });

      return <span>{numOfItems} {numOfItems>1?<span>items</span>:<span>item</span>}</span>
  }

  handleTotal = (items) => {
    //this.prop.cartItems AND this.props.merchantItems
    let theTotal = 0;
    
      items.forEach((tuple)=> {
        // this.props.merchantItems.find((item)=>{
        //   return item.$id === tuple[0].$id
        // })  //THE PRICE IS ALREADY IN THE ITEM!!! bUT MAYBE i CAN USE THIS TO CHECK THE ITEM IS FOR THE MERCHANT!!!

        //console.log(tuple[0].price);
       // console.log(tuple[1])

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

  render() {

    let d = Date.now()

    let cardBkg;
    let cardText;

    if (this.props.mode === "primary") {
      cardBkg = "white";
      cardText = "dark";

    } else {
      cardBkg = "dark";
      cardText = "white";
    }
    /**
     * recentOrders={this.props.recentOrders} 
      recentOrdersStores={this.props.recentOrdersStores}
      recentOrdersNames={this.props.recentOrdersNames}
      recentOrdersDGMAddresses={this.props.recentOrdersDGMAddresses}
      recentOrdersItems={this.props.recentOrdersItems}
      recentOrdersMessages={this.props.recentOrdersMessages}
     */

    let ordersForDisplay = [];

    if(!this.props.isLoadingRecentOrders){

        //console.log('Tx History', this.props.accountHistory);

    ordersForDisplay = this.props.recentOrders.map(
      (order, index) => { 

        //console.log(order);

        let orderNameDoc = this.props.recentOrdersNames.find((doc)=>{
          return doc.$ownerId === order.toId;
        });

//NEW THING BELOW -> ADDING MSGS TO ORDERS
        let orderMsgDocs = this.props.recentOrdersMessages.filter((doc)=>{
          return doc.orderId === order.$id;
        });

        let msgsToDisplay = []; 

        if(orderMsgDocs.length > 0){

          msgsToDisplay = orderMsgDocs.map((msg, index )=>{
            return(
                <Card id="comment" key={index} bg={cardBkg} text={cardText}>
              <Card.Body>
                <Card.Title className="cardTitle">
                <b style={{ color: "#008de4" }}>{this.handleName(msg)}</b>
                <span 
                   className="textsmaller"
                  >
                    {this.getRelativeTimeAgo(msg.$createdAt, d)}
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
        
//END OF NEW THING
        //console.log('Order Name Doc:',orderNameDoc);

        let orderItemsAndQty = order.cart.map(tuple => {
           let itemDoc = this.props.recentOrdersItems.find(item => {

            //console.log('TEST: ', Identifier.from(tuple[0], 'base64').toJSON());

            return item.$id === Identifier.from(tuple[0], 'base64').toJSON(); //Identifier.from()
           })
          return [itemDoc, tuple[1]]
        });

       // console.log('Order Items and Qty:', orderItemsAndQty);

        let orderItems = orderItemsAndQty.map((item, index)=>{

          return <div className="cardTitle" key={index}>
          <b>{item[0].name}</b> 
          <b>{item[1]}</b> 
          <b>{this.handleDenomDisplay(item[0].price, item[1])}</b>
          </div>

          // return <Row key={index}>
          // <Col xs={6} md={4}><h5>{item[0].name}</h5> </Col>
          // <Col xs={1} md={4}><h5>{item[1]}</h5> </Col>
          // <Col xs={5} md={4}><h5><b>{this.handleDenomDisplay(item[0].price, item[1])}</b></h5></Col>
          // </Row>
    
        });

        return (

          <Card id="card" key={index} bg={cardBkg} text={cardText}>
              <Card.Body>
                <Card.Title className="cardTitleUnderlineBelow">
      
                  <h5
                    // style={{ color: "#008de4" }}
                   ><b>{orderNameDoc.label}</b>
                    
                    </h5>
                    
                      {/* {this.verifyPayment(orderItemsAndQty, order)} */}
                    
                  
                  {/* {this.props.uniqueName === this.props.tuple[0] ? (
                    <span style={{ color: "#008de4" }}>{this.props.tuple[0]}</span>
                  ) : (
                    <span >{this.props.tuple[0]}</span>
                  )} //This is like a comment thing*/}
      
      
                  <span 
                   className="textsmaller"
                  >
                    {this.getRelativeTimeAgo(order.$createdAt, d)}
                  </span>
                </Card.Title>
      
                <Row>
                <Col xs={1} md={1}> </Col>
            <Col xs={4} md={4}><b>Item</b> </Col>
            <Col  xs={3} md={3}><b>Qty</b> </Col>
            <Col xs={4} md={4}><b>Subtotal</b> </Col>
            
            </Row>
                <Container>
                  {orderItems}
             </Container>
      
             <p></p>
                          <div className='Underline' >
                            <h5><b>Total</b> ({this.handleTotalItems(orderItemsAndQty)})<b>:</b></h5>
                            
                            {this.handleTotal(orderItemsAndQty)}
                          </div> 
                  <p></p>
                <div className='cardTitleUnderlineAbove' >
                <h6>Order Messages</h6>
                </div>
      
                {order.comment !== undefined ? 
                <>
                
      
                <Card id="comment" bg={cardBkg} text={cardText}>
              <Card.Body>
                <Card.Title className="cardTitle">
                <b style={{ color: "#008de4" }}>{this.props.uniqueName}</b>
                <span 
                   className="textsmaller"
                  >
                    {this.getRelativeTimeAgo(order.$createdAt, d)}
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
            onClick={()=>this.props.handleOrderMessageModalShow(order.$id,orderNameDoc.label)}
            ><b>Add Message</b></Button>
                </div>
                
                <Card.Text>
                </Card.Text>
              </Card.Body>
            </Card>
            )}
            );
                  } //This closes the if statement
         
    //THE ABOVE IS ALL THE PER ORDER CREATION  

    return (
      <> 
       {this.props.identityInfo === "" ||
        this.props.identityInfo.balance >= 1000000000 ? (
          <div className="id-line">
            <h5>
              <Badge className="paddingBadge" bg="primary">
                Your Platform Credits
              </Badge>
            </h5>

            {this.props.identityInfo === "" ? (
              <h5>
                <Badge className="paddingBadge" bg="primary" pill>
                  Loading..
                </Badge>
              </h5>
            ) : (
              <h5>
                <Badge className="paddingBadge" bg="primary" pill>
                  {this.props.identityInfo.balance}
                </Badge>
              </h5>
            )}
          </div>
        ) : (
          <></>
        )}
        

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
 

      {this.props.isLoadingRecentOrders
      //  && !this.props.isLoadingWallet 
       ? (
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

           {this.props.recentOrders.length < 1?
           <><p className="paddingBadge">
            The orders, you have placed, will appear here after they are sent.
            </p></>:
           <></>} 

            
      
            {!this.props.isLoadingRecentOrders?
<><div id="cardtext" className="footer">
          
          {ordersForDisplay}
    </div></>
    :
    <></>
        }
      </>
    );
  }
}

export default YourOrders;
