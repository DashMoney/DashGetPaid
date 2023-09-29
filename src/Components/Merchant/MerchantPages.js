import React from "react";
import LocalForage from "localforage";

import Nav from "react-bootstrap/Nav";
import Badge from "react-bootstrap/Badge";
import Alert from "react-bootstrap/Alert";

import MyStore from "./MyStore";
import Orders from "./Orders";

import CreateStoreModal from "./MerchantModals/CreateStoreModal";
import StoreStatusModal from "./MerchantModals/StoreStatusModal";
import EditStoreModal from "./MerchantModals/EditStoreModal";

import CreateItemModal from "./MerchantModals/CreateItemModal";
import EditItemModal from "./MerchantModals/EditItemModal";
import MerchantOrderMsgModal from "./MerchantModals/MerchantOrderMsgModal";

import WalletTXModal from "./MerchantModals/WalletTXModal";

import "./MerchantPages.css";

const Dash = require("dash");

const {
  Essentials: { Buffer },
  PlatformProtocol: { Identifier },
} = Dash;

class MerchantPages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      whichTab: "Orders",

      Loading: false, //DO I STILL NEED THIS? ->

      LoadingOrders: true,
      LoadingStore: true,
      LoadingItems: true,

       
      DGMAddress: [],
      DGPStore: [],
      DGPItems: [],
      selectedItem: {},
      selectedItemIndex: 0,

      store1: false, //This is for Your Store as Merchant -> it is never reset
      store2: false,


      DGPOrders: [],
      DGPOrdersNames: [],
      DGPOrdersMsgs: [],

      order1: false, // This if for orders placed to you -> it is reset
      order2: false,

      messageOrderId: '',
      messageStoreOwnerName: '',

      newOrderAvail: false,

      isModalShowing: false,
      presentModal: "",

      orderMsgError: false,
      storeError: false,
      itemError: false,
    };
  }

  handleTab = (eventKey) => {
    if (eventKey === "Your Store")
      this.setState({
        whichTab: "Your Store",
      });
    else {
      this.setState({
        whichTab: "Orders",
      });
    }
  };

  handleSelectedItem = (index) => {
    this.setState(
      {
        selectedItem: this.state.DGPItems[index],
        selectedItemIndex: index,
      },
      () => this.showModal("EditItemModal")
    );
  };

  handleMerchantOrderMsgModalShow = (theOrderId, ownerName) =>{
    //probably set state and show modal
    this.setState({
      messageOrderId: theOrderId,
      messageStoreOwnerName: ownerName,
    }
    ,()=>this.showModal("MerchantOrderMsgModal")
    )
  }

  handleMerchantOrderMsgSubmit = (orderMsgComment) => {
    //Submit doc and add to state 
    console.log("Called Buyer Order Message: ", orderMsgComment);

    this.setState({
      LoadingOrders: true,
    });

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

    const submitMsgDoc = async () => {
      const { platform } = client;

      let identity = "";
      if (this.props.identityRaw !== "") {
        identity = this.props.identityRaw;
      } else {
        identity = await platform.identities.get(this.props.identity);
      }

      const msgProperties = {
        msg: orderMsgComment,
        orderId: this.state.messageOrderId,
      };

      // Create the note document
      const dgpDocument = await platform.documents.create(
        "DGPContract.dgpmsg",
        identity,
        msgProperties
      );

      //############################################################
      //This below disconnects the document sending..***

       //return dgpDocument;

      //This is to disconnect the Document Creation***
      //############################################################

      const documentBatch = {
        create: [dgpDocument], // Document(s) to create
      };

      await platform.documents.broadcast(documentBatch, identity);
      return dgpDocument;
    };

    submitMsgDoc()
      .then((d) => {

        let returnedDoc = d.toJSON();
        console.log("Buyer Order Message:\n", returnedDoc);

        let orderMsg = {
          $ownerId: this.props.identity,
          $id: returnedDoc.$id,
          
        msg: orderMsgComment,
        orderId: this.state.messageOrderId,
        }

        this.setState({
          DGPOrdersMsgs: [orderMsg, ...this.state.DGPOrdersMsgs],
          LoadingOrders: false,
        });
      })
      .catch((e) => {
        console.error("Something went wrong with Buyer Order Message:\n", e);
        this.setState({
          ordersMessageError: true,//I should like make that a thing ->
          LoadingOrders: false,
        });
      })
      .finally(() => client.disconnect());
  }

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

  //PULL THESE ON INITIAL LOAD AND HANDLE IT ALL HERE..
  // Assume Identity is passed down through props. <-
  getMerchantDocs = () => {
    this.getDGPStoreMerchant(); //Store -> call getDGMAddress because if I have a store then I dont need the Address but I guess its nice to check
    //And If I don't have a store then i need to check that there is a DGMAddress so I can create it if I need to.

    this.getDGPItemsMerchant(); //Will have to have store but if I have a store it speeds up the getting the items..

    this.getMerchantOrders();
    this.getDGMAddress();
  };

  checkDGPStoreRace = () => {
    if(this.state.store1 && this.state.store2){
      this.setState({
             LoadingStore: false,
             LoadingOrders: false,
      });
    }
  }

  getDGPStoreMerchant = () => {
    //WHat if I just put all the clients in one and pass the client to the function??? ->

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
        where: [["$ownerId", "==", this.props.identity]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];
        
        if (d.length === 0) {
          console.log("No Store");

          this.setState({
          DGPStore: "No Store",
          store1: true,
        },()=>this.checkDGPStoreRace());
          
        } else {
          for (const n of d) {
          // console.log("Store:\n", n.toJSON());
            docArray = [...docArray, n.toJSON()];
          }

          this.setState({
            DGPStore: docArray,
          store1: true,
        },()=>this.checkDGPStoreRace());
  
        } //Ends the else
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          DGPStore: "Store Document Error",
          storeError: true,
          LoadingStore: false,
          LoadingOrders: false,
        });
      })
      .finally(() => client.disconnect()); //Should I remove this??
  };

  getDGMAddress = () => {
    //Needs adjustments for DGP from DGM ->
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
      console.log("Called Query DGM Documents.");

      return client.platform.documents.get("DGMContract.dgmaddress", {
        where: [["$ownerId", "==", this.props.identity]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];

         if (d.length === 0) {

        this.setState({
        DGMAddress: "No Address",
        store2: true,
      },()=>this.checkDGPStoreRace());
          
        } else {

          for (const n of d) {
           // console.log("DGM Address:\n", n.toJSON());
            docArray = [...docArray, n.toJSON()];
          }

          this.setState({
            DGMAddress: docArray,
            store2: true,
          },()=>this.checkDGPStoreRace());

        } //Ends the else
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          DGMAddress: "Document Error",
          storeError: true,
          LoadingStore: false,
        });
      })
      .finally(() => client.disconnect());
  };

  getDGPItemsMerchant = () => {
    
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
        where: [["$ownerId", "==", this.props.identity]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];
        //What if there are zero? -> handled where?
        // if zero then I need to call get dgmaddress and continue the loading

        // if (d.length === 0) {
        //   this.setState(
        //     {
        //       DGPItems: "No Items",
        //       LoadingItems: false,
        //     }
        //   );
        // } else {
        for (const n of d) {
         //console.log("Items:\n", n.toJSON());
          docArray = [...docArray, n.toJSON()];
        }
        this.setState(
          {
            DGPItems: docArray,
            LoadingItems: false,
          },
          () => this.sortDGPItemsMerchant()
        );
        // } //Ends the else
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          DGPItems: "Items Document Error",
          itemError: true,
          LoadingItems: false,
        });
      })
      .finally(() => client.disconnect()); //Should I remove this??
  };

  sortDGPItemsMerchant = () => {
    //This needs to handle the what
    // I think I decided that if you change the price it just becomes unverified// so this needs to handle if the DGP item UPDATEDAT is earlieer then when the order was passed then it will not be verified.
  };

  //THIS NEEDS WALLET SO DELAYED AND ALSO PART OF INTERVAL UPDATE..
  // So need wallet to verify but can get orders and names and items because i need all that to compare to the wallet TXs
  getMerchantOrders = () => {

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
      console.log("Called Get DGP Merchant Orders");

      /**
       *  //This is MERCHANT QUERY
          name: 'toIdandcreatedAt',
          properties: [{ toId: 'asc' }, {$createdAt: 'asc' }],
          unique: false,
        }
       */

      return client.platform.documents.get("DGPContract.dgporder", {
        where: [["toId", "==", this.props.identity]],
        orderBy: [['$createdAt', 'desc']],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];
        //What if there are zero? -> handled where?
        // if zero then I need to call get dgmaddress and continue the loading
        if (d.length === 0) {
          this.setState(
            {
              DGPOrders: "No Orders",
              LoadingOrders: false,
            }
            
          );
        } else {
          for (const n of d) {
            //console.log("Merchant Orders:\n", n.toJSON());
            docArray = [...docArray, n.toJSON()];
          }
          this.setState(
            {
              DGPOrders: docArray,              
            }
            ,() => this.helperForMerchantOrders(docArray)
          );
        } //Ends the else
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          DGPOrders: "Order Document Error",
          ordersError: true,
          LoadingOrders: false,
        });
      })
      .finally(() => client.disconnect());

    
  };

  helperForMerchantOrders = (theDocArray) =>{
    this.getNamesForMerchantOrders(theDocArray);
    this.getMsgsMerchantOrders(theDocArray);
  }

