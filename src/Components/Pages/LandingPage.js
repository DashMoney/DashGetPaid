import React from "react";
import Carousel from "react-bootstrap/Carousel";

import Button from "react-bootstrap/Button";

import DGPDark1 from "../../Images/IMG_1555.jpg";
import DGPDark2 from "../../Images/IMG_1557.jpg";
import DGPDark3 from "../../Images/IMG_1559.jpg";
import DGPDark4 from "../../Images/IMG_1561.jpg";
import DGPDark5 from "../../Images/IMG_1563.jpg";
import DGPDark6 from "../../Images/IMG_1565.jpg";
import DGPDark7 from "../../Images/IMG_1569.jpg";
import DGPDark8 from "../../Images/IMG_1570.jpg";
import DGPDark9 from "../../Images/IMG_1572.jpg";

import DGPLight1 from "../../Images/IMG_1556.jpg";
import DGPLight2 from "../../Images/IMG_1558.jpg";
import DGPLight3 from "../../Images/IMG_1560.jpg";
import DGPLight4 from "../../Images/IMG_1562.jpg";
import DGPLight5 from "../../Images/IMG_1564.jpg";
import DGPLight6 from "../../Images/IMG_1566.jpg";
import DGPLight7 from "../../Images/IMG_1568.jpg";
import DGPLight8 from "../../Images/IMG_1571.jpg";
import DGPLight9 from "../../Images/IMG_1573.jpg";

import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Figure from "react-bootstrap/Figure";

