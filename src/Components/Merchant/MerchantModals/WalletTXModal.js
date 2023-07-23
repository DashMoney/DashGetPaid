import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import CloseButton from 'react-bootstrap/CloseButton';

import "./WalletTXModal.css";

class WalletTXModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedHistory: false,
    };
  }

  handleCloseClick = () => {
    this.props.hideModal();
  };

  handleSatsToDash = (sats) => {
    let dashAmt = sats / 100000000;
    let dashAmt2Display = dashAmt.toFixed(3);
    return dashAmt2Display;
  };

  handleTimeToDate = (timeObject) => {
    let date = new Date(timeObject);

    //let longFormDate= setTime(date);

    return date.toLocaleDateString();
  };

  handleTxOrderName = (tx) => {

    if(tx.txId === undefined || this.props.DGPOrders === "No Orders"){
      return '';
    }else{ //ELSE 1


    let txOrder = this.props.DGPOrders.find(order =>{
      return order.txId === tx.txId;
    });

    if (txOrder === undefined){
      return '';
    
    } else{ //ELSE 2

    let orderName = this.props.DGPOrdersNames.find(doc => {
      return doc.$ownerId === txOrder.$ownerId;
    })

    return orderName.label;
  } // CLOSE ELSE 2
}// CLOSE ELSE 1

  }

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

     /* 
      array of objects
      type: 'received' or 'sent'
      time: Sun Jun 04 2023 03:25:46 GMT-0500 (Central Daylight Time) - JS?
      satoshisBalanceImpact <- that is my solution
      
      USE from (to get the address) 
      from

      DONT USE to
      to: (ARRAY)
        to[0] amount recieved in Sats

      */

        let balance = this.props.accountBalance;
        let balanceArr = [balance];
    
        for (let tx of this.props.accountHistory) {
          // if(tx.type === "received"){
          balance -= tx.satoshisBalanceImpact;
          balanceArr.push(balance);
          // } else{
          //   balance += tx.satoshisBalanceImpact;
          //   balanceArr.push(balance);
          // }
        }
        balanceArr.pop();
    
        let transactions = this.props.accountHistory.map((tx, index) => {
          return (
            <tr key={index}>

              <td><b>{this.handleTxOrderName(tx)}</b></td>

              {tx.type === "received" ? (
                <td className="satBalImpactreceived">
                 <b> {this.handleSatsToDash(tx.satoshisBalanceImpact)}</b>
                </td>
              ) : (
                <td className="satBalImpactsent">
                  {this.handleSatsToDash(tx.satoshisBalanceImpact)}
                </td>
              )}
              {tx.type === "received" ? (
                
                <td><b>{this.handleSatsToDash(balanceArr[index])}</b></td>
              ) : (
                
                <td>{this.handleSatsToDash(balanceArr[index])}</td>
              )}
    
    
              <td>{this.handleTimeToDate(tx.time)}</td>
            </tr>
          );
        });
    return (
      <>
        <Modal show={this.props.isModalShowing} backdropClassName={modalBackdrop} contentClassName={modalBkg}>
        <Modal.Header >
          <Modal.Title><b>Wallet Transactions</b></Modal.Title>
          {closeButtonColor}
        </Modal.Header>
        <Modal.Body>
        
                <table className="txHistory">
                  <thead>
                  <tr>
                  <th>From</th>
                    <th>Amount</th>
                    <th>Balance</th>
                    <th id="rowWider">Date</th>
                  </tr>
                  </thead>
                  <tbody>
                  {transactions}
                  </tbody>
                </table>
              
          
        </Modal.Body>

        <Modal.Footer>
        <Button variant="primary" onClick={this.handleCloseClick}>
              Close
            </Button>
        </Modal.Footer>
      </Modal>
      </> 
    );
  }
}

export default WalletTXModal;
