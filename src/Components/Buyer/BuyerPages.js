import React from "react";
import LocalForage from "localforage";

import Nav from "react-bootstrap/Nav";
import Badge from "react-bootstrap/Badge";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";

import FindMerchant from "./FindMerchant";
import YourOrders from "./YourOrders";

import AddItemToCartModal from "./BuyerModals/AddItemToCartModal";
import EditItemModal from "./BuyerModals/EditItemModal";
import PlaceOrderModal from "./BuyerModals/PlaceOrderModal";

import "./BuyerPages.css";

const Dash = require("dash");

const {
  Essentials: { Buffer },
  PlatformProtocol: { Identifier },
} = Dash;


class BuyerPages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      whichTab: "Find Merchant",
      presentModal: "",
      isModalShowing: false,

      LoadingOrder: false,

      LoadingMerchant: false,
      LoadingItems: false,

      identityIdMerchant: "",
      merchantStoreName: "staged name",
      merchantStore: [],
      dgmDocumentForMerchant: [],
      merchantItems: [],

      viewStore: false,

      cartItems: [],

      selectedItem: "", 

      selectedCartItemIndex: 0,

      merchantNameFormat: false,
      merchantName: "",

      sendPaymentSuccess: false,
      sendOrderSuccess: false,
      sendFailure: false,

      orderError: false,
    };
  }

  handleTab = (eventKey) => {
    if (eventKey === "Your Orders")
      this.setState({
        whichTab: "Your Orders",
      });
    else {
      this.setState({
        whichTab: "Find Merchant",
      });
    }
  };

  handleViewStore = () => {
    this.setState({
      viewStore: true,
    });
  };

  toggleViewStore = () => {
    this.setState({
      viewStore: false,
    });
  };
  

  hideModal = () => {
    this.setState({
      isModalShowing: false,
    });
  };

  showModal = (modalName) => {
    this.setState({
      presentModal: modalName,
      isModalShowing: true,
    });
  };

  handleAddToCartModal = (theItem) => {
    if(theItem.avail){
    this.setState(
      {
        selectedItem: theItem,
      },
      () => this.showModal("AddItemToCartModal")
    );
    }
  };

  handleEditItemModal = (theIndex) => {
    this.setState(
      {
        selectedCartItemIndex: theIndex,
      },
      () => this.showModal("EditItemModal")
    );
  };

  addToCart = (theQuantity) => {
    let cartObjects = this.state.cartItems.map((tuple) => {
      return tuple[0];
    });

    if (cartObjects.includes(this.state.selectedItem)) {
      this.state.cartItems.forEach((tuple, index) => {
        if (tuple[0] === this.state.selectedItem) {
          let newCartItems = this.state.cartItems;

          newCartItems.splice(index, 1, [tuple[0], tuple[1] + theQuantity]);

          this.setState(
            {
              cartItems: newCartItems,
            }
            ,()=>console.log(this.state.cartItems)
          );
        }
      });
    } else {
      this.setState({
        cartItems: [
          [this.state.selectedItem, theQuantity],
          ...this.state.cartItems,
        ],
      },()=>console.log(this.state.cartItems));
    }
  };

  editCart = (itemChange) => {
    
    if (itemChange === "remove from cart") {
      
      let newCartItems = this.state.cartItems;

      newCartItems.splice(this.state.selectedCartItemIndex, 1);

      this.setState({
        cartItems: newCartItems,
      });
    } else {
      let newCartItems = this.state.cartItems;

      newCartItems.splice(this.state.selectedCartItemIndex, 1, itemChange);

      this.setState({
        cartItems: newCartItems,
      });
    }
  };

