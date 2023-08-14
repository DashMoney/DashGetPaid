import React from "react";
//import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
//import Form from "react-bootstrap/Form";

import MerchantItem from "./MerchantItem";
import CartItem from "./CartItem";
import RecentOrdersDisplayComponent from "./RecentOrdersDisplayComponent";
import ActiveOrdersDisplayComponent from "./ActiveOrdersDisplayComponent";


class FindMerchant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numOfItemsToDisplay: 0,
    };
  }
  handleTotalItems = () => {
    
    let numOfItems =0;
      this.props.cartItems.forEach((tuple)=> {
        // this.props.merchantItems.find((item)=>{
        //   return item.$id === tuple[0].$id
        // })  
        numOfItems += tuple[1];
      });

      return <span>{numOfItems} {numOfItems>1?<span>items</span>:<span>item</span>}</span>
  }

  handleTotal = () => {
    //this.prop.cartItems AND this.props.merchantItems
    let theTotal = 0;
    
      this.props.cartItems.forEach((tuple)=> {

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

    let items = this.props.merchantItems.map(
      (item, index) => {  
        //console.log(item);
        return (
          <MerchantItem
          handleAddToCartModal={this.props.handleAddToCartModal}
          key={index}
          mode={this.props.mode}
          index={index}
          item = {item}
          addToCart={this.props.addToCart}
          />
        )
      }
    );

    let cartItems = this.props.cartItems.map(
      (item, index) => {  
        //console.log(item);
        return (
          <CartItem
          handleEditItemModal={this.props.handleEditItemModal}
          key={index}
          mode={this.props.mode}
          index={index}
          item = {item}
          />
        )
      }
    );

let recentOrders = [];

    if(!this.props.isLoadingRecentOrders){

let arrayOfToIds = this.props.recentOrders.map((doc) => {
  return doc.toId;
});

let setOfToIds = [...new Set(arrayOfToIds)];

arrayOfToIds = [...setOfToIds];

     recentOrders = arrayOfToIds.map((orderToId, index)=>{
      return (
        <RecentOrdersDisplayComponent
               
      recentOrdersStores={this.props.recentOrdersStores}
      recentOrdersNames={this.props.recentOrdersNames}
      recentOrdersDGMAddresses={this.props.recentOrdersDGMAddresses}
      handleSelectRecentOrActive={this.props.handleSelectRecentOrActive}
      key={index}
          mode={this.props.mode}
          index={index}
          orderToId = {orderToId}
               />
      )
    });
  }

  let activeOrders = [];

    if(!this.props.isLoadingActive){

let arrayOfToIds = this.props.activeOrders.map((doc) => {
  return doc.toId;
});

let setOfToIds = [...new Set(arrayOfToIds)];

arrayOfToIds = [...setOfToIds];

     activeOrders = arrayOfToIds.map((orderToId, index)=>{
      return (
        <ActiveOrdersDisplayComponent
               
      activeOrdersStores={this.props.activeOrdersStores}
      activeOrdersNames={this.props.activeOrdersNames}
      activeOrdersAddresses={this.props.activeOrdersAddresses}
      handleSelectRecentOrActive={this.props.handleSelectRecentOrActive}
      key={index}
          mode={this.props.mode}
          index={index}
          orderToId = {orderToId}
               />
      )
    });
  }

    return (
      <>
      { this.props.LoadingOrder ? (
              <>
                <p></p>
                <div id="spinner">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              </>
            ) : (
              <>

        <div id="bodytextnotop">
          

{this.props.viewStore?
                    <>
                    <h2>Your Cart</h2>
                    {this.props.cartItems.length === 0?
                    <p>(Items you add to cart will appear here)</p>
                    :
                    <>{cartItems}
                    <p></p>
                    <div className="cartTotal">
                      <h4><b>Total</b> ({this.handleTotalItems()})<b>:</b></h4>
                      
                      {this.handleTotal()}
                    </div>
                    </>
                    }

                    {this.props.cartItems.length >0?
<>
                    <div className="ButtonRight">
                    <Button onClick={()=>this.props.showModal("PlaceOrderModal")}>
                      <b>Place Order</b>
                    </Button>
                    </div>
                    <p></p>
                    </>
:<></>}

                    </>
                    :
                    <>
                    
                    </>
                    }

          {this.props.merchantStore.length !== 0 &&
          this.props.merchantStore !== "No Store" ? (
            <>


              {this.props.merchantStore[0].open ? (
                <>
                  {this.props.dgmDocumentForMerchant.length !== 0 &&
                  this.props.dgmDocumentForMerchant !==
                    "No DGM Doc for Merchant." ? (
                    <>
                    {this.props.viewStore?
                    <>
                    
                    <h2 className="paddingTop">{this.props.merchantStoreName}</h2>
                    </>
                    :
                    <>
                    <h3 style={{ color: "#008de4" }}>{this.props.merchantStoreName}</h3>
              <p>{this.props.merchantStore[0].description}</p>
              <div className="ButtonRight">
                    <Button variant="primary"
                      onClick={()=>this.props.handleViewStore()}>
                        <b>View Store/Menu</b>
                      </Button>
                      </div>
                    </>
                    }
                      
                    </>
                  ) : (
                    <>
                    <h3 style={{ color: "#008de4" }}>{this.props.merchantStoreName}</h3>
              <p>{this.props.merchantStore[0].description}</p>
                      <Button variant="primary">
                        <b>Loading..</b>
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <>
                <h3 style={{ color: "#008de4" }}>{this.props.merchantStoreName}</h3>
              <p>{this.props.merchantStore[0].description}</p>
                  <Button variant="primary" disabled>
                    <b>Store Closed</b>
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
            </>
          )}

          {this.props.viewStore?
          <>
          {this.props.LoadingItems ? (
              <>
                <p></p>
                <div id="spinner">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              </>
            ) : (
              <>
              <div id="cardtext" className="footer">
            {items.length === 0?
              <>
              <p>This store has no items for purchase.</p>
              </>  
              :
              <>{items}</>
              }

              </div>
              </>
            )}

          
          </>
          :
          <>

          <p></p>
              <h3>Your Recent Orders</h3>
              
              {this.props.isLoadingRecentOrders ? (
              <>
                <p></p>
                <div id="spinner">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              </>
            ) : (
              <>
              {this.props.recentOrders.length === 0 &&
               !this.props.isLoadingRecentOrders?
              <>
              <p>Merchants, you have ordered from will appear here</p>
              </>
              :
              <>
              <div id="cardtext">
              {recentOrders}
              </div>
              </>
              }

              </>
            )}


              <p></p>
              <h3>Active Stores</h3>

              {this.props.isLoadingActive ? (
              <>
                <p></p>
                <div id="spinner">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              </>
            ) : (
              <>
              {this.props.activeOrders.length === 0?
              <>
              <p>Merchants with recent purchases will appear
                here to aid in finding new merchants</p>
              </>
              :
              <>
              <div id="cardtext">
              {activeOrders}
              </div>
              </>
              }
              </>
            )}


            

        </>
          }


        </div>

</>
)} {/* This is to close the LoadingOrder */}

      </>
    );
  }
}

export default FindMerchant;