import "./LandingPage.css";

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      response: {},
      copiedMnemonic: false,
      //I dont think I need this
    };
  }
  render() {
    return (
      <>
        {/* <h4 id="title-bar">
          <b>DashGetPaid is a Dash Platform Marketplace</b>
        </h4> */}

        <h4 id="title-bar">
          <b>A Dash marketplace where any user can be a merchant!</b>
        </h4>

        {/* <h3>
          <Badge bg="primary">Purpose of DashShoutOut</Badge>
        </h3> */}
        
        {/* <div className="heading-shift">
          <p>
            <b>
              Any Dash user can be a merchant and anyone can purchase directly
              from them with Dash!
            </b>
          </p>
           To showcase a simple message board Dapp and an actual implementation of Dash Platform's Data Contracts and Documents with a social aspect.
           <ul>
            <li>
              <p>
                 To assist in "Closing the Loop" and building the network effect for the Dash ecosystem, the user network should utilize the Dash Platform. That is what DashShoutOut hopes to achieve and may it be one of many to do so.
              </p>
            </li>
          </ul> 
        </div> */}

        <div className="loginButton">
        <div className="d-grid gap-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => this.props.showModal("ConnectWalletModal")}
              >
                <b>Connect Wallet</b>
              </Button>
            </div>
            </div>
            <p></p>

        {this.props.mode === "dark" ? (
          <Carousel>
            <Carousel.Item>
              <Container>
                <Row>
                  <Col xs={2} md={4}></Col>
                  <Col xs={8} md={4} className="positionCaption">
                    <div className="positionCaption">
                      <Image
                        fluid
                        rounded
                        id="dash-landing-page"
                        src={DGPDark1}
                        alt="DGP Landing Page Preview"
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
                        fluid
                        rounded
                        id="dash-landing-page"
                        src={DGPDark2}
                        alt="DGP Landing Page Preview"
                      />
                      <p></p>
                      <Figure.Caption className="figureCaption">
                        <b>Store Selection - Preview</b>
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
                        fluid
                        rounded
                        id="dash-landing-page"
                        src={DGPDark3}
                        alt="DGP Landing Page Preview"
                      />
                      <p></p>
                      <Figure.Caption className="figureCaption">
                        <b>Store Categories - Preview</b>
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
                        fluid
                        rounded
                        id="dash-landing-page"
                        src={DGPDark4}
                        alt="DGP Landing Page Preview"
                      />
                      <p></p>
                      <Figure.Caption className="figureCaption">
                        <b>Selected Category - Preview</b>
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
                        fluid
                        rounded
                        id="dash-landing-page"
                        src={DGPDark5}
                        alt="DGP Landing Page Preview"
                      />
                      <p></p>
                      <Figure.Caption className="figureCaption">
                        <b>Cart Item - Preview</b>
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
                        fluid
                        rounded
                        id="dash-landing-page"
                        src={DGPDark6}
                        alt="DGP Landing Page Preview"
                      />
                      <p></p>
                      <Figure.Caption className="figureCaption">
                        <b>Cart Items - Preview</b>
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
                        fluid
                        rounded
                        id="dash-landing-page"
                        src={DGPDark7}
                        alt="DGP Landing Page Preview"
                      />
                      <p></p>
                      <Figure.Caption className="figureCaption">
                        <b>Placing Order - Preview</b>
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
                        fluid
                        rounded
                        id="dash-landing-page"
                        src={DGPDark8}
                        alt="DGP Landing Page Preview"
                      />
                      <p></p>
                      <Figure.Caption className="figureCaption">
                        <b>Order Success - Preview</b>
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
                        fluid
                        rounded
                        id="dash-landing-page"
                        src={DGPDark9}
                        alt="DGP Landing Page Preview"
                      />
                      <p></p>
                      <Figure.Caption className="figureCaption">
                        <b>Customer Orders - Preview</b>
                      </Figure.Caption>
                    </div>
                  </Col>
                  <Col xs={2} md={4}></Col>
                </Row>
              </Container>
            </Carousel.Item>
          </Carousel>
        ) : (
          <Carousel>
            <Carousel.Item>
              <Container>
                <Row>
                  <Col xs={2} md={4}></Col>
                  <Col xs={8} md={4} className="positionCaption">
                    <div className="positionCaption">
                      <Image
                        fluid
                        rounded
                        id="dash-landing-page"
                        src={DGPLight1}
                        alt="DGP Landing Page Preview"
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
                        fluid
                        rounded
                        id="dash-landing-page"
                        src={DGPLight2}
                        alt="DGP Landing Page Preview"
                      />
                      <p></p>
                      <Figure.Caption className="figureCaption">
                        <b>Store Selection - Preview</b>
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
                        fluid
                        rounded
                        id="dash-landing-page"
                        src={DGPLight3}
                        alt="DGP Landing Page Preview"
                      />
                      <p></p>
                      <Figure.Caption className="figureCaption">
                        <b>Store Categories - Preview</b>
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
                        fluid
                        rounded
                        id="dash-landing-page"
                        src={DGPLight4}
                        alt="DGP Landing Page Preview"
                      />
                      <p></p>
                      <Figure.Caption className="figureCaption">
                        <b>Selected Category - Preview</b>
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
                        fluid
                        rounded
                        id="dash-landing-page"
                        src={DGPLight5}
                        alt="DGP Landing Page Preview"
                      />
                      <p></p>
                      <Figure.Caption className="figureCaption">
                        <b>Cart Item - Preview</b>
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
                        fluid
                        rounded
                        id="dash-landing-page"
                        src={DGPLight6}
                        alt="DGP Landing Page Preview"
                      />
                      <p></p>
                      <Figure.Caption className="figureCaption">
                        <b>Cart Items - Preview</b>
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
                        fluid
                        rounded
                        id="dash-landing-page"
                        src={DGPLight7}
                        alt="DGP Landing Page Preview"
                      />
                      <p></p>
                      <Figure.Caption className="figureCaption">
                        <b>Placing Order - Preview</b>
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
                        fluid
                        rounded
                        id="dash-landing-page"
                        src={DGPLight8}
                        alt="DGP Landing Page Preview"
                      />
                      <p></p>
                      <Figure.Caption className="figureCaption">
                        <b>Order Success - Preview</b>
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
                        fluid
                        rounded
                        id="dash-landing-page"
                        src={DGPLight9}
                        alt="DGP Landing Page Preview"
                      />
                      <p></p>
                      <Figure.Caption className="figureCaption">
                        <b>Customer Orders - Preview</b>
                      </Figure.Caption>
                    </div>
                  </Col>
                  <Col xs={2} md={4}></Col>
                </Row>
              </Container>
            </Carousel.Item>
          </Carousel>
        )}

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
