import React from "react";
import LocalForage from "localforage";

import Image from "react-bootstrap/Image";
//import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
//import Form from "react-bootstrap/Form";

//import Alert from "react-bootstrap/Alert";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import DashBkgd from "./Images/dash_digital-cash_logo_2018_rgb_for_screens.png";

import TopNav from "./Components/TopNav/TopNav";
//import BottomNav from "./Components/BottomNav/BottomNav";

import LandingPage from "./Components/Pages/LandingPage";
import BuyerPages from "./Components/Buyer/BuyerPages";
import MerchantPages from "./Components/Merchant/MerchantPages";

import Footer from "./Components/Footer";

import ConnectWalletModal from "./Components/TopNav/ConnectWalletModal";
import LogoutModal from "./Components/TopNav/LogoutModal";
import OrderMessageModal from "./Components/OrderMessageModal";
import TopUpIdentityModal from "./Components/TopUpIdentityModal";

import "./App.css";

const Dash = require("dash");

const {
  Essentials: { Buffer },
  PlatformProtocol: { Identifier },
} = Dash;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      isLoggedInAs: "buyer",

      isLoading: false,
      isLoadingRefresh: false, //For Platform data reloading (unused currently)
      isLoadingWallet: false,

      mode: "dark",
      denom: "Dash",
      presentModal: "",
      isModalShowing: false,
      whichNetwork: "testnet",

      mnemonic: "",
      identity: "",
      identityInfo: "",
      identityRaw: "",
      uniqueName: "",

      initialRecentOrders: [],
      initialRecentOrdersStores: [],
      initialRecentOrdersNames: [],
      initialRecentOrdersDGMAddresses: [],
      initialRecentOrdersItems: [],
      initialRecentOrdersMessages: [],

      initial1: false,
      initial2: false,
      initial3: false,
      initial4: false,
      initial5: false,

      isLoadingRecentOrders: true,

      recentOrders: [],
      recentOrdersStores: [],
      recentOrdersNames: [],
      recentOrdersDGMAddresses: [],
      recentOrdersItems: [],
      recentOrdersMessages: [],

      recent1: false,
      recent2: false,
      recent3: false,
      recent4: false,
      recent5: false,

      isLoadingActive: false,
      activeOrders: [],
      activeOrdersStores: [],
      activeOrdersNames: [],
      activeOrdersAddresses: [],

      active1: false,
      active2: false,
      active3: false,

      accountBalance: "",
      accountAddress: "",
      accountHistory: "",

      messageOrderId: "",
      messageStoreOwnerName: "",

      walletId: "",
      mostRecentLogin: false,
      platformLogin: false,
      LocalForageKeys: [],

      EndSetInterval: "",

      skipSynchronizationBeforeHeight: 905000,
      mostRecentBlockHeight: 905000,

      DataContractDGP: "785cZo4ok3DgyCJKsg4NPwuFmdDdcbp1hZKBW5b4SZ97",
      DataContractDGM: "4PUQmGdGLLWwTFntgwEDhJWzUKoKqbSKanjVGTi2Fbcj",
      DataContractDPNS: "GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec",

      expandedTopNav: false,
    };
  }

  closeTopNav = () => {
    this.setState({
      expandedTopNav: false,
    });
  };

  toggleTopNav = () => {
    if (this.state.expandedTopNav) {
      this.setState({
        expandedTopNav: false,
      });
    } else {
      this.setState({
        expandedTopNav: true,
      });
    }
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

  handleMode = () => {
    if (this.state.mode === "primary")
      this.setState({
        mode: "dark",
      });
    else {
      this.setState({
        mode: "primary",
      });
    }
  };

  handleDenom = () => {
    //This is not implemented yet..
    if (this.state.mode === "Dash")
      this.setState({
        mode: "mDash",
      });
    else {
      this.setState({
        mode: "Dash",
      });
    }
  };

  handleOrderMessageModalShow = (theOrderId, ownerName) => {
    this.setState(
      {
        messageOrderId: theOrderId,
        messageStoreOwnerName: ownerName,
      },
      () => this.showModal("OrderMessageModal")
    );
  };

  handleOrderMessageSubmit = (orderMsgComment) => {
    console.log("Called Buyer Order Message: ", orderMsgComment);

    this.setState({
      isLoadingRecentOrders: true,
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
        DGPContract: {
          contractId: this.state.DataContractDGP,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const submitMsgDoc = async () => {
      const { platform } = client;

      let identity = "";
      if (this.state.identityRaw !== "") {
        identity = this.state.identityRaw;
      } else {
        identity = await platform.identities.get(this.state.identity);
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

      // return dgpDocument;

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
          $ownerId: this.state.identity,
          $id: returnedDoc.$id,
          msg: orderMsgComment,
          orderId: this.state.messageOrderId,
        };

        this.setState({
          recentOrdersMessages: [orderMsg, ...this.state.recentOrdersMessages],
          isLoadingRecentOrders: false,
        });
      })
      .catch((e) => {
        console.error("Something went wrong with Buyer Order Message:\n", e);
        this.setState({
          ordersMessageError: true, //I should like make that a thing ->
          isLoadingRecentOrders: false,
        });
      })
      .finally(() => client.disconnect());
  };

  handleAddingNewOrder = (
    theOrder,
    theName,
    theStore,
    theItems,
    theAddress
  ) => {
    this.setState({
      recentOrders: [theOrder, ...this.state.recentOrders],
      recentOrdersStores: [theStore, ...this.state.recentOrdersStores],
      recentOrdersNames: [theName, ...this.state.recentOrdersNames],
      recentOrdersDGMAddresses: [
        theAddress,
        ...this.state.recentOrdersDGMAddresses,
      ],
      recentOrdersItems: [...theItems, ...this.state.recentOrdersItems],
    });
  };

  handleLogout = () => {
    this.setState(
      {
        isLoggedIn: false,
        isLoggedInAs: "buyer",

        isLoading: false,
        isLoadingRefresh: false, //For Platform data reloading (unused currently)
        isLoadingWallet: false,

        mode: "dark",
        denom: "Dash",
        presentModal: "",
        isModalShowing: false,
        whichNetwork: "testnet",

        mnemonic: "",
        identity: "",
        identityInfo: "",
        identityRaw: "",
        uniqueName: "",

        initialRecentOrders: [],
        initialRecentOrdersStores: [],
        initialRecentOrdersNames: [],
        initialRecentOrdersDGMAddresses: [],
        initialRecentOrdersItems: [],
        initialRecentOrdersMessages: [],

        initial1: false,
        initial2: false,
        initial3: false,
        initial4: false,
        initial5: false,

        isLoadingRecentOrders: true,

        recentOrders: [],
        recentOrdersStores: [],
        recentOrdersNames: [],
        recentOrdersDGMAddresses: [],
        recentOrdersItems: [],
        recentOrdersMessages: [],

        recent1: false,
        recent2: false,
        recent3: false,
        recent4: false,
        recent5: false,

        isLoadingActive: false,
        activeOrders: [],
        activeOrdersStores: [],
        activeOrdersNames: [],
        activeOrdersAddresses: [],

        active1: false,
        active2: false,
        active3: false,

        accountBalance: "",
        accountAddress: "",
        accountHistory: "",

        messageOrderId: "",
        messageStoreOwnerName: "",

        walletId: "",
        mostRecentLogin: false,
        platformLogin: false,
        LocalForageKeys: [],

        skipSynchronizationBeforeHeight: 910000,
        mostRecentBlockHeight: 910000,

        expandedTopNav: false,
      },
      () => this.componentDidMount()
    );
  };

  componentDidMount() {
    LocalForage.config({
      name: "dashmoney-platform-login",
    });

    LocalForage.getItem("mostRecentWalletId")
      .then((val) => {
        if (val !== null) {
          this.handleInitialQuerySeq(val.identity);
          this.setState({
            walletId: val.walletId,
            identity: val.identity,
            uniqueName: val.name,
          });
        } else {
          console.log("There is no mostRecentWalletId");
        }
      })
      .catch(function (err) {
        console.log(err);
      });

    //***Next Bit Gets MostRecentBlockHeight */
    const clientOpts = {
      network: this.state.whichNetwork,
    };
    const client = new Dash.Client(clientOpts);

    const getMostRecentBlockHeight = async () => {
      const status = await client.getDAPIClient().core.getStatus();

      return status;
    };

    getMostRecentBlockHeight()
      .then((d) => {
        let blockHeight = d.chain.blocksCount;
        console.log("Most Recent Block Height:\n", blockHeight);
        this.setState({
          mostRecentBlockHeight: blockHeight - 6,
        });
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
      })
      .finally(() => client.disconnect());

    //Next Part Gets keys for platform login check
    LocalForage.keys()
      .then((keys) => {
        this.setState({
          LocalForageKeys: keys,
        });
        console.log("Local Forage keys:\n", keys);
      })
      .catch(function (err) {
        console.log(err);
      });

    this.getActiveOrders();
  }

  handleInitialQuerySeq = (theIdentity) => {
    this.getInitialRecentOrders(theIdentity);
  };

  handleWalletConnection = (theMnemonic, loginAs) => {
    if (this.state.LocalForageKeys.length === 0) {
      this.setState(
        {
          isLoggedIn: true,
          isLoggedInAs: loginAs,
          isLoading: true,
          isLoadingWallet: true,
          mnemonic: theMnemonic,
        },
        () => this.getIdentitywithMnem(theMnemonic)
      );
    } else {
      this.setState(
        {
          isLoggedIn: true,
          isLoggedInAs: loginAs,
          isLoading: true,
          isLoadingWallet: true,
          mnemonic: theMnemonic,
        },
        () => this.checkPlatformOnlyLogin(theMnemonic)
      );
    }
  };

  checkPlatformOnlyLogin = (theMnemonic) => {
    console.log("Called Check Platform Login");

    const clientOpts = {
      network: this.state.whichNetwork,
      wallet: {
        mnemonic: theMnemonic,
        offlineMode: true,
      },
    };

    const client = new Dash.Client(clientOpts);

    let walletIdToTry;

    const getWalletId = async () => {
      const account = await client.getWalletAccount();

      walletIdToTry = account.walletId;
      //console.log("walletIdToTry:", walletIdToTry);

      return walletIdToTry === this.state.walletId;
    };

    getWalletId()
      .then((mostRecentMatch) => {
        console.log(`Most Recent Matches -> ${mostRecentMatch}`);

        if (!mostRecentMatch) {
          let isKeyAvail = this.state.LocalForageKeys.includes(walletIdToTry);
          // console.log(`LocalForage Test -> ${isKeyAvail}`);

          if (isKeyAvail) {
            console.log("This here is a login skip!!");

            LocalForage.getItem(walletIdToTry)
              .then((val) => {
                //  console.log("Value Retrieved", val);

                if (
                  val !== null ||
                  typeof val.identity !== "string" ||
                  val.identity === "" ||
                  val.name === "" ||
                  typeof val.name !== "string"
                ) {
                  this.setState(
                    {
                      platformLogin: true,
                      identity: val.identity,
                      uniqueName: val.name,
                      walletId: walletIdToTry,
                      recentOrders: [],
                      isLoading: false,
                      isLoadingRecentOrders: true,
                      //maintain Loading bc continuing to other functions
                    },
                    () => this.handleStartQuerySeq(val.identity, theMnemonic)
                  );

                  let lfObject = {
                    walletId: walletIdToTry,
                    identity: val.identity,
                    name: val.name,
                  };
                  LocalForage.setItem("mostRecentWalletId", lfObject)
                    .then((d) => {
                      //return LocalForage.getItem(walletId);
                      // console.log("Return from LF setitem:", d);
                    })
                    .catch((err) => {
                      console.error(
                        "Something went wrong setting to localForage:\n",
                        err
                      );
                    });
                } else {
                  //  console.log("platform login failed");
                  //this.getIdentitywithMnem(theMnemonic);
                  //() => this.getNamefromIdentity(val)); // send to get it
                }
              })
              .catch((err) => {
                console.error(
                  "Something went wrong getting from localForage:\n",
                  err
                );
              });
          } else {
            this.setState(
              {
                //This is for if no platform login at all. resets
                identityInfo: "",
                identityRaw: "",
                uniqueName: "",
                recentOrders: [],
                isLoading: true,
                isLoadingRecentOrders: true,
              },
              () => this.getIdentitywithMnem(theMnemonic)
            );
          }
        } //Closes mostRecentMatch
        else {
          this.setState(
            {
              mostRecentLogin: true,
              platformLogin: true,
              isLoading: false,
            },
            () => this.handleMostRecentLogin(theMnemonic)
          );
        }
      })
      .catch((e) => console.error("Something went wrong:\n", e))
      .finally(() => client.disconnect());
  };

  /* ************************************************************** */

  handleMostRecentLogin = (theMnemonic) => {
    //check if loading is done and push to display state
    if (
      this.state.initial1 &&
      this.state.initial2 &&
      this.state.initial3 &&
      this.state.initial4 &&
      this.state.initial5
    ) {
      this.setState({
        recentOrders: this.state.initialRecentOrders,
        recentOrdersStores: this.state.initialRecentOrdersStores,
        recentOrdersNames: this.state.initialRecentOrdersNames,
        recentOrdersDGMAddresses: this.state.initialRecentOrdersDGMAddresses,
        recentOrdersItems: this.state.initialRecentOrdersItems,
        recentOrdersMessages: this.state.initialRecentOrdersMessages,

        isLoadingRecentOrders: false,
      });
    }

    this.getIdentityInfo(this.state.identity);
    this.getWalletwithMnem(theMnemonic);
  };

  handleStartQuerySeq = (theIdentity, theMnemonic) => {
    this.getRecentOrders(theIdentity);

    this.getIdentityInfo(theIdentity);

    this.getWalletwithMnem(theMnemonic);
  };

  getIdentitywithMnem = (theMnemonic) => {
    const client = new Dash.Client({
      network: this.state.whichNetwork,
      wallet: {
        mnemonic: theMnemonic,
        unsafeOptions: {
          skipSynchronizationBeforeHeight: this.state.mostRecentBlockHeight,
        },
      },
    });

    let walletIdToTry;

    const retrieveIdentityIds = async () => {
      const account = await client.getWalletAccount();

      //console.log(account);
      // this.setState({
      //   accountAddress: account.getUnusedAddress().address, //This can be used if you havent created the DGMDocument <-
      // });

      walletIdToTry = account.walletId;
      // console.log(walletIdToTry);

      return account.identities.getIdentityIds();
    };

    retrieveIdentityIds()
      .then((d) => {
        // console.log("Mnemonic identities:\n", d);
        //This if - handles if there is an identity or not
        if (d.length === 0) {
          this.setState({
            isLoading: false,
            identity: "No Identity",
          });
        } else {
          this.setState(
            {
              walletId: walletIdToTry,
              identity: d[0],
              isLoading: false,
              //maintain Loading bc continuing to other functions
            },
            () => this.callEverythingBcHaveIdentityNow(d[0], theMnemonic)
          );
        }
      })
      .catch((e) => {
        console.error("Something went wrong getting IdentityIds:\n", e);
        this.setState({
          isLoading: false,
          identity: "No Identity",
        });
      })
      .finally(() => client.disconnect());
  };

  callEverythingBcHaveIdentityNow = (theIdentity, theMnemonic) => {
    if (!this.state.platformLogin) {
      this.getNamefromIdentity(theIdentity);
      this.getIdentityInfo(theIdentity);
    }
    this.getRecentOrders(theIdentity);
    this.getWalletwithMnem(theMnemonic);
  };

  getWalletwithMnem = (theMnemonic) => {
    const client = new Dash.Client({
      network: this.state.whichNetwork,
      wallet: {
        mnemonic: theMnemonic,
        adapter: LocalForage.createInstance,
        unsafeOptions: {
          skipSynchronizationBeforeHeight:
            this.state.skipSynchronizationBeforeHeight,
        },
      },
    });

    const retrieveIdentityIds = async () => {
      const account = await client.getWalletAccount();
      //console.log(account);
      //console.log(account.getTotalBalance());
      // console.log(account.getUnusedAddress().address);
      //console.log('TX History: ', account.getTransactionHistory());

      this.setState({
        //accountWallet: client, //Can I use this for the send TX?-> NO
        accountBalance: account.getTotalBalance(),
        accountAddress: account.getUnusedAddress().address, //This can be used if you havent created the DGMDocument <-
        accountHistory: account.getTransactionHistory(),
      });

      return true;
    };

    retrieveIdentityIds()
      .then((d) => {
        console.log("Wallet Loaded:\n", d);
        this.setState({
          isLoadingWallet: false,
        });
        //This if - handles if there is an identity or not
        // if (d.length === 0) {
        //   this.setState({
        //     isLoading: false,
        //     identity: "No Identity",
        //   });
        // } else {
        //   this.setState(
        //     {
        //       identity: d[0],
        //       isLoading: false,
        //       //maintain Loading bc continuing to other functions
        //     }
        //   );
        // }
      })
      .catch((e) => {
        console.error("Something went wrong getting Wallet:\n", e);
        this.setState({
          isLoadingWallet: false,
          isLoading: false,
          identity: "Identity Error",
        });
      })
      .finally(() => client.disconnect());
  };

  getWalletForNewOrder = () => {
    //For Merchant to Load New Orders. But also Buyer for wallet reload after purchase

    this.setState({
      isLoadingWallet: true,
    });

    const client = new Dash.Client({
      network: this.state.whichNetwork,
      wallet: {
        mnemonic: this.state.mnemonic,
        adapter: LocalForage.createInstance,
        unsafeOptions: {
          skipSynchronizationBeforeHeight:
            this.state.skipSynchronizationBeforeHeight,
        },
      },
    });

    const retrieveIdentityIds = async () => {
      const account = await client.getWalletAccount();

      this.setState({
        accountBalance: account.getTotalBalance(),
        accountHistory: account.getTransactionHistory(),
      });

      return true;
    };

    retrieveIdentityIds()
      .then((d) => {
        console.log("Wallet Reloaded:\n", d);
        this.setState({
          isLoadingWallet: false,
        });
      })
      .catch((e) => {
        console.error("Something went wrong reloading Wallet:\n", e);
        this.setState({
          isLoadingWallet: false,
          walletReloadError: true, //Add this to state and handle ->
        });
      })
      .finally(() => client.disconnect());
  };

  getNamefromIdentity = (theIdentity) => {
    const client = new Dash.Client({
      network: this.state.whichNetwork,
    });

    const retrieveNameByRecord = async () => {
      // Retrieve by a name's identity ID
      return client.platform.names.resolveByRecord(
        "dashUniqueIdentityId",
        theIdentity // Your identity ID
      );
    };

    retrieveNameByRecord()
      .then((d) => {
        let nameRetrieved = d[0].toJSON();

        //console.log("Name retrieved:\n", nameRetrieved);

        //******************** */
        let lfObject = {
          identity: theIdentity,
          name: nameRetrieved.label,
        };

        LocalForage.setItem(this.state.walletId, lfObject)
          .then((d) => {
            //return LocalForage.getItem(walletId);
            //   console.log("Return from LF setitem:", d);
          })
          .catch((err) => {
            console.error(
              "Something went wrong setting to localForage:\n",
              err
            );
          });
        //******************** */
        lfObject = {
          walletId: this.state.walletId,
          identity: theIdentity,
          name: nameRetrieved.label,
        };

        LocalForage.setItem("mostRecentWalletId", lfObject)
          .then((d) => {
            //return LocalForage.getItem(walletId);
            //  console.log("Return from LF setitem:", d);
          })
          .catch((err) => {
            console.error(
              "Something went wrong setting to localForage:\n",
              err
            );
          });
        //******************** */
        this.setState({
          uniqueName: nameRetrieved.label,
          isLoading: false,
        });
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        // console.log("There is no dashUniqueIdentityId to retrieve");
        this.setState({
          isLoading: false,
          uniqueName: "Name Error",
        });
      })
      .finally(() => client.disconnect());
  };

  getIdentityInfo = (theIdentity) => {
    console.log("Called get Identity Info");

    const client = new Dash.Client({ network: this.state.whichNetwork });

    const retrieveIdentity = async () => {
      return client.platform.identities.get(theIdentity); // Your identity ID
    };

    retrieveIdentity()
      .then((d) => {
        // console.log("Identity retrieved:\n", d.toJSON());

        this.setState({
          identityInfo: d.toJSON(),
          identityRaw: d,
          //isLoading: false,
        });
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);

        // this.setState({
        //   isLoading: false,
        // });
      })
      .finally(() => client.disconnect());
  };

  //######################

  getInitialRecentOrders = (theIdentity) => {
    if (this.state.isLoggedInAs === "buyer") {
      const clientOpts = {
        network: this.state.whichNetwork,
        apps: {
          DGPContract: {
            contractId: this.state.DataContractDGP,
          },
        },
      };
      const client = new Dash.Client(clientOpts);

      const getDocuments = async () => {
        console.log("Called Get Initial Orders");

        return client.platform.documents.get("DGPContract.dgporder", {
          where: [["$ownerId", "==", theIdentity]],
          orderBy: [["$createdAt", "desc"]],
        });
      };

      getDocuments()
        .then((d) => {
          let docArray = [];
          if (d.length === 0) {
            this.setState({
              //recentOrders: "No Orders",
              initialRecentOrders: [],
              isLoadingRecentOrders: false,
            });
          } else {
            for (const n of d) {
              let returnedDoc = n.toJSON();
              console.log("Order:\n", returnedDoc);

              returnedDoc.toId = Identifier.from(
                returnedDoc.toId,
                "base64"
              ).toJSON();

              returnedDoc.cart = JSON.parse(returnedDoc.cart);

              console.log("newOrder:\n", returnedDoc);

              docArray = [...docArray, returnedDoc];
            }
            this.setState(
              {
                initialRecentOrders: docArray,
              },
              () => this.helperInitialRecentOrders(docArray)
            );
          } //Ends the else
        })
        .catch((e) => {
          console.error("Something went wrong in initialRecentOrders:\n", e);
          this.setState({
            initialRecentOrdersError: true, //I dont think this is in state ->
          });
        })
        .finally(() => client.disconnect());
    } //This closes 'buyer' if statement
  };

  helperInitialRecentOrders = (theDocArray) => {
    this.getInitialRecentOrdersNames(theDocArray);
    this.getInitialRecentOrdersStores(theDocArray);
    this.getInitialRecentOrdersDGMAddresses(theDocArray);
    this.getInitialRecentOrdersItems(theDocArray);
    this.getInitialRecentOrdersMsgs(theDocArray);
  };

  checkInitialRecentOrdersRace = () => {
    if (
      this.state.initial1 &&
      this.state.initial2 &&
      this.state.initial3 &&
      this.state.initial4 &&
      this.state.initial5
    ) {
      if (this.state.mostRecentLogin) {
        this.setState({
          recentOrders: this.state.initialRecentOrders,
          recentOrdersStores: this.state.initialRecentOrdersStores,
          recentOrdersNames: this.state.initialRecentOrdersNames,
          recentOrdersDGMAddresses: this.state.initialRecentOrdersDGMAddresses,
          recentOrdersItems: this.state.initialRecentOrdersItems,
          recentOrdersMessages: this.state.initialRecentOrdersMessages,

          isLoadingRecentOrders: false,
        });
      }
    }
  };

  getInitialRecentOrdersNames = (docArray) => {
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DataContractDPNS: {
          contractId: this.state.DataContractDPNS,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    let arrayOfToIds = docArray.map((doc) => {
      return doc.toId;
    });

    let setOfToIds = [...new Set(arrayOfToIds)];

    arrayOfToIds = [...setOfToIds];

    arrayOfToIds = arrayOfToIds.map((item) =>
      Buffer.from(Identifier.from(item))
    );

    console.log("Called Get Initial Recent Order Names");

    const getNameDocuments = async () => {
      return client.platform.documents.get("DataContractDPNS.domain", {
        where: [["records.dashUniqueIdentityId", "in", arrayOfToIds]],
        orderBy: [["records.dashUniqueIdentityId", "asc"]],
      });
    };

    getNameDocuments()
      .then((d) => {
        if (d.length === 0) {
          // console.log("No DPNS domain documents retrieved.");
        }

        let nameDocArray = [];
        for (const n of d) {
          //console.log("NameDoc:\n", n.toJSON());

          nameDocArray = [n.toJSON(), ...nameDocArray];
        }

        this.setState(
          {
            initialRecentOrdersNames: nameDocArray,
            initial1: true,
          },
          () => this.checkInitialRecentOrdersRace()
        );
      })
      .catch((e) => {
        console.error("Something went wrong getting recent order names:\n", e);
        this.setState({
          initialRecentOrdersNamesError: true, //<- add to state? ->
        });
      })
      .finally(() => client.disconnect());
  };

  getInitialRecentOrdersStores = (docArray) => {
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DGPContract: {
          contractId: this.state.DataContractDGP,
        },
      },
    };
    const client = new Dash.Client(clientOpts);
    // This Below is to get unique set of merchant ids
    let arrayOfToIds = docArray.map((doc) => {
      return doc.toId;
    });

    let setOfToIds = [...new Set(arrayOfToIds)];

    arrayOfToIds = [...setOfToIds];

    arrayOfToIds = arrayOfToIds.map((item) =>
      Buffer.from(Identifier.from(item))
    );

    const getDocuments = async () => {
      console.log("Called Get Initial Orders Stores");

      return client.platform.documents.get("DGPContract.dgpstore", {
        where: [["$ownerId", "in", arrayOfToIds]],
        orderBy: [["$ownerId", "asc"]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];

        for (const n of d) {
          //console.log("Store:\n", n.toJSON());
          docArray = [...docArray, n.toJSON()];
        }

        this.setState(
          {
            initialRecentOrdersStores: docArray,
            initial2: true,
          },
          () => this.checkInitialRecentOrdersRace()
        );
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          initialRecentOrdersStoresError: true,
        });
      })
      .finally(() => client.disconnect());
  };

  getInitialRecentOrdersDGMAddresses = (docArray) => {
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DGMContract: {
          contractId: this.state.DataContractDGM,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    // This Below is to get unique set of merchant ids
    let arrayOfToIds = docArray.map((doc) => {
      return doc.toId;
    });

    let setOfToIds = [...new Set(arrayOfToIds)];

    arrayOfToIds = [...setOfToIds];

    arrayOfToIds = arrayOfToIds.map((item) =>
      Buffer.from(Identifier.from(item))
    );

    const getDocuments = async () => {
      console.log("Querying Initial Merchant's Documents.");

      return client.platform.documents.get("DGMContract.dgmaddress", {
        where: [["$ownerId", "in", arrayOfToIds]],
        orderBy: [["$ownerId", "asc"]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];
        for (const n of d) {
          // console.log("DGM Address:\n", n.toJSON());
          docArray = [...docArray, n.toJSON()];
        }

        this.setState(
          {
            initialRecentOrdersDGMAddresses: docArray,
            initial3: true,
          },
          () => this.checkInitialRecentOrdersRace()
        );
      })
      .catch((e) => {
        console.error(
          "Something went wrong getting Initial Recent Orders DGM Addresses:\n",
          e
        );
        this.setState({
          initialRecentOrdersDGMAddressesError: true, // ADD alert to handle ->
        });
      })
      .finally(() => client.disconnect());
  };

  getInitialRecentOrdersItems = (docArray) => {
    let arrayOfItemIds = [];

    docArray.forEach((doc) => {
      let itemArray = [];

      doc.cart.forEach((cartItem) => {
        itemArray.push(cartItem[0]);
      });

      arrayOfItemIds = [...itemArray, ...arrayOfItemIds];
    });

    // console.log("Array of Order Items", arrayOfItemIds);

    //This makes sure that it is unique.
    let setOfItemIds = [...new Set(arrayOfItemIds)];

    arrayOfItemIds = [...setOfItemIds];

    //   arrayOfItemIds = arrayOfItemIds.map((item) =>{ //UNNECESSARY NOW ->REMOVE
    //     return Identifier.from(item, 'base64').toJSON()
    // });

    // console.log("Array of item ids", arrayOfItemIds);

    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DGPContract: {
          contractId: this.state.DataContractDGP,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const getDocuments = async () => {
      console.log("Called Get Initial Order Items");

      return client.platform.documents.get("DGPContract.dgpitem", {
        where: [["$id", "in", arrayOfItemIds]],
        orderBy: [["$id", "asc"]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];

        for (const n of d) {
          //console.log("Items:\n", n.toJSON());
          docArray = [...docArray, n.toJSON()];
        }

        this.setState(
          {
            initialRecentOrdersItems: docArray,
            initial4: true,
          },
          () => this.checkInitialRecentOrdersRace()
        );
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          initialRecentOrderItemsError: true, //PROBABLY NEED TO ADD THIS TO THE STATE ->
        });
      })
      .finally(() => client.disconnect());
  };

  getInitialRecentOrdersMsgs = (docArray) => {
    //THERE IS AN ERROR WHERE IF I DONT RETURN ANYTHING IT THROWS AN INVALID QUERY MISSING ORDERBY BUT ITS JUST THAT IT DOESN'T HAVE ANYTHING TO RETURN!! -> REPORT AFTER V0.25 IF STILL THERE -> Well it doesn't like timeStamp -> see below.

    //TEST -> Change to createdAT and see what happens ->

    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DGPContract: {
          contractId: this.state.DataContractDGP,
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

    //console.log("Array of order ids", arrayOfOrderIds);

    const getDocuments = async () => {
      console.log("Called Get Initial Orders Msgs");

      return client.platform.documents.get("DGPContract.dgpmsg", {
        where: [["orderId", "in", arrayOfOrderIds]],
        orderBy: [["orderId", "asc"]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];

        for (const n of d) {
          let returnedDoc = n.toJSON();
          //console.log("Msg:\n", returnedDoc);
          returnedDoc.orderId = Identifier.from(
            returnedDoc.orderId,
            "base64"
          ).toJSON();

          //console.log("newMsg:\n", returnedDoc);
          docArray = [...docArray, returnedDoc];
        }

        this.setState(
          {
            initialRecentOrdersMessages: docArray,
            initial5: true,
          },
          () => this.checkInitialRecentOrdersRace()
        );
      })
      .catch((e) => {
        console.error(
          "Something went wrong in getInitialRecentOrdersMsgs:\n",
          e
        );
        this.setState({
          initialRecentOrdersMessagesError: true,
        });
      })
      .finally(() => client.disconnect());
  };

  //$$  $$   $$$  $$  $  $$  $$$  $$$  $$  $$

  //######################
  /**
  * isLoadingRecentOrders: false,
      recentOrders: [],  
      recentOrdersStores: [],
      recentOrdersNames:[], 
      recentOrdersDGMAddresses:[],
  */

  getRecentOrders = (theIdentity) => {
    if (this.state.isLoggedInAs === "buyer") {
      this.setState({
        isLoadingRecentOrders: true,
      });

      const clientOpts = {
        network: this.state.whichNetwork,
        apps: {
          DGPContract: {
            contractId: this.state.DataContractDGP,
          },
        },
      };
      const client = new Dash.Client(clientOpts);

      const getDocuments = async () => {
        console.log("Called Get DGP Recent Orders");

        return client.platform.documents.get("DGPContract.dgporder", {
          where: [["$ownerId", "==", theIdentity]],
          orderBy: [["$createdAt", "desc"]],
        });
      };

      getDocuments()
        .then((d) => {
          let docArray = [];

          if (d.length === 0) {
            this.setState(
              {
                //recentOrders: "No Orders",
                recentOrders: [],
                isLoadingRecentOrders: false,
              }
              //,() => this.getNamesForDGTOrders()
            );
          } else {
            for (const n of d) {
              let returnedDoc = n.toJSON();
              //console.log("Order:\n", returnedDoc);
              returnedDoc.toId = Identifier.from(
                returnedDoc.toId,
                "base64"
              ).toJSON();
              //  returnedDoc.cart[0] = Identifier.from(returnedDoc.cart[0], 'base64').toJSON();
              returnedDoc.cart = JSON.parse(returnedDoc.cart);
              //console.log("newOrder:\n", returnedDoc);
              docArray = [...docArray, returnedDoc];
            }

            this.setState(
              {
                recentOrders: docArray,
              },
              () => this.helperRecentOrders(docArray)
            );
          } //Ends the else
        })
        .catch((e) => {
          console.error("Something went wrong:\n", e);
          this.setState({
            recentOrdersError: true, //I dont think this is in state ->
            isLoadingRecentOrders: false,
          });
        })
        .finally(() => client.disconnect());
    } //This closes 'buyer' if statement
  };

  helperRecentOrders = (theDocArray) => {
    //REFACTOR JUST MOVE THE GETTING THE UNIQUE MERCHANT iDS OUT OF EACH AND JUST SEND AS THE PARAMETER -> getRecentOrdersItems needs the docs to get the cart to get the items -> refactor later ->
    this.getRecentOrdersNames(theDocArray);
    this.getRecentOrdersStores(theDocArray);
    this.getRecentOrdersDGMAddresses(theDocArray);
    this.getRecentOrdersItems(theDocArray);
    this.getRecentOrdersMsgs(theDocArray);
  };

  checkRecentOrdersRace = () => {
    if (
      this.state.recent1 &&
      this.state.recent2 &&
      this.state.recent3 &&
      this.state.recent4 &&
      this.state.recent5
    ) {
      this.setState({
        isLoadingRecentOrders: false,
      });
    }
  };

  getRecentOrdersNames = (docArray) => {
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DataContractDPNS: {
          contractId: this.state.DataContractDPNS,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    let arrayOfToIds = docArray.map((doc) => {
      return doc.toId;
    });

    let setOfToIds = [...new Set(arrayOfToIds)];

    arrayOfToIds = [...setOfToIds];

    arrayOfToIds = arrayOfToIds.map((item) =>
      Buffer.from(Identifier.from(item))
    );

    console.log("Called Get Recent Order Names");

    const getNameDocuments = async () => {
      return client.platform.documents.get("DataContractDPNS.domain", {
        where: [["records.dashUniqueIdentityId", "in", arrayOfToIds]],
        orderBy: [["records.dashUniqueIdentityId", "asc"]],
      });
    };

    getNameDocuments()
      .then((d) => {
        if (d.length === 0) {
          // console.log("No DPNS domain documents retrieved.");
        }

        let nameDocArray = [];
        for (const n of d) {
          //console.log("NameDoc:\n", n.toJSON());

          nameDocArray = [n.toJSON(), ...nameDocArray];
        }

        this.setState(
          {
            recentOrdersNames: nameDocArray,
            recent1: true,
          },
          () => this.checkRecentOrdersRace()
        );
      })
      .catch((e) => {
        console.error("Something went wrong getting recent order names:\n", e);
        this.setState({
          recentOrdersNamesError: true, //<- add to state? ->
          isLoadingRecentOrders: false,
        });
      })
      .finally(() => client.disconnect());
  };

  getRecentOrdersStores = (docArray) => {
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DGPContract: {
          contractId: this.state.DataContractDGP,
        },
      },
    };
    const client = new Dash.Client(clientOpts);
    // This Below is to get unique set of merchant ids
    let arrayOfToIds = docArray.map((doc) => {
      return doc.toId;
    });

    let setOfToIds = [...new Set(arrayOfToIds)];

    arrayOfToIds = [...setOfToIds];

    arrayOfToIds = arrayOfToIds.map((item) =>
      Buffer.from(Identifier.from(item))
    );

    const getDocuments = async () => {
      console.log("Called Get Recent Orders Stores");

      return client.platform.documents.get("DGPContract.dgpstore", {
        where: [["$ownerId", "in", arrayOfToIds]],
        orderBy: [["$ownerId", "asc"]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];

        for (const n of d) {
          //console.log("Store:\n", n.toJSON());
          docArray = [...docArray, n.toJSON()];
        }

        this.setState(
          {
            recentOrdersStores: docArray,
            recent2: true,
          },
          () => this.checkRecentOrdersRace()
        );
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          recentOrdersStoresError: true,
        });
      })
      .finally(() => client.disconnect());
  };

  getRecentOrdersDGMAddresses = (docArray) => {
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DGMContract: {
          contractId: this.state.DataContractDGM,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    // This Below is to get unique set of merchant ids
    let arrayOfToIds = docArray.map((doc) => {
      return doc.toId;
    });

    let setOfToIds = [...new Set(arrayOfToIds)];

    arrayOfToIds = [...setOfToIds];

    arrayOfToIds = arrayOfToIds.map((item) =>
      Buffer.from(Identifier.from(item))
    );

    const getDocuments = async () => {
      console.log("Querying Merchant's DGM Documents.");

      return client.platform.documents.get("DGMContract.dgmaddress", {
        where: [["$ownerId", "in", arrayOfToIds]],
        orderBy: [["$ownerId", "asc"]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];
        for (const n of d) {
          // console.log("DGM Address:\n", n.toJSON());
          docArray = [...docArray, n.toJSON()];
        }

        this.setState(
          {
            recentOrdersDGMAddresses: docArray,
            recent3: true,
          },
          () => this.checkRecentOrdersRace()
        );
      })
      .catch((e) => {
        console.error(
          "Something went wrong getting Recent Orders Addresses:\n",
          e
        );
        this.setState({
          recentOrdersDGMAddressesError: true, // ADD alert to handle ->
        });
      })
      .finally(() => client.disconnect());
  };

  getRecentOrdersItems = (docArray) => {
    let arrayOfItemIds = [];

    docArray.forEach((doc) => {
      let itemArray = [];

      doc.cart.forEach((cartItem) => {
        itemArray.push(cartItem[0]);
      });

      arrayOfItemIds = [...itemArray, ...arrayOfItemIds];
    });

    // console.log("Array of Order Items", arrayOfItemIds);

    //This makes sure that it is unique.
    let setOfItemIds = [...new Set(arrayOfItemIds)];

    arrayOfItemIds = [...setOfItemIds];

    //   arrayOfItemIds = arrayOfItemIds.map((item) =>{ //UNNECESSARY => REMOVE
    //     return Identifier.from(item, 'base64').toJSON()
    // });
    // console.log("Array of item ids", arrayOfItemIds);

    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DGPContract: {
          contractId: this.state.DataContractDGP,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const getDocuments = async () => {
      console.log("Called Get DGP Order Items");

      return client.platform.documents.get("DGPContract.dgpitem", {
        where: [["$id", "in", arrayOfItemIds]],
        orderBy: [["$id", "asc"]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];

        for (const n of d) {
          //console.log("Items:\n", n.toJSON());
          docArray = [...docArray, n.toJSON()];
        }

        this.setState(
          {
            recentOrdersItems: docArray,
            recent4: true,
          },
          () => this.checkRecentOrdersRace()
        );
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          orderItemsError: true, //PROBABLY NEED TO ADD THIS TO THE STATE -> DO IT ->
          LoadingItems: false,
        });
      })
      .finally(() => client.disconnect());
  };

  getRecentOrdersMsgs = (docArray) => {
    //THERE IS AN ERROR WHERE IF I DONT RETURN ANYTHING IT THROWS AN INVALID QUERY MISSING ORDERBY BUT ITS JUST THAT IT DOESN'T HAVE ANYTHING TO RETURN!! -> REPORT AFTER V0.25 IF STILL THERE -> Well it doesn't like timeStamp -> see below.

    //TEST -> Change to createdAT and see what happens ->

    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DGPContract: {
          contractId: this.state.DataContractDGP,
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

    //console.log("Array of order ids", arrayOfOrderIds);

    const getDocuments = async () => {
      console.log("Called Get Recent Orders Msgs");

      return client.platform.documents.get("DGPContract.dgpmsg", {
        where: [["orderId", "in", arrayOfOrderIds]],
        orderBy: [["orderId", "asc"]],
        //TEST ^^^ Why is the orderId and not createdAt? Bc its to get msgs not orders oh
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];
        for (const n of d) {
          let returnedDoc = n.toJSON();
          //console.log("Msg:\n", returnedDoc);
          returnedDoc.orderId = Identifier.from(
            returnedDoc.orderId,
            "base64"
          ).toJSON();

          //console.log("newMsg:\n", returnedDoc);
          docArray = [...docArray, returnedDoc];
        }

        this.setState(
          {
            recentOrdersMessages: docArray,
            recent5: true,
          },
          () => this.checkRecentOrdersRace()
        );
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          recentOrdersMessagesError: true,
        });
      })
      .finally(() => client.disconnect());
  };

  //$$  $$   $$$  $$  $  $$  $$$  $$$  $$  $$
  /**
  * isLoadingActive: false,
      activeOrders: [], 
      activeOrdersStores: [],
      activeOrdersNames: [],
      activeOrdersAddresses:[],

      
  */

  checkActiveOrdersRace = () => {
    if (this.state.active1 && this.state.active2 && this.state.active3) {
      this.setState({
        isLoadingActive: false,
      });
    }
  };

  getActiveOrders = () => {
    /**This is Active QUERY
                name: 'createdAt',
                properties: [{$createdAt: 'asc' }],
                unique: false,
              }
             */
    this.setState({
      isLoadingActive: true,
    });

    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DGPContract: {
          contractId: this.state.DataContractDGP,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    const getDocuments = async () => {
      console.log("Called Get Active Orders");

      return client.platform.documents.get("DGPContract.dgporder", {
        where: [["$createdAt", "<=", Date.now()]],
        orderBy: [["$createdAt", "desc"]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];
        if (d.length === 0) {
          this.setState(
            {
              // activeOrders: "No Orders",
              isLoadingActive: false,
            }
            //,() => this.getNamesForDGTOrders()
          );
        } else {
          for (const n of d) {
            let returnedDoc = n.toJSON();
            //console.log("Order:\n", returnedDoc);
            returnedDoc.toId = Identifier.from(
              returnedDoc.toId,
              "base64"
            ).toJSON();
            //  returnedDoc.cart[0] = Identifier.from(returnedDoc.cart[0], 'base64').toJSON();
            returnedDoc.cart = JSON.parse(returnedDoc.cart);
            // console.log("newOrder:\n", returnedDoc);
            docArray = [...docArray, returnedDoc];
          }

          this.setState(
            {
              activeOrders: docArray,
            },
            () => this.helperActive(docArray)
          );
        } //Ends the else
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          activeOrdersError: true, //I dont think this is in state ->
          isLoadingActive: false,
        });
      })
      .finally(() => client.disconnect());
  };

  helperActive = (theDocArray) => {
    //REFACTOR JUST MOVE THE GETTING THE UNIQUE MERCHANT iDS OUT OF EACH AND JUST SEND AS THE PARAMETER ->
    this.getActiveNames(theDocArray);
    this.getActiveStores(theDocArray);
    this.getActiveAddresses(theDocArray);
  };

  getActiveNames = (docArray) => {
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DataContractDPNS: {
          contractId: this.state.DataContractDPNS,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    let arrayOfToIds = docArray.map((doc) => {
      return doc.toId;
    });

    let setOfToIds = [...new Set(arrayOfToIds)];

    arrayOfToIds = [...setOfToIds];

    arrayOfToIds = arrayOfToIds.map((item) =>
      Buffer.from(Identifier.from(item))
    );

    //  console.log("Called Get Names for DGP Merchants");

    const getNameDocuments = async () => {
      return client.platform.documents.get("DataContractDPNS.domain", {
        where: [["records.dashUniqueIdentityId", "in", arrayOfToIds]],
        orderBy: [["records.dashUniqueIdentityId", "asc"]],
      });
    };

    getNameDocuments()
      .then((d) => {
        if (d.length === 0) {
          // console.log("No DPNS domain documents retrieved.");
        }

        let nameDocArray = [];
        for (const n of d) {
          //console.log("NameDoc:\n", n.toJSON());

          nameDocArray = [n.toJSON(), ...nameDocArray];
        }

        this.setState(
          {
            activeOrdersNames: nameDocArray,
            active1: true,
          },
          () => this.checkActiveOrdersRace()
        );
      })
      .catch((e) => {
        console.error("Something went wrong getting recent order names:\n", e);
        this.setState({
          activeNamesError: true, //<- add to state? ->
          isLoadingActive: false,
        });
      })
      .finally(() => client.disconnect());
  };

  getActiveStores = (docArray) => {
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DGPContract: {
          contractId: this.state.DataContractDGP,
        },
      },
    };
    const client = new Dash.Client(clientOpts);
    // This Below is to get unique set of merchant ids
    let arrayOfToIds = docArray.map((doc) => {
      return doc.toId;
    });

    let setOfToIds = [...new Set(arrayOfToIds)];

    arrayOfToIds = [...setOfToIds];

    arrayOfToIds = arrayOfToIds.map((item) =>
      Buffer.from(Identifier.from(item))
    );

    const getDocuments = async () => {
      console.log("Called Get Active Orders Stores");

      return client.platform.documents.get("DGPContract.dgpstore", {
        where: [["$ownerId", "in", arrayOfToIds]],
        orderBy: [["$ownerId", "asc"]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];

        for (const n of d) {
          //console.log("Store:\n", n.toJSON());
          docArray = [...docArray, n.toJSON()];
        }

        this.setState(
          {
            activeOrdersStores: docArray,
            active2: true,
          },
          () => this.checkActiveOrdersRace()
        );
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          activeStoresError: true,
          isLoadingActive: false,
        });
      })
      .finally(() => client.disconnect());
  };

  getActiveAddresses = (docArray) => {
    const clientOpts = {
      network: this.state.whichNetwork,
      apps: {
        DGMContract: {
          contractId: this.state.DataContractDGM,
        },
      },
    };
    const client = new Dash.Client(clientOpts);

    // This Below is to get unique set of merchant ids
    let arrayOfToIds = docArray.map((doc) => {
      return doc.toId;
    });

    let setOfToIds = [...new Set(arrayOfToIds)];

    arrayOfToIds = [...setOfToIds];

    arrayOfToIds = arrayOfToIds.map((item) =>
      Buffer.from(Identifier.from(item))
    );

    const getDocuments = async () => {
      console.log("Querying Active DGM Documents.");

      return client.platform.documents.get("DGMContract.dgmaddress", {
        where: [["$ownerId", "in", arrayOfToIds]],
        orderBy: [["$ownerId", "asc"]],
      });
    };

    getDocuments()
      .then((d) => {
        let docArray = [];
        for (const n of d) {
          // console.log("DGM Address:\n", n.toJSON());
          docArray = [...docArray, n.toJSON()];
        }

        this.setState(
          {
            activeOrdersAddresses: docArray,
            active3: true,
          },
          () => this.checkActiveOrdersRace()
        );
      })
      .catch((e) => {
        console.error(
          "Something went wrong getting Recent Orders DGM Addresses:\n",
          e
        );
        this.setState({
          activeOrdersAddressesError: true, // ADD alert to handle ->
          isLoadingActive: false,
        });
      })
      .finally(() => client.disconnect());
  };

  //$$  $$   $$$  $$  $  $$  $$$  $$$  $$  $$

  doTopUpIdentity = (numOfCredits) => {
    this.setState({
      isLoadingWallet: true,
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
    };
    const client = new Dash.Client(clientOpts);

    const topupIdentity = async () => {
      const identityId = this.state.identity; // Your identity ID
      const topUpAmount = numOfCredits; // Number of duffs ie 1000

      await client.platform.identities.topUp(identityId, topUpAmount);
      return client.platform.identities.get(identityId);
    };

    topupIdentity()
      .then((d) => {
        console.log("Identity credit balance: ", d.balance);
        this.setState({
          identityInfo: d.toJSON(),
          identityRaw: d,
          isLoadingWallet: false,
          accountBalance: this.state.accountBalance - 1000000,
        });
      })
      .catch((e) => {
        console.error("Something went wrong:\n", e);
        this.setState({
          isLoadingWallet: false,
          topUpError: true, //Add to State and handle ->
        });
      })
      .finally(() => client.disconnect());
  };

  //#######################################################################

  render() {
    this.state.mode === "primary"
      ? (document.body.style.backgroundColor = "rgb(280,280,280)")
      : (document.body.style.backgroundColor = "rgb(20,20,20)");

    this.state.mode === "primary"
      ? (document.body.style.color = "black")
      : (document.body.style.color = "white");

    return (
      <>
        <TopNav
          handleMode={this.handleMode}
          mode={this.state.mode}
          showModal={this.showModal}
          whichNetwork={this.state.whichNetwork}
          isLoggedIn={this.state.isLoggedIn}
          toggleTopNav={this.toggleTopNav}
          expandedTopNav={this.state.expandedTopNav}
        />
        <Image fluid="true" id="dash-bkgd" src={DashBkgd} alt="Dash Logo" />

        <Container className="g-0">
          <Row className="justify-content-md-center">
            <Col md={11} lg={10} xl={9} xxl={9}>
              {!this.state.isLoggedIn ? (
                <>
                  <LandingPage
                    mode={this.state.mode}
                    showModal={this.showModal}
                  />
                  <Footer />
                </>
              ) : (
                <>
                  {this.state.isLoading ? (
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

                  {!this.state.isLoading &&
                  this.state.isLoggedInAs === "buyer" ? (
                    <BuyerPages
                      isLoading={this.state.isLoading}
                      isLoadingWallet={this.state.isLoadingWallet}
                      isLoadingRecentOrders={this.state.isLoadingRecentOrders}
                      isLoadingActive={this.state.isLoadingActive}
                      handleAddingNewOrder={this.handleAddingNewOrder}
                      mnemonic={this.state.mnemonic}
                      identity={this.state.identity}
                      identityInfo={this.state.identityInfo}
                      identityRaw={this.state.identityRaw}
                      uniqueName={this.state.uniqueName}
                      recentOrders={this.state.recentOrders}
                      recentOrdersStores={this.state.recentOrdersStores}
                      recentOrdersNames={this.state.recentOrdersNames}
                      recentOrdersDGMAddresses={
                        this.state.recentOrdersDGMAddresses
                      }
                      recentOrdersItems={this.state.recentOrdersItems}
                      recentOrdersMessages={this.state.recentOrdersMessages}
                      handleOrderMessageModalShow={
                        this.handleOrderMessageModalShow
                      }
                      activeOrders={this.state.activeOrders}
                      activeOrdersStores={this.state.activeOrdersStores}
                      activeOrdersNames={this.state.activeOrdersNames}
                      activeOrdersAddresses={this.state.activeOrdersAddresses}
                      accountBalance={this.state.accountBalance}
                      accountHistory={this.state.accountHistory}
                      getWalletForNewOrder={this.getWalletForNewOrder}
                      DataContractDGP={this.state.DataContractDGP}
                      DataContractDGM={this.state.DataContractDGM}
                      DataContractDPNS={this.state.DataContractDPNS}
                      mostRecentBlockHeight={this.state.mostRecentBlockHeight}
                      skipSynchronizationBeforeHeight={
                        this.state.skipSynchronizationBeforeHeight
                      }
                      showModal={this.showModal}
                      mode={this.state.mode}
                      whichNetwork={this.state.whichNetwork}
                    />
                  ) : (
                    <></>
                  )}

                  {!this.state.isLoading &&
                  this.state.isLoggedInAs === "merchant" ? (
                    <MerchantPages
                      isLoading={this.state.isLoading}
                      isLoadingWallet={this.state.isLoadingWallet}
                      mnemonic={this.state.mnemonic}
                      identity={this.state.identity}
                      identityInfo={this.state.identityInfo}
                      identityRaw={this.state.identityRaw}
                      uniqueName={this.state.uniqueName}
                      accountBalance={this.state.accountBalance}
                      accountAddress={this.state.accountAddress}
                      accountHistory={this.state.accountHistory}
                      DataContractDGP={this.state.DataContractDGP}
                      DataContractDGM={this.state.DataContractDGM}
                      DataContractDPNS={this.state.DataContractDPNS}
                      mostRecentBlockHeight={this.state.mostRecentBlockHeight}
                      skipSynchronizationBeforeHeight={
                        this.state.skipSynchronizationBeforeHeight
                      }
                      getWalletForNewOrder={this.getWalletForNewOrder}
                      showModal={this.showModal}
                      mode={this.state.mode}
                      whichNetwork={this.state.whichNetwork}
                    />
                  ) : (
                    <></>
                  )}

                  {/* {!this.state.isLoading &&
            this.state.identity !== "No Identity" &&
            this.state.uniqueName !== "Er" ? (
              <BottomNav
                isLoadingRefresh={this.state.isLoadingRefresh}
                closeTopNav={this.closeTopNav}
                refreshGetDocsAndGetIdInfo={this.refreshGetDocsAndGetIdInfo}
                //Need to pass everything for TOPUP Function
                mode={this.state.mode}
                showModal={this.showModal}
              />
            ) : (
              <></>
            )} */}
                </>
              )}
            </Col>
          </Row>
        </Container>

        {this.state.isModalShowing &&
        this.state.presentModal === "ConnectWalletModal" ? (
          <ConnectWalletModal
            LocalForageKeys={this.state.LocalForageKeys}
            showModal={this.showModal}
            isModalShowing={this.state.isModalShowing}
            handleWalletConnection={this.handleWalletConnection}
            hideModal={this.hideModal}
            mode={this.state.mode}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "LogoutModal" ? (
          <LogoutModal
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            handleLogout={this.handleLogout}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "OrderMessageModal" ? (
          <OrderMessageModal
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            messageStoreOwnerName={this.state.messageStoreOwnerName}
            handleOrderMessageSubmit={this.handleOrderMessageSubmit}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}

        {this.state.isModalShowing &&
        this.state.presentModal === "TopUpIdentityModal" ? (
          <TopUpIdentityModal
            accountBalance={this.state.accountBalance}
            isLoadingWallet={this.state.isLoadingWallet}
            isModalShowing={this.state.isModalShowing}
            hideModal={this.hideModal}
            mode={this.state.mode}
            doTopUpIdentity={this.doTopUpIdentity}
            closeTopNav={this.closeTopNav}
          />
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default App;
