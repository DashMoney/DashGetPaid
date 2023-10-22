import React from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import MyStoreItem from "./MyStoreItem";

class MyStore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: '',
      
    };
  }

  handleCategory = (category) =>{
    this.setState({
      selectedCategory: category,
    })
  }

  handleCatBack = ()=> {
    this.setState({
      selectedCategory: '',
    })
  }

  render() {

    //First sort out items that have categories and which do not
    let categoryItems = [];
    let nonCatItems = [];

    this.props.DGPItems.forEach(item =>{
      if(item.category === undefined || item.category === ''){
        nonCatItems.push(item);
      }else{
        categoryItems.push(item);
      }
    })

    // Next create a list of buttons based on the category names
    let categoryNames = categoryItems.map(item =>{
      return item.category
    })

    let setOfCatNames = [...new Set(categoryNames)];

    categoryNames = [...setOfCatNames];

    let categoryButtons = categoryNames.map((category, index) =>
    <Button
    key={index}
    variant="primary"
    onClick={() => {
      this.handleCategory(category);
    }}
  >
    <b>{category}</b>
  </Button>
    );

    // display category above or below items? -> above I think, thought about below to indicate specials but its bad design.

    let itemsToDisplay = [];

    if(this.state.selectedCategory===''){
      itemsToDisplay = nonCatItems;
    }else{
      itemsToDisplay = categoryItems.filter(item =>{
        return item.category === this.state.selectedCategory;
      })
    }

    let items = itemsToDisplay.map(
      (item, index) => {  
        //console.log(item);
        return (
          <MyStoreItem
          key={index}
          mode={this.props.mode}
          index={index}
          item = {item}
          handleSelectedItem={this.props.handleSelectedItem}
          />
        )
      }
    );

    return (
      <>
        {this.props.identityInfo === "" ||
        this.props.identityInfo.balance >= 500000000 ? (
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

{this.props.LoadingStore? (
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

        {/* {this.props.DGPStore.length === 0 ?

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
} */}

        {this.props.DGPStore === "No Store" && !this.props.LoadingStore ? (
          <div className="d-grid gap-2" id="button-edge">
            <Button
              variant="primary"
              onClick={() => {
                this.props.showModal("CreateStoreModal");
              }}
            >
              <b>Create New Store/Menu</b>
            </Button>
          </div>
        ) : (
          <></>
        )}

        {/* Store name, description, open or close (collapsible) */}

        {this.props.DGPStore !== "No Store" && !this.props.LoadingStore ? (
          <>
          <div id="bodytext">
          <div className="cardTitle">
          <h2>{this.props.uniqueName}</h2>
          <span>{this.props.DGPStore[0].public?<b>Public</b>:<b>Private</b>}</span>
          <Button variant="primary"
          onClick={() => this.props.showModal("StoreStatusModal")}
              >
              {this.props.DGPStore[0].open?<b>Open</b>:<b>Closed</b>}</Button>

              <span></span>
          </div>
          <p></p>
          <p>
          {this.props.DGPStore[0].description}
          </p>
            {/* <Card id="card" bg={cardBkg} text={cardText}>
              <Card.Body>
                <Card.Title className="cardTitle">
                  <b className="addSpaceRight">
                    <h4>{this.props.uniqueName}</h4>
                  </b>
                  <Button>{this.props.DGPStore[0].open?'Open':'Closed'}</Button>
                </Card.Title>

                <Card.Text>{this.props.DGPStore[0].description}</Card.Text>
                <Button>Edit Store</Button>
              </Card.Body>
            </Card> */}
<p></p>
<div className="cardTitle">
            <h3>Store/Menu Items</h3>
            <Button variant="primary"
            onClick={() => this.props.showModal("CreateItemModal")}
            ><b>Add Item</b>
            </Button>
            </div>

            {/* <div className="d-grid gap-2"></div> */}
            {this.props.LoadingItems? (
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

          {this.props.DGPItems.length === 0?
        <>
        <p></p>(This is where your items will appear)</>:
        <></>}
<p></p>
        <div id="cardtext">
            {this.state.selectedCategory === ''?
            <div className="d-grid gap-2" id="button-edge">
              {categoryButtons}
            </div>
            :
            <div className="categoryTitle">
            <Button
            variant="primary"
            onClick={() => {
              this.handleCatBack();
            }}
            ><b>Back</b></Button>
            
            <h3 className="spaceLeft"><b>{this.state.selectedCategory}</b></h3>
            
            </div>}
            
          {items}
        </div>

            </div>
          </>
        ) : (
          <></>
        )}

      </>
    );
  }
}

export default MyStore;