//###  ####  #####  ####  ###  ##
checkOrdersRace = () => {
  if(this.state.order1 && this.state.order2){
    this.setState({
      LoadingOrders: false,
    });
  }
}

  getNamesForMerchantOrders = (docArray) => {
    const clientOpts = {
      network: this.props.whichNetwork,
      apps: {
        DataContractDPNS: {
          contractId: this.props.DataContractDPNS,
        },
      },
    };
    const client = new Dash.Client(clientOpts);


      //START OF NAME RETRIEVAL

      let ownerarrayOfOwnerIds = docArray.map((doc) => {
        return doc.$ownerId;
      });

      let setOfOwnerIds = [...new Set(ownerarrayOfOwnerIds)];

      let arrayOfOwnerIds = [...setOfOwnerIds];

      arrayOfOwnerIds = arrayOfOwnerIds.map((item) =>
        Buffer.from(Identifier.from(item))
      );

    //  console.log("Called Get Names for DGP Orders");

      const getNameDocuments = async () => {
        return client.platform.documents.get("DataContractDPNS.domain", {
          where: [["records.dashUniqueIdentityId", "in", arrayOfOwnerIds]],
          orderBy: [["records.dashUniqueIdentityId", "asc"]],
        });
      };

      getNameDocuments()
        .then((d) => {
          //WHAT IF THERE ARE NO NAMES?
          if (d.length === 0) {
            console.log("No DPNS domain documents retrieved.");
          }

          let nameDocArray = [];

          for (const n of d) {
            //console.log("NameDoc:\n", n.toJSON());

            nameDocArray = [n.toJSON(), ...nameDocArray];
          }
        //  console.log(`DPNS Name Docs: ${nameDocArray}`);

        this.setState({
          DGPOrdersNames: nameDocArray,
          order1: true,
        },()=>this.checkOrdersRace());
          

        })
        .catch((e) => {
          console.error("Something went wrong:\n", e);
        })
        .finally(() => client.disconnect());
      

  };

  getMsgsMerchantOrders = (docArray) => {
    const clientOpts = {
      network: this.props.whichNetwork,
      apps: {
        DGPContract: {
          contractId: this.props.DataContractDGP,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

// This Below is to get unique set of order doc ids
    let arrayOfOrderIds = docArray.map((doc) => {
      return doc.$id;
    });

    //console.log("Array of order ids", arrayOfOrderIds);

    let setOfOrderIds = [...new Set(arrayOfOrderIds)];

    arrayOfOrderIds = [...setOfOrderIds];

    // arrayOfOrderIds = arrayOfOrderIds.map((item) =>
    //   Identifier.from(item)
    // );

     //console.log("Array of order ids", arrayOfOrderIds);

    const getDocuments = async () => {
      console.log("Called Get Merchant Orders Msgs");

      return client.platform.documents.get("DGPContract.dgpmsg", {
        where: [["orderId", "in", arrayOfOrderIds]],
        orderBy: [["orderId", 'asc']], //IDK why it works with this and not $createdAt -> unless I added the $createdAt after the registering -> hmmmm -> idk it doesn't matter at least for awhile ->
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];

        if(d.length === 0){
          //console.log('No Messages for orders');
          this.setState({
            order2: true,
          },()=>this.checkOrdersRace());

        }else{

          for(const n of d) {

            let returnedDoc = n.toJSON()
             //console.log("Msg:\n", returnedDoc);
             returnedDoc.orderId = Identifier.from(returnedDoc.orderId, 'base64').toJSON();
             
             //console.log("newMsg:\n", returnedDoc);
            docArray = [...docArray, returnedDoc];
          }

        this.setState({
          DGPOrdersMsgs: docArray,
          order2: true,
        },()=>this.checkOrdersRace());

         }//This closes the if statement
      })
      .catch((e) => {
        
        console.error("Something went wrong:\n", e);
        this.setState({
          ordersMessagesError: true, //ADD to state -> 
          LoadingOrders: false,
        });
      })
      .finally(() => client.disconnect()); 

  };


  //DOCUMENT CREATION BELOW ********************************************

  createDGPStore = (storeObject) => {
    console.log("Called Create DGP Store");

    this.setState({
      LoadingOrders: true,
      LoadingStore: true,
    });

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
        DGMContract: {
          contractId: this.props.DataContractDGM,
        },
        DGPContract: {
          contractId: this.props.DataContractDGP,
        },
      },
    };
    const client = new Dash.Client(clientOpts);


   //let docsToCreate = []; // MOVE OUT SO CAN USE IN RETURN LOGIC

    let DGPStoreDoc = [];

    let DGMAddrDoc = [];



    const submitStoreDocs = async () => {
      const { platform } = client;
      // const identity = await platform.identities.get(this.props.identity); // Your identity ID

      let identity = "";
      if (this.props.identityRaw !== "") {
        identity = this.props.identityRaw;
      } else {
        identity = await platform.identities.get(this.props.identity);
      } // Your identity ID

      

      const storeDocProperties = {
        description: storeObject.description,
        public: storeObject.public,
        open: storeObject.open,
      };

      const dgpDocument = await platform.documents.create(
        "DGPContract.dgpstore",
        identity,
        storeDocProperties
      );

      DGPStoreDoc.push(dgpDocument);

      if (this.state.DGMAddress === "No Address") {
        const docProperties = {
          address: this.props.accountAddress,
        };
        // Create the address document
        const dgmDocument = await platform.documents.create(
          "DGMContract.dgmaddress",
          identity,
          docProperties
        );

        DGMAddrDoc.push(dgmDocument);
      }

      //############################################################
      //This below disconnects the document sending..***

      // return docsToCreate;

      //This is to disconnect the Document Creation***
      //############################################################

      //CAN I SUBMIT DOCS TO 2 DIFFERENT DATA CONTRACTS? -> TEST ->
let addrBatch;

      const storeBatch = {
        create: DGPStoreDoc, // Document(s) to create
      };

      if(DGMAddrDoc.length !== 0){
       addrBatch = {
        create: DGMAddrDoc, // Document(s) to create
      };
    }

      await platform.documents.broadcast(storeBatch, identity)

      if(DGMAddrDoc.length !== 0){
      await platform.documents.broadcast(addrBatch, identity)
      }
      
      if(DGMAddrDoc.length !== 0){
        return [...DGPStoreDoc, ...DGMAddrDoc ];
      }else{
        return  DGPStoreDoc;
      }
    };

    submitStoreDocs()
      .then((d) => {

        //handle if nothing returned?? ->
        //INTERESTING -> IF ONLY ONE ITEM THEN IT DOESN'T RETURN AN ARRAY!! -> NO IT IS NEVER ANY ARRAY -> THE DOCUMENT SIMPLY HAS TRANSITIONS AND THAT THIS THE ARRAY!!!!! <-

        // let returnedDoc = d.toJSON();
        // console.log("Store Documents JSON:\n", returnedDoc);

        let docArray = [];
          for (const n of d) {
            console.log("Submitted Doc:\n", n.toJSON());
            docArray = [...docArray, n.toJSON()];
          }

        let store;
        let address;
              
//Single Document will be the Store
        if(docArray.length === 1 ){
         store = {
          $ownerId: docArray[0].$ownerId,
          $id: docArray[0].$id,
          description: storeObject.description,
          public: storeObject.public,
          open: storeObject.open,
        }

        this.setState({
          DGPStore: [store],
          LoadingOrders: false,
          LoadingStore: false,
        });       
       } else {

        //Have to handle that may come back in any order.
        //Still may do some assuming

        
           address ={
            $ownerId: docArray[0].$ownerId,
            $id: docArray[0].$id,
            address: this.props.accountAddress,
          }
       
          store = {
            $ownerId: docArray[1].$ownerId,
            $id: docArray[1].$id,
            description: storeObject.description,
            public: storeObject.public,
            open: storeObject.open,
          }
        

      //   if(returnedDoc.transitions[1].$type === 'dgmaddress'){
      //     address ={
      //      $ownerId: returnedDoc.ownerId,
      //      $id: returnedDoc.transitions[1].$id,
      //      address: this.props.accountAddress,
      //    }
      //  } else { 
      //    store = {
      //      $ownerId: returnedDoc.ownerId,
      //      $id: returnedDoc.transitions[1].$id,
      //      description: storeObject.description,
      //      public: storeObject.public,
      //      open: storeObject.open,
      //    }
      //  }

          this.setState({
            DGMAddress: [address],
            DGPStore: [store],
            LoadingOrders: false,
            LoadingStore: false,
          });
        }
      })
      .catch((e) => {
        console.error("Something went wrong during store creation:\n", e);
        this.setState({
          storeError: true,
          LoadingOrders: false,
          LoadingStore: false,
        });
      })
      .finally(() => client.disconnect());
  };

  //******************************************************* */

  editDGPStore = (storeObject) => {
    //For open/close and change description
    console.log("Called Edit DGP Store");

    this.setState({
      LoadingStore: true,
    });

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

    const editStoreDocs = async () => {
      const { platform } = client;
      // const identity = await platform.identities.get(this.props.identity); // Your identity ID

      let identity = "";
      if (this.props.identityRaw !== "") {
        identity = this.props.identityRaw;
      } else {
        identity = await platform.identities.get(this.props.identity);
      } // Your identity ID

      /************************************** */
      //LEFTOVER FROM ORIGINAL CREATED IMPLEMENTATION
      // const storeDocProperties = {
      //   description: storeObject.description,
      //   open: storeObject.open,
      // };

      // const dgpDocument = await platform.documents.create(
      //   "DGPContract.dgpstore",
      //   identity,
      //   storeDocProperties
      // );
      //************************************************** */

      //https://dashplatform.readme.io/docs/tutorial-update-documents

      //Retrieve the existing document

      const [document] = await client.platform.documents.get(
        "DGPContract.dgpstore",
        { where: [["$id", "==", this.state.DGPStore[0].$id]] }
      );

      // Update document
      if (this.state.DGPStore[0].description !== storeObject.description) {
        document.set("description", storeObject.description);
      }

      if (this.state.DGPStore[0].public !== storeObject.public) {
        document.set("public", storeObject.public);
      }
      //CAN I ONLY UPDATE ONE DOCUMENT AT A TIME??

      if (this.state.DGPStore[0].open !== storeObject.open) {
        document.set("open", storeObject.open);
      }

      await platform.documents.broadcast({ replace: [document] }, identity);
      return document;

      //############################################################
      //This below disconnects the document sending..***

      //return dgpDocument;

      //This is to disconnect the Document Creation***
      //############################################################

     
    };

    editStoreDocs()
      .then((d) => {
        //I don't think I want the returned doc. bc they are the real doc and I will just post the supplied docs above. <- DONE  -> TEST ->
        let returnedDoc = d.toJSON();
        console.log("Store Documents:\n", d.toJSON());

        //NEED TO MAKE CUSTOM DOCS LIKE INSTEAD OF JUST PLUGGING IN THE RETURNED DOC BECAUSE THE RETURNED DOC IS A DOC WITH TRANSITIONS -> AWESOME LOOK ABOVE I JUST NEED TO GET THE $ID CORRECT BECAUSE THE EDIT PULLS THE ACTUAL DOC AND JUST NEED TO BE ABLE TO GET IT!! ->

        let store = {
          $ownerId: returnedDoc.$ownerId,
          $id: returnedDoc.$id,
          description: storeObject.description,
          public: storeObject.public,
          open: storeObject.open,
        }

        this.setState({
          DGPStore: [store],
          LoadingStore: false,
        });
      })
      .catch((e) => {
        console.error("Something went wrong during store edit:\n", e);
        this.setState({
          storeError: true,
          LoadingStore: false,
        });
      })
      .finally(() => client.disconnect());
  };

  RegisterDGMAddress = () => {
    //This by itself just in case I need to fix it...
    console.log("Called Register DGM Address");
    this.setState({
      isLoadingConfirmation: true,
      isLoadingButtons: true,
    });
    const clientOpts = {
      network: this.state.whichNetwork,
      wallet: {
        mnemonic: this.state.mnemonic,
        adapter: LocalForage.createInstance,
        unsafeOptions: {
          skipSynchronizationBeforeHeight:
            this.state.skipSynchronizationBeforeHeight,
        },
      },
      apps: {
        DGMContract: {
          contractId: this.props.DataContractDGM,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const submitNoteDocument = async () => {
      const { platform } = client;
      const identity = await platform.identities.get(this.state.identity); // Your identity ID

      const docProperties = {
        address: this.state.accountAddress,
      };

      // Create the note document
      const dgmDocument = await platform.documents.create(
        "DGMContract.dgmaddress", /// I changed .note TO .dgmaddress***
        identity,
        docProperties
      );

      const documentBatch = {
        create: [dgmDocument], // Document(s) to create
        replace: [], // Document(s) to update
        delete: [], // Document(s) to delete
      };
      // Sign and submit the document(s)
      return platform.documents.broadcast(documentBatch, identity);
    };

    submitNoteDocument()
      .then((d) => {
        let returnedDoc = d.toJSON();
        console.log("Document:\n", returnedDoc);

        this.setState({
          dgmDocuments: [returnedDoc],
          isLoadingConfirmation: false,
          isLoadingButtons: false,
        });
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          dgmDocuments: "Document Error",
          isLoadingConfirmation: false,
          isLoadingButtons: false,
        });
      })
      .finally(() => client.disconnect());
  };

  createDGPItem = (itemObject) => {
    console.log("Called Create DGP Item");

    this.setState({
      LoadingItems: true,
    });

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

    //Do the docs creations below. mimic dso msg and tags

    const submitItemDoc = async () => {
      const { platform } = client;

      let identity = "";
      if (this.props.identityRaw !== "") {
        identity = this.props.identityRaw;
      } else {
        identity = await platform.identities.get(this.props.identity);
      }

      const itemProperties = {
        name: itemObject.name,
        price: itemObject.price,
        description: itemObject.description,
        category: itemObject.category,
        avail: itemObject.avail,
      };
      //console.log('Item to Create: ', itemProperties);

      // Create the note document
      const dgpDocument = await platform.documents.create(
        "DGPContract.dgpitem",
        identity,
        itemProperties
      );

      //############################################################
      //This below disconnects the document sending..***

      // return dgpDocument;

      //This is to disconnect the Document Creation***
      //############################################################

      const documentBatch = {
        create: [dgpDocument], // Document(s) to create
      };


//console.log(documentBatch);

      await platform.documents.broadcast(documentBatch, identity);
      return dgpDocument;
    };

    submitItemDoc()
      .then((d) => {
        let returnedDoc = d.toJSON();
        console.log("Document:\n", returnedDoc);

        let item = {
          $ownerId: returnedDoc.$ownerId,
          $id: returnedDoc.$id,
          name: itemObject.name,
        price: itemObject.price,
        category: itemObject.category,
        description: itemObject.description,
        avail: itemObject.avail,
        }

        this.setState({
          
          DGPItems: [item, ...this.state.DGPItems],
          LoadingItems: false,
        });
      })
      .catch((e) => {
        console.error("Something went wrong with Item creation:\n", e);
        this.setState({
          itemError: true,
          LoadingItems: false,
        });
      })
      .finally(() => client.disconnect());
  };

  editDGPItem = (itemObject) => {
    console.log("Called Edit DGP Item");

    this.setState({
      LoadingItems: true,
    });

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

    //Do the docs creations below. mimic dso msg and tags

    const submitItemDoc = async () => {
      const { platform } = client;

      let identity = "";
      if (this.props.identityRaw !== "") {
        identity = this.props.identityRaw;
      } else {
        identity = await platform.identities.get(this.props.identity);
      }

      // const itemProps = {
      //     name: itemObject.name,
      //     price:   itemObject.price,
      //     description: itemObject.description,
      //     avail: itemObject.avail
      // };
      // console.log('Item to Edit: ', itemProps);

      const [document] = await client.platform.documents.get(
        "DGPContract.dgpitem",
        {
          where: [
            [
              "$id",
              "==",
              this.state.DGPItems[this.state.selectedItemIndex].$id,
            ],
          ],
        }
      );


      if (
        this.state.DGPItems[this.state.selectedItemIndex].name !==
        itemObject.name
      ) {
        document.set("name", itemObject.name);
      }

      if (
        this.state.DGPItems[this.state.selectedItemIndex].category !==
        itemObject.category
      ) {
        document.set("category", itemObject.category);
      }

      if (
        this.state.DGPItems[this.state.selectedItemIndex].price !==
        itemObject.price
      ) {
        document.set("price", itemObject.price);
      }

      if (
        this.state.DGPItems[this.state.selectedItemIndex].description !==
        itemObject.description
      ) {
        document.set("description", itemObject.description);
      }

      if (
        this.state.DGPItems[this.state.selectedItemIndex].avail !==
        itemObject.avail
      ) {
        document.set("avail", itemObject.avail);
      }

      await platform.documents.broadcast({ replace: [document] }, identity);
      return document;

      //############################################################
      //This below disconnects the document editing..***

      //return document;

      //This is to disconnect the Document editing***
      //############################################################

    };

    submitItemDoc()
      .then((d) => {
        let returnedDoc = d.toJSON();
        console.log("Edited Item Doc:\n", returnedDoc);

        //I don't think I want the returned doc. bc they are the real doc and I will just post the supplied docs above. -> TEST

        let item = {
          $ownerId: returnedDoc.$ownerId,
          $id: returnedDoc.$id,
          name: itemObject.name,
        price: itemObject.price,
        category: itemObject.category,
        description: itemObject.description,
        avail: itemObject.avail,
        }


        let editedItems = this.state.DGPItems; //[itemObject];

        editedItems.splice(this.state.selectedItemIndex, 1, item); 

        this.setState(
          {
            DGPItems: editedItems,
            LoadingItems: false,
          },
          () => console.log(this.state.DGPItems)
        );
      })
      .catch((e) => {
        console.error("Something went wrong with Item creation:\n", e);
        this.setState({
          itemError: true,
          LoadingItems: false,
        });
      })
      .finally(() => client.disconnect());
  };

  //##################

checkForNewOrders = () =>{

  if(this.state.DGPStore !== 'No Store' &&
   !this.props.isLoadingWallet &&
    !this.state.LoadingOrders){

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
    console.log("Called Check For New Orders");

    return client.platform.documents.get("DGPContract.dgporder", {
      where: [["toId", "==", this.props.identity]],
      orderBy: [['$createdAt', 'desc']],
    });
  };

  getDocuments()
    .then((d) => {
      let docArray =[];

      for(const n of d) {
       // console.log("New Orders:\n", n.toJSON());
        docArray = [...docArray, n.toJSON()];
      }


      if(this.state.DGPOrders === "No Orders"){
        if(docArray.length !== 0){
          this.setState(
            {
              newOrders: docArray,
              newOrderAvail: true,             
            });
        }

      }else if(docArray.length !== this.state.DGPOrders.length){

        this.setState(
          {
            newOrders: docArray,
            newOrderAvail: true,        
          });
        }
    })
    .catch((e) => {
      console.error("Something went wrong:\n", e);
      this.setState({
        newOrdersError: true, // ADD to State and handle
      });
    })
    .finally(() => client.disconnect());
  } //closes opening if statement
}

handleLoadNewOrder = () => {
 
    this.setState(
      { 
        DGPOrders: this.state.newOrders,
        newOrderAvail: false,  
        LoadingOrders: true,
        order1:false, 
        order2:false,
      }
      ,() => this.helperForMerchantOrders(this.state.newOrders)
    );

    this.props.getWalletForNewOrder();

}
  //##################

  componentDidMount = () => {
    this.getMerchantDocs();

    //setInterval() //This will auto update orders BELOW
    
   //setInterval(()=>this.checkForNewOrders(), 20000);

   //DISCONNECTED ^^^ THE SETINTERVAL IN MERCHANT PAGES WHILE I WORK ON THE EDIT OF STORES AND ITEMS

  };

  render() {
    return (
      <>
        {/* 
  //identity "" "No Identity" "Identity Error"
  //uniqueName "" "Name Error" <- catches no name and name error */}

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
                <Nav.Link eventKey="Orders">
                  <b>Orders</b>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Your Store">
                  <b>Your Store/Menu</b>
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

            {/* {this.props.identityInfo === "" ||
          this.props.identityInfo.balance >= 1000000000 ? (
            <></>
          ) : (
            <>
            <h5>
            <Badge className="paddingBadge" bg="primary">
              Please visit DGN or DGM to TopUp your credits.
            </Badge>
            </h5>
            </>
          )} */}

            {this.state.itemError ? (
              <>
                <p></p>
                <Alert variant="danger" dismissible>
                  <Alert.Heading>Item Creation Failed</Alert.Heading>
                  <p>
                    You either have insufficient credits or have run into a
                    platform error. Please TopUp credits by tapping the credits displayed.
                  </p>
                </Alert>
              </>
            ) : (
              <></>
            )}

            {/* {this.state.LoadingOrders && this.state.whichTab === "Orders" ? (
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

            {this.state.LoadingStore && this.state.whichTab === "Your Store" ? (
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

            <div id="bodytext" className="footer">
              {!this.props.isLoadingStore &&
              this.state.whichTab === "Your Store" ? (
                <MyStore
                  identityInfo={this.props.identityInfo}
                  uniqueName={this.props.uniqueName}
                  LoadingStore={this.state.LoadingStore}
                  LoadingItems={this.state.LoadingItems}
                  DGPStore={this.state.DGPStore}
                  DGMAddress={this.state.DGMAddress}
                  DGPItems={this.state.DGPItems}
                  showModal={this.showModal}
                  handleSelectedItem={this.handleSelectedItem}
                  mode={this.props.mode}
                />
              ) : (
                <></>
              )}

              {!this.props.isLoadingStore &&
              this.state.whichTab === "Orders" ? (
                <Orders
                  isLoadingWallet={this.props.isLoadingWallet}
                  LoadingStore={this.state.LoadingStore}
                  LoadingItems={this.state.LoadingItems}
                  LoadingOrders={this.state.LoadingOrders}
                  
                  accountBalance={this.props.accountBalance}
                  accountHistory={this.props.accountHistory}

                  identity={this.props.identity}
                  identityInfo={this.props.identityInfo}
                  uniqueName={this.props.uniqueName}
                  
                  DGPItems={this.state.DGPItems}
                  DGPStore={this.state.DGPStore}
                  DGMAddress={this.state.DGMAddress}
                  DGPOrders={this.state.DGPOrders}
                  DGPOrdersNames={this.state.DGPOrdersNames}
                  DGPOrdersMsgs={this.state.DGPOrdersMsgs}

                  newOrderAvail={this.state.newOrderAvail}
                  handleLoadNewOrder={this.handleLoadNewOrder}
                  
                  handleMerchantOrderMsgModalShow={this.handleMerchantOrderMsgModalShow}
                  showModal={this.showModal}
                  mode={this.props.mode}
                />
              ) : (
                <></>
              )}
            </div>
          </>

        ) : (
          <></>
        )}

        {/* {this.props.isLoadingRefresh ? (
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

        {/* //identity "" "No Identity" "Identity Error"
     //uniqueName "" "Name Error" <- catches no name and name error */}

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
        this.state.presentModal === "CreateStoreModal" ? (
          <CreateStoreModal
            isModalShowing={this.state.isModalShowing}
            DGMAddress={this.state.DGMAddress}
            isLoadingWallet={this.props.isLoadingWallet}
            LoadingStore={this.state.LoadingStore}
            hideModal={this.hideModal}
            mode={this.state.mode}
            createDGPStore={this.createDGPStore}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "EditStoreModal" ? (
          <EditStoreModal
            isModalShowing={this.state.isModalShowing}
            DGPStore={this.state.DGPStore}
            hideModal={this.hideModal}
            mode={this.state.mode}
            editDGPStore={this.editDGPStore}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "StoreStatusModal" ? (
          <StoreStatusModal
            isModalShowing={this.state.isModalShowing}
            showModal={this.showModal}
            DGPStore={this.state.DGPStore}
            hideModal={this.hideModal}
            mode={this.state.mode}
            editDGPStore={this.editDGPStore}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "CreateItemModal" ? (
          <CreateItemModal
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            createDGPItem={this.createDGPItem}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "EditItemModal" ? (
          <EditItemModal
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            selectedItem={this.state.selectedItem}
            editDGPItem={this.editDGPItem}
          />
        ) : (
          <></>
        )}

{this.state.isModalShowing &&
        this.state.presentModal === "MerchantOrderMsgModal" ? (
          <MerchantOrderMsgModal
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            messageStoreOwnerName={this.state.messageStoreOwnerName}
            handleMerchantOrderMsgSubmit={this.handleMerchantOrderMsgSubmit}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}
        
{this.state.isModalShowing &&
        this.state.presentModal === "WalletTXModal" ? (
          <WalletTXModal
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            accountHistory={this.props.accountHistory}
            accountBalance={this.props.accountBalance}

            LoadingOrders={this.state.LoadingOrders}
            DGPOrders={this.state.DGPOrders}
            DGPOrdersNames={this.state.DGPOrdersNames}

          />
        ) : (
          <></>
        )}

      </>
    );
  }
}

export default MerchantPages;
