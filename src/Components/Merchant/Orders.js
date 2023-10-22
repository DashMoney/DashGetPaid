import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Badge from "react-bootstrap/Badge";

const Dash = require("dash");

// const {
//   Essentials: { Buffer },
//   PlatformProtocol: { Identifier },
// } = Dash;

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
      return "A few moments ago"
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
      console.log('Failed on Error 0');
      return <Badge bg="danger">Fail</Badge>;
    }

  //8) DID i handle the Self Pay or Self Order?? -> if toId and OwnerId of order match
  if(theOrder.toId === theOrder.$ownerId ){
    return <Badge bg="warning">Self Order</Badge>;
  }


// 2)Check for duplicated do a count on the order.txIds for all the orders

    let numOfOrdersWithTxId = this.props.DGPOrders.filter(order => {
      return order.txId === theOrder.txId
    })
    if(numOfOrdersWithTxId.length !==1){
      console.log('Failed on Error 1');
      return <Badge bg="danger">Fail</Badge>;
    }

//3) Make sure there is a wallet TX that matches order txId

let walletTx = this.props.accountHistory.find(tx =>{
  //console.log('Wallet TX: ', tx);
  return tx.txId === theOrder.txId;
})
if(walletTx === undefined){ 
  //This may be the issue that cause early fail ->
  // Can I check instasend?
  console.log('Failed on Error 2');
  return <Badge bg="danger">Fail</Badge>;
} 
//ADDED TO CHECK BC TIME DEFAULTS TO FUTURE IF NO INSTALOCK 9999999999000
//CURRENTLY THE INSTASEND LOCK IS NOT WORKING ON TESTNET
// if(!walletTx.isInstantLocked  ){
//   return <Badge bg="warning">Verifying..</Badge>;
// }
//

// 4) check that the order createAT and tx time are within a few minutes

let walletTxTime = new Date(walletTx.time);
//console.log('Wallet TX Time valueOf: ', walletTxTime.valueOf());

if((walletTxTime.valueOf() - theOrder.$createdAt) > 350000 ){

//***This is added due to testnet lack of instasend lock */
  if(walletTxTime.valueOf() > theOrder.$createdAt){
    return <Badge bg="primary">Paid</Badge>;
  }



  //console.log(walletTxTime.valueOf() - theOrder.$createdAt)
  console.log('Failed on Error 3'); //!!!!!!!!!!!!
  console.log(this.props.accountHistory);
  console.log(walletTxTime.valueOf());
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
          console.log('Failed on Error 4');
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

        let orderItemsAndQty = order.cart.map(tuple => {
           let itemDoc = this.props.DGPItems.find(item => {

            
            return item.$id === tuple[0];
            
           })
          return [itemDoc, tuple[1]]
        });

       // console.log('Order Items and Qty:', orderItemsAndQty);

        let orderItems = orderItemsAndQty.map((item, index)=>{

          //className="cardTitle"

          return <div className="cardTitle" key={index}>
          <b>{item[0].name}</b> 
          <b>{item[1]}</b> 
          <b>{this.handleDenomDisplay(item[0].price, item[1])}</b>
          </div>

        // return <Row key={index}>
        //   <Col xs={5} md={4}><b>{item[0].name}</b> </Col>
        //   <Col xs={1} md={4}><b>{item[1]}</b> </Col>
        //   <Col xs={5} md={4}><b>{this.handleDenomDisplay(item[0].price, item[1])}</b></Col>
        //   </Row>
    
          //  return <div key={index} className="cardTitle">
          // <h5>{item[0].name}</h5> 
          // <h5>{item[1]}</h5> 
          // <h5><b>{this.handleDenomDisplay(item[0].price, item[1])}</b></h5> 
          // </div>
    
        });

        
/**
 * indices: [      
        {
          name: 'orderIdandcreatedAt',
          properties: [{ orderId: 'asc' }, { $createdAt: 'asc' }],
          unique: false,
        }

 */ 

        //let orderMsgs = this.props.DGPOrderMsgs.filter((doc)=>{
         // return doc.orderId === order.$id;


        return (

    <Card id="card" key={index} bg={cardBkg} text={cardText}>
        <Card.Body>
          <Card.Title className="cardTitleUnderlineBelow">

            <h5
              style={{ color: "#008de4" }}
             ><b>{orderNameDoc.label}</b>
              
              </h5>
              
                {this.verifyPayment(orderItemsAndQty, order)}
              
            
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
          <Col xs={1} md={1}></Col> 
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
          <b style={{ color: "#008de4" }}>{orderNameDoc.label}</b>
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
                <b>Wallet Balance</b>
                  
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
          <p></p>
          <div id='card'>
          <h2>{this.props.uniqueName}'s Orders</h2>
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
            <>
            <p></p>
            <p>This is where orders from your customers will appear.</p>
            </>:
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
