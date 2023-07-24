import React from "react";
import Carousel from 'react-bootstrap/Carousel';
import Badge from "react-bootstrap/Badge";
import DGPCustomerFindMerchant from "../../Images/IMG_1543.jpg";
import DGPSlide2 from "../../Images/IMG_1544.jpg";
import DGPSlide3 from "../../Images/IMG_1545.jpg";
import DGPSlide4 from "../../Images/IMG_1546.jpg";
import DGPSlide7 from "../../Images/IMG_1538.jpg";
import DGPSlide5 from "../../Images/IMG_1532.jpg";
import DGPSlide6 from "../../Images/IMG_1533.jpg";
import Image from "react-bootstrap/Image";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Figure from 'react-bootstrap/Figure';

import "./LandingPage.css";

class LandingPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      response : {},
      copiedMnemonic: false,
      //I dont think I need this
    }
  }
  render() {
    return (
      <>
      
      <h4 id="title-bar">
          <b>DashGetPaid is a Dash Platform Marketplace</b>
        </h4>
        {/* <h3>
          <Badge bg="primary">Purpose of DashShoutOut</Badge>
        </h3> */}
        <div className="heading-shift">
          <p>
            <b>Any Dash user can be a merchant and anyone can purchase directly from them with Dash!
            </b> 
          </p>
          {/* To showcase a simple message board Dapp and an actual implementation of Dash Platform's Data Contracts and Documents with a social aspect. */}
          {/* <ul>
            <li>
              <p>
                 To assist in "Closing the Loop" and building the network effect for the Dash ecosystem, the user network should utilize the Dash Platform. That is what DashShoutOut hopes to achieve and may it be one of many to do so.
              </p>
            </li>
          </ul> */}
        </div>

        <Carousel>
      <Carousel.Item>
      <Container>
         <Row>
           <Col xs={2} md={4}></Col>
           <Col xs={8} md={4} className="positionCaption">
           <div className="positionCaption">
         <Image
           fluid  rounded id="dash-landing-page" src={DGPCustomerFindMerchant} alt="DGP Landing Page Preview" 
         />
         <p></p>
         <Figure.Caption className="figureCaption">
           <b>Customer - Preview</b>
            </Figure.Caption>
            </div>
       </Col>
           <Col xs={2} md={4}></Col>
         </Row>
       </Container>
        {/* <img
          className="d-block w-100"
          src={DGPCustomerFindMerchant}
          alt="First slide"
        /> */}
        <Carousel.Caption>
          {/* <h3>First slide label</h3> */}
          {/* <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p> */}
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
      <Container>
         <Row>
           <Col xs={2} md={4}></Col>
           <Col xs={8} md={4} className="positionCaption">
           <div className="positionCaption">
         <Image
           fluid  rounded id="dash-landing-page" src={DGPSlide2} alt="DGP Landing Page Preview" 
         />
         <p></p>
         <Figure.Caption className="figureCaption">
           <b>Customer Shopping - Preview</b>
            </Figure.Caption>
            </div>
       </Col>
           <Col xs={2} md={4}></Col>
         </Row>
       </Container>
        
      </Carousel.Item>

      <Carousel.Item>
      <Container>
         <Row>
           <Col xs={2} md={4}></Col>
           <Col xs={8} md={4} className="positionCaption">
           <div className="positionCaption">
         <Image
           fluid  rounded id="dash-landing-page" src={DGPSlide3} alt="DGP Landing Page Preview" 
         />
         <p></p>
         <Figure.Caption className="figureCaption">
           <b>Customer Cart - Preview</b>
            </Figure.Caption>
            </div>
       </Col>
           <Col xs={2} md={4}></Col>
         </Row>
       </Container>
        
      </Carousel.Item>

      <Carousel.Item>
      <Container>
         <Row>
           <Col xs={2} md={4}></Col>
           <Col xs={8} md={4} className="positionCaption">
           <div className="positionCaption">
         <Image
           fluid  rounded id="dash-landing-page" src={DGPSlide4} alt="DGP Landing Page Preview" 
         />
         <p></p>
         <Figure.Caption className="figureCaption">
           <b>Customer Order - Preview</b>
            </Figure.Caption>
            </div>
       </Col>
           <Col xs={2} md={4}></Col>
         </Row>
       </Container>
        
      </Carousel.Item>

      <Carousel.Item>
      <Container>
         <Row>
           <Col xs={2} md={4}></Col>
           <Col xs={8} md={4} className="positionCaption">
           <div className="positionCaption">
         <Image
           fluid  rounded id="dash-landing-page" src={DGPSlide7} alt="DGP Landing Page Preview" 
         />
         <p></p>
         <Figure.Caption className="figureCaption">
           <b>Customer Purchase - Preview</b>
            </Figure.Caption>
            </div>
       </Col>
           <Col xs={2} md={4}></Col>
         </Row>
       </Container>
        
      </Carousel.Item>

      <Carousel.Item>
      <Container>
         <Row>
           <Col xs={2} md={4}></Col>
           <Col xs={8} md={4} className="positionCaption">
           <div className="positionCaption">
         <Image
           fluid  rounded id="dash-landing-page" src={DGPSlide5} alt="DGP Landing Page Preview" 
         />
         <p></p>
         <Figure.Caption className="figureCaption">
           <b>Merchant Store - Preview</b>
            </Figure.Caption>
            </div>
       </Col>
           <Col xs={2} md={4}></Col>
         </Row>
       </Container>
        
      </Carousel.Item>

      <Carousel.Item>
      <Container>
         <Row>
           <Col xs={2} md={4}></Col>
           <Col xs={8} md={4} className="positionCaption">
           <div className="positionCaption">
         <Image
           fluid  rounded id="dash-landing-page" src={DGPSlide6} alt="DGP Landing Page Preview" 
         />
         <p></p>
         <Figure.Caption className="figureCaption">
           <b>Merchant Orders - Preview</b>
            </Figure.Caption>
            </div>
       </Col>
           <Col xs={2} md={4}></Col>
         </Row>
       </Container>
        
      </Carousel.Item>


      {/* <Carousel.Item>
        <img
          className="d-block w-100"
          src="holder.js/800x400?text=Second slide&bg=282c34"
          alt="Second slide"
        />

        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="holder.js/800x400?text=Third slide&bg=20232a"
          alt="Third slide"
        />

        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item> */}
    </Carousel>
        

         {/* <Container>
         <Row>
           <Col xs={2} md={4}></Col>
           <Col xs={8} md={4} className="positionCaption">
           <div className="positionCaption">
          <Image
           fluid  rounded id="dash-landing-page" src={DSOmodified} alt="DSO Landing Page Preview" 
         /> 
         <p></p>
         <Figure.Caption>
           <b>DashGetPaid - Preview</b>
            </Figure.Caption>
            </div>
       </Col>
           <Col xs={2} md={4}></Col>
         </Row>
       </Container> */}
   <p></p>

{/* <div id="bodytext">

        <h3>
          How to Use
          
        </h3>

        <div className="paragraph-shift">
         
            <h6>
              Connect your Wallet at the bottom of your screen, and you can start using DashGetPaid. Login as a buyer and make purchases with Dash, or login as a merchant and get paid in Dash.
            </h6>
<p></p>
            <p>
               If you are new to Dash, you will need a Dash Name from <a rel="noopener noreferrer" target="_blank" href="https://dashgetnames.com/">
            <b>DashGetNames.com</b>
             </a>  (Currently, this is all 
              working on Testnet, so it is not real Dash.)
            </p>
          

        </div> 
      </div>*/}
      </>
    );
  }
}

export default LandingPage;