//************* FIND MERCHANT HANDLING ************* */  

  handleSelectRecentOrActive = (
    storeIdentity,
    storeName,
    theStore,
    theDGMAddress
  ) => {
    if(theStore.open){
    this.setState(
      {
        identityIdMerchant: storeIdentity,
        merchantName: storeName,
        merchantStoreName: storeName,
        merchantStore: [theStore],
        dgmDocumentForMerchant: [theDGMAddress],
        viewStore: true,
        LoadingItems: true,
        cartItems:[],
      },() => this.getDGPItems(storeIdentity)
    );
    }
  };

  searchName = (nameToRetrieve) => {
    const client = new Dash.Client(this.props.whichNetwork);

    const retrieveName = async () => {
      // Retrieve by full name (e.g., myname.dash)

      return client.platform.names.resolve(`${nameToRetrieve}.dash`);
    };

    retrieveName()
      .then((d) => {
        if (d === null) {
          console.log("No DPNS Document for this Name.");
          this.setState({
            identityIdMerchant: "No Name",
            LoadingMerchant: false,
          });
        } else {
          let nameDoc = d.toJSON();
          //console.log("Name retrieved:\n", nameDoc.$ownerId);

          this.setState(
            {
              identityIdMerchant: nameDoc.$ownerId,
              merchantStoreName: nameDoc.label,
            },
            () => this.helperMerchantQueries(nameDoc.$ownerId)
          );
        }
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          identityIdMerchant: "Error",
          LoadingMerchant: false,
        });
      })
      .finally(() => client.disconnect());
  };

  helperMerchantQueries = (theIdentity) => {
    this.getDGPStore(theIdentity);
    this.queryDGMDocument(theIdentity);
    this.getDGPItems(theIdentity);
  };
 
  getDGPStore = (theIdentity) => {
    //Issue -> there should only be one possible return not a list ->
    const clientOpts = {
      network: this.props.whichNetwork,
      apps: {
        DGPContract: {
          contractId: this.props.DataContractDGP,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const getDocuments = async () => {
      console.log("Called Get DGP Store");

      return client.platform.documents.get("DGPContract.dgpstore", {
        where: [["$ownerId", "==", theIdentity]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];

        if (d.length === 0) {
          this.setState({
            merchantStore: "No Store",
          });
        } else {
          for (const n of d) {
            //console.log("Store:\n", n.toJSON());
            docArray = [...docArray, n.toJSON()];
          }
          this.setState({
            merchantStore: docArray,
            LoadingStore: false,
          });
        } //Ends the else
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          DGPStore: "Store Document Error",
          storeError: true,
          LoadingStore: false,
        });
      })
      .finally(() => client.disconnect()); 
  };

  queryDGMDocument = (theIdentity) => {
    const clientOpts = {
      network: this.props.whichNetwork,
      apps: {
        DGMContract: {
          contractId: this.props.DataContractDGM,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const getDocuments = async () => {
      console.log("Querying Merchant's DGM Documents.");
      //console.log(theIdentity);

      return client.platform.documents.get("DGMContract.dgmaddress", {
        where: [["$ownerId", "==", theIdentity]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];
        for (const n of d) {
         // console.log("DGM Address:\n", n.toJSON());
          docArray = [...docArray, n.toJSON()];
        }

        if (docArray.length === 0) {
          this.setState({
            dgmDocumentForMerchant: "No DGM Doc for Merchant.",
            LoadingMerchant: false,
          });
        } else {
          this.setState({
            dgmDocumentForMerchant: docArray,
            LoadingMerchant: false,
          });
        }
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          dgmDocumentForMerchant: "Document Error", // ADD alert to handle ->
          LoadingMerchant: false,
        });
      })
      .finally(() => client.disconnect());
  };

  getDGPItems = (theIdentity) => {
    if (!this.state.LoadingItems) {
      this.setState({
        LoadingItems: true,
      });
    }

    const clientOpts = {
      network: this.props.whichNetwork,
      apps: {
        DGPContract: {
          contractId: this.props.DataContractDGP,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const getDocuments = async () => {
      console.log("Called Get DGP Items");

      return client.platform.documents.get("DGPContract.dgpitem", {
        where: [["$ownerId", "==", theIdentity]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];

        for (const n of d) {
          //console.log("Item:\n", n.toJSON());
          docArray = [...docArray, n.toJSON()];
        }

        if (docArray.length === 0) {
          this.setState({
            LoadingItems: false,
          });
        } else {
          this.setState({
            merchantItems: docArray,
            LoadingItems: false,
          });
        } //Ends the else
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          itemError: true,
          LoadingItems: false,
        });
      })
      .finally(() => client.disconnect()); 
  };

  //************* PLACE ORDER HANDLING ************* */

  placeOrder = (orderComment) => {
    this.setState({
      LoadingOrder: true,
    });

    const client = new Dash.Client({
      network: this.props.whichNetwork,
      wallet: {
        mnemonic: this.props.mnemonic,
        adapter: LocalForage.createInstance,
        unsafeOptions: {
          skipSynchronizationBeforeHeight:
            this.props.skipSynchronizationBeforeHeight,
        },
      },
    });


    let theTotal = 0;
    this.state.cartItems.forEach((tuple) => {
      theTotal += tuple[1] * tuple[0].price;
    });

    const payToRecipient = async () => {
      const account = await client.getWalletAccount();

      console.log("sats sent in TX:", theTotal);
  

      const transaction = account.createTransaction({
        recipient: this.state.dgmDocumentForMerchant[0].address,
        satoshis: theTotal, //Must be a string!!
      });

      //return transaction;  //Use to disable TX <- !!!

      return account.broadcastTransaction(transaction);
    };

    payToRecipient()
      .then((d) => {
        console.log("Payment TX:\n", d);

        //this.submitDGPOrderDoc(d,orderComment);

        this.setState(
          {
            sendPaymentSuccess: true,
          },
          () => this.submitDGPOrderDoc(d, orderComment)
        );
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          LoadingOrder: false,
          sendFailure: true,
        });
      })
      .finally(() => client.disconnect()); 
  };

  submitDGPOrderDoc = (theTXid, theOrderComment) => {
  
    console.log("Called Submit DGP Order Doc");

    const clientOpts = {
      network: this.props.whichNetwork,
      wallet: {
        mnemonic: this.props.mnemonic,
        adapter: LocalForage.createInstance,
        unsafeOptions: {
          skipSynchronizationBeforeHeight:
            this.props.skipSynchronizationBeforeHeight,
        },
      },
      apps: {
        DGPContract: {
          contractId: this.props.DataContractDGP,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const submitNoteDocument = async () => {
      const { platform } = client;

      let identity = "";
      if (this.props.identityRaw !== "") {
        identity = this.props.identityRaw;
      } else {
        identity = await platform.identities.get(this.props.identity);
      } // Your identity ID

  
      let cartItemsForDocCreation = this.state.cartItems.map((tuple) => {
        return [Buffer.from(Identifier.from(tuple[0].$id)), tuple[1]];
        
      });

      console.log("cart items for doc creation", cartItemsForDocCreation);

      let docProperties;

      if (theOrderComment === "") {
        docProperties = {
          cart: cartItemsForDocCreation,
          toId: this.state.identityIdMerchant,
          txId: theTXid,
        };
      } else {
        docProperties = {
          comment: theOrderComment,
          cart: cartItemsForDocCreation,
          toId: this.state.identityIdMerchant,
          txId: theTXid,
        };
      }
      //console.log("docProperties", docProperties);

      // Create the note document
      const dgpDocument = await platform.documents.create(
        "DGPContract.dgporder", 
        identity,
        docProperties
      );

       console.log("dgpDocument JSON", dgpDocument.toJSON());

      //############################################################
      //This below disconnects the document sending..***

      //return dgpDocument;

      //This is to disconnect the Document Creation***
      //############################################################

      const documentBatch = {
        create: [dgpDocument], // Document(s) to create
      };

console.log(documentBatch);

      await platform.documents.broadcast(documentBatch, identity);
      return dgpDocument;

    };

    submitNoteDocument()
      .then((d) => {
        let returnedDoc = d.toJSON();
        console.log("Document:\n", returnedDoc);

        let order = {
          $ownerId: this.props.identity,
          $id: returnedDoc.$id,
          cart: returnedDoc.cart, //Identifier.from(returnedDoc.cart[0], 'base64').toJSON()
          comment: returnedDoc.comment,
          toId: returnedDoc.toId,
          txId: returnedDoc.txId,
          };

        let name ={
          $ownerId: this.state.identityIdMerchant,
          label: this.state.merchantStoreName,
        };


        this.props.handleAddingNewOrder(order, name, this.state.merchantStore[0], this.state.merchantItems, this.state.dgmDocumentForMerchant[0]);


        this.setState({
          viewStore: false,

          sendPaymentSuccess: false,
          sendOrderSuccess: true,

          LoadingOrder: false,

          identityIdMerchant: "",
          merchantStoreName: "staged name",
          merchantStore: [],
          dgmDocumentForMerchant: [],
          merchantItems: [],
          cartItems: [],
        });
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          orderError: "Order Error",
          LoadingOrder: false,
        });
      })
      .finally(() => client.disconnect());

// Added BELOW to go retrieve the wallet after purchase so the wallet balance will update. Trying to maximize the time for order document creation but also load wallet at the same time. ->
      this.props.getWalletForNewOrder();
  };

  //************* FORM HANDLING ************* */

  onChange = (event) => {
    // console.log(event.target.value);

    event.preventDefault();
    event.stopPropagation();

    this.setState({
      LoadingMerchant: false,
    });

    //console.log(`id = ${event.target.id}`);

    if (event.target.id === "validationCustomName") {
      this.nameValidate(event.target.value);
    }
  };

  nameValidate = (nameInput) => {
    let regex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]$/;
    let valid = regex.test(nameInput);

    if (valid) {
      this.setState({
        merchantName: nameInput,
        merchantNameFormat: true,
      });
    } else {
      this.setState({
        merchantName: nameInput,
        merchantNameFormat: false,
      });
    }
  };

  handleSubmitClick = (event) => {
    event.preventDefault();

    this.setState({
      LoadingMerchant: true,
      viewStore: false,
      //formEventTarget: event.target,

      identityIdMerchant: "",
      merchantStore: [],
      dgmDocumentForMerchant: [],
      merchantItems: [],
      cartItems: [],
    });

    this.searchName(this.state.merchantName);
  };

  componentDidMount = () => {
    
  };

  render() {
    return (
      <>
        {this.props.identity !== "No Identity" &&
        this.props.identity !== "Identity Error" &&
        this.props.uniqueName !== "Name Error" ? (
          <>
            <Nav
              fill
              variant="pills"
              defaultActiveKey={this.state.whichTab}
              onSelect={(eventKey) => this.handleTab(eventKey)}
            >
              <Nav.Item>
                <Nav.Link eventKey="Find Merchant">
                  <b>Find Merchant</b>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Your Orders">
                  <b>Your Orders</b>
                </Nav.Link>
              </Nav.Item>
            </Nav>

            {this.props.identityInfo === "" ||
            this.props.identityInfo.balance >= 1000000000 ? (
              <></>
            ) : (
              <div className="id-line"
              onClick={() => this.props.showModal("TopUpIdentityModal")}>
                <>
                  <h5>
                    <Badge className="paddingBadge" bg="danger">
                      Platform Credits : Low!
                    </Badge>
                  </h5>
                </>
                <>
                  <p></p>
                  <h5>
                    <Badge className="paddingBadge" bg="danger" pill>
                      {this.props.identityInfo.balance}
                    </Badge>
                  </h5>
                </>
              </div>
            )}

            {this.state.orderError ? (
              <>
                <p></p>
                <Alert variant="danger" dismissible>
                  <Alert.Heading>Order Failed</Alert.Heading>
                  <p>
                    You either have insufficient credits or have run into a
                    platform error. Please TopUp credits by tapping the credits
                    displayed.
                  </p>
                </Alert>
              </>
            ) : (
              <></>
            )}

            <div id="bodytext">
              {this.state.whichTab === "Find Merchant" ? (
                <>                
                  <Form
                    id="Find-Merchant-form"
                    noValidate
                    onSubmit={this.handleSubmitClick}
                    onChange={this.onChange}
                  >

                   <Form.Group
                      className="mb-3"
                      controlId="validationCustomName"
                    >
                      {/* <Form.Label>Merchant to Visit</Form.Label> */}
                      
                      {this.state.LoadingOrder ? (
                        <div className="cardTitle">
                        {this.state.viewStore ?
                          <span><Button variant='primary' 
                          onClick={()=>this.toggleViewStore()}
                          ><b>Back</b></Button></span>
                          :
                          <></>
                          }
                        <Form.Control
                          type="text"
                          placeholder={this.state.merchantName}
                          readOnly
                        />
                        </div>
                      ) : (
                        <div className="cardTitle">
                        {this.state.viewStore ?
                          <span><Button variant='primary' 
                          onClick={()=>this.toggleViewStore()}
                          ><b>Back</b></Button></span>
                          :
                          <></>
                          }
                        <Form.Control
                          type="text"
                          placeholder={
                            this.state.merchantStoreName === "staged name"
                              ? "Enter merchant name here..."
                              : this.state.merchantStoreName
                          }
                          required
                          isInvalid={!this.state.merchantNameFormat}
                          isValid={this.state.merchantNameFormat}
                        />
                        </div>
                      )}
                       
                    </Form.Group>
                    
                    {this.state.LoadingMerchant ? (
                      <>
                        <p> </p>
                        <div id="spinner">
                          <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </Spinner>
                        </div>
                        <p> </p>
                      </>
                    ) : (
                      <>
                        {this.state.merchantName.toLowerCase() ===
                          this.state.merchantStoreName.toLowerCase() &&
                        this.state.merchantStore !== "No Store" ? (
                          <></>
                        ) : (
                          <>
                            {this.state.merchantNameFormat &&
                            !this.state.LoadingMerchant ? (
                              <>
                                <p> </p>
                                <Button variant="primary" type="submit">
                                  Find Store/Menu
                                </Button>
                                <p> </p>
                              </>
                            ) : (
                              <>
                                <p> </p>
                                <Button variant="primary">
                                  Find Store/Menu
                                </Button>
                                <p> </p>
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </Form>

                  {this.state.sendPaymentSuccess ? (
                    <>
                      <p></p>
                      <Alert variant="success" dismissible>
                        <Alert.Heading>Payment Successful!</Alert.Heading>
                        You have successfully paid{" "}
                        <b>{this.state.merchantStoreName}</b>!<p></p>
                        <p>Sending Order Details...</p>
                      </Alert>
                    </>
                  ) : (
                    <></>
                  )}

                  {this.state.sendOrderSuccess ? (
                    <>
                      <p></p>
                      <Alert variant="success" dismissible>
                        <Alert.Heading>Order Successful!</Alert.Heading>
                        Your order was successfully sent! Check out{" "}
                        <b>Your Orders</b> to view order.
                      </Alert>
                    </>
                  ) : (
                    <></>
                  )}

                  {this.state.sendFailure ? (
                    <>
                      <p></p>
                      <Alert variant="danger" dismissible>
                        <Alert.Heading>Payment Failed</Alert.Heading>
                        <p>
                          You have run into a transaction error. Please verify
                          wallet has sufficient funds and try again.
                        </p>
                      </Alert>
                    </>
                  ) : (
                    <></>
                  )}

                  {this.state.identityIdMerchant === "No Name" ? (
                    <>
                      <p></p>
                      <Alert variant="danger" dismissible>
                        <Alert.Heading>No Identity for Name</Alert.Heading>
                        <p>
                          There is no identity for this name, please try another
                          name.
                        </p>
                      </Alert>
                    </>
                  ) : (
                    <></>
                  )}

                  {this.state.identityIdMerchant === "Error" ? (
                    <>
                      <p></p>
                      <Alert variant="danger" dismissible>
                        <Alert.Heading>Merchant Name Error</Alert.Heading>
                        <p>
                          Platform may be having difficulties. You may have to
                          reload and try again.
                        </p>
                      </Alert>
                    </>
                  ) : (
                    <></>
                  )}

                  {this.state.merchantStore === "No Store" ? (
                    <>
                      <p></p>
                      <Alert variant="danger" dismissible>
                        <Alert.Heading>No Store/Menu for Name</Alert.Heading>
                        <p>
                          This name is not a DashGetPaid merchant, please try
                          another name.
                        </p>
                      </Alert>
                    </>
                  ) : (
                    <></>
                  )}

                  <FindMerchant
                    isLoadingWallet={this.props.isLoadingWallet}
                    isLoadingRecentOrders={this.props.isLoadingRecentOrders}
                    isLoadingActive={this.props.isLoadingActive}

                    recentOrders={this.props.recentOrders}
                    recentOrdersStores={this.props.recentOrdersStores}
                    recentOrdersNames={this.props.recentOrdersNames}
                    recentOrdersDGMAddresses={
                      this.props.recentOrdersDGMAddresses
                    }

                    activeOrders={this.props.activeOrders} 
                    activeOrdersStores={this.props.activeOrdersStores}
                    activeOrdersNames={this.props.activeOrdersNames}
                    activeOrdersAddresses={this.props.activeOrdersAddresses}


                    handleSelectRecentOrActive={this.handleSelectRecentOrActive}
                    LoadingMerchant={this.state.LoadingMerchant}
                    LoadingItems={this.state.LoadingItems}
                    LoadingOrder={this.state.LoadingOrder}
                    
                    merchantStoreName={this.state.merchantStoreName}
                    merchantStore={this.state.merchantStore}
                    dgmDocumentForMerchant={this.state.dgmDocumentForMerchant}
                    merchantItems={this.state.merchantItems}
                    viewStore={this.state.viewStore}
                    handleViewStore={this.handleViewStore}
                    cartItems={this.state.cartItems}
                    handleEditItemModal={this.handleEditItemModal}
                    handleAddToCartModal={this.handleAddToCartModal}
                    showModal={this.showModal}
                    accountBalance={this.props.accountBalance}
                    skipSynchronizationBeforeHeight={
                      this.props.skipSynchronizationBeforeHeight
                    }
                    mode={this.props.mode}
                    whichNetwork={this.props.whichNetwork}
                  />
                </>
              ) : (
                <></>
              )}

              {this.state.whichTab === "Your Orders" ? (
                <>
                  <YourOrders
                    
                    isLoadingWallet={this.props.isLoadingWallet}
                    isLoadingRecentOrders={this.props.isLoadingRecentOrders}
              
              identity={this.props.identity}
              identityInfo={this.props.identityInfo}
              uniqueName={this.props.uniqueName}

              recentOrders={this.props.recentOrders} 
      recentOrdersStores={this.props.recentOrdersStores}
      recentOrdersNames={this.props.recentOrdersNames}
      recentOrdersDGMAddresses={this.props.recentOrdersDGMAddresses}
      recentOrdersItems={this.props.recentOrdersItems}
      recentOrdersMessages={this.props.recentOrdersMessages}
      handleOrderMessageModalShow={this.props.handleOrderMessageModalShow}
      
                    accountBalance={this.props.accountBalance}
                    accountHistory={this.props.accountHistory}

                    showModal={this.showModal}
                    mode={this.props.mode}
                  />
                </>
              ) : (
                <></>
              )}
            </div>
          </>
        ) : (
          <></>
        )}

        {/* 
        {this.props.isLoading ? (
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
        )} */}

        {/* THIS IS THE START OF A SEPARATE SECTION APART FROM EVERYTHING ABOVE */}

        {this.props.identity === "No Identity" ? (
          <div id="bodytext">
            <p>
              There is no Identity for this Mnemonic, please go the{" "}
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://dashgetnames.com/"
              >
                DashGetNames.com
              </a>{" "}
              and register an Identity for your Mnemonic.
            </p>
            <p>Or Testnet Platform maybe having difficulties...</p>
          </div>
        ) : (
          <></>
        )}

        {this.props.identity === "Identity Error" ? (
          <div id="bodytext">
            <p>Testnet Platform maybe having difficulties...</p>
            <p></p>
            <p>Please refresh the page and try again.</p>
          </div>
        ) : (
          <></>
        )}

        {this.props.uniqueName === "Name Error" ? (
          <div id="bodytext">
            <p>
              There is no Name for this Identity, please go to{" "}
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://dashgetnames.com/"
              >
                DashGetNames.com
              </a>{" "}
              and register an Name for your Identity.
            </p>
            <p>
              Or you may have run into a platform issue, just reload page and
              try again.
            </p>
          </div>
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "AddItemToCartModal" ? (
          <AddItemToCartModal
            isModalShowing={this.state.isModalShowing}
            selectedItem={this.state.selectedItem}
            addToCart={this.addToCart}
            hideModal={this.hideModal}
            mode={this.props.mode}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "EditItemModal" ? (
          <EditItemModal
            isModalShowing={this.state.isModalShowing}
            selectedCartItemIndex={this.state.selectedCartItemIndex}
            cartItems={this.state.cartItems}
            editCart={this.editCart}
            hideModal={this.hideModal}
            mode={this.props.mode}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "PlaceOrderModal" ? (
          <PlaceOrderModal
            isLoadingWallet={this.props.isLoadingWallet}
            accountBalance={this.props.accountBalance}
            merchantStoreName={this.state.merchantStoreName}
            isModalShowing={this.state.isModalShowing}
            cartItems={this.state.cartItems}
            placeOrder={this.placeOrder}
            hideModal={this.hideModal}
            mode={this.props.mode}
          />
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default BuyerPages;
