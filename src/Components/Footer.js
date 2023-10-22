import React from "react";

class Footer extends React.Component {
  render() {
    return (
      <div className='footer' id="bodytext">
        <h3>
          Resources
        </h3>
        
        <ul>
        <li>Try out <span></span>
            <a rel="noopener noreferrer" target="_blank" href="https://dashgetmoney.com">
            <b>DashGetMoney.com</b></a> {" "} and <a rel="noopener noreferrer" target="_blank" href="https://dashshoutout.com">
            <b>DashShoutOut.com</b>
            </a> to send and receive Dash or messages using just your name!
          </li>
          {/* <li>And <span></span>
            <a rel="noopener noreferrer" target="_blank" href="https://dashgettogether.com">
            <b>DashGetTogether.com</b>
            </a> for a group messenger dapp!
          </li> */}
</ul>
          <ul>
          <li>DashMoney Github Repo - <a rel="noopener noreferrer" target="_blank" href="https://github.com/DashMoney">
            <b>https://github.com/DashMoney</b>
            </a></li>
        {/* <li>DashShoutOut Github Repo - <a rel="noopener noreferrer" target="_blank" href="https://www.dashcentral.org/p/DashMoney-Dapp-Development-June-2023">
            <b>Pending Dash Treasury Proposal - LIVE</b>
            </a></li> */}
            </ul>
          <ul>
          <li>
            <a rel="noopener noreferrer" target="_blank" href="https://dashplatform.readme.io/">
            <b>Dash Platform Developer Documentation</b>
            </a>
          </li>
          <li><a rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=VoQxHhzWhT0">
          <b>DashMoney - Closing Loops (Video)</b>
            </a></li>
        </ul>
      </div>
    );
  }
}
export default Footer;
