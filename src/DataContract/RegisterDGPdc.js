//THIS IS THE DashGetPaid - DATA CONTRACT

const Dash = require('dash');

const clientOpts = {
  network: 'testnet',
  
  wallet: {
    mnemonic: '', // <- Your Mnemonic
    
    unsafeOptions: {
      skipSynchronizationBeforeHeight: 853000, //<- CHANGES
      
    },
  },
};

const client = new Dash.Client(clientOpts);

const registerContract = async () => {
  const { platform } = client;
  const identity = await platform.identities.get(
    ''// <- Your Identity Id to your mnemonic
  );


  const contractDocuments = {
    dgpstore: {
      type: 'object',
      indices: [
        {
          name: 'ownerId',
          properties: [{ $ownerId: 'asc' }],
          unique: false,
        }
      ],
      properties: {
        description: { 
          type: 'string',
          minLength: 1,
          maxLength: 250,
        },
        open:{
          type: 'boolean'
        },
        //https://github.com/dashpay/dips/blob/master/dip-0015.md#the-profile
        // image:{
        // }
        
      },
      required: ['description','open', "$createdAt", "$updatedAt"],
      additionalProperties: false,
    },
    dgpitem: {
      type: 'object',
      indices: [
        {
          //This is getting a store's items
          name: 'ownerId',
          properties: [{ $ownerId: 'asc' }],
          unique: false,
        },
        
      ],
      properties: {
        name:{
          type: 'string',
          minLength: 1,
          maxLength: 32,
        },
        price: { //this will be priced in duffs but will have Dash, mDash for display
          type: 'integer',
          minimum: 0,
          maximum: 1800000000000000,
           
        },
        description: { 
          type: 'string',
          minLength: 1,
          maxLength: 250,
        },
        avail:{
          type: 'boolean'
        },
      },
      required: ['name', 'price','avail', "$createdAt", "$updatedAt"],
      additionalProperties: false,
    },
    dgporder: {
      type: 'object',
      indices: [
        {//This is BUYER QUERY
          name: 'ownerIdAndtimeStamp',
          properties: [{ $ownerId: 'asc' }, { timeStamp: 'asc' }],
          unique: false,
        },        
        { //This is MERCHANT QUERY
          name: 'toIdandtimeStamp',
          properties: [{ toId: 'asc' }, { timeStamp: 'asc' }],
          unique: false,
        },
        { //This is Active Orders QUERY 
          name: 'timeStamp',
          properties: [{ timeStamp: 'asc' }],
          unique: false,
        }
      ],
      properties: {
        comment: { 
          type: 'string',
          minLength: 1,
          maxLength: 250,
        },
        timeStamp: {
          type: 'integer',
          minimum: 0,
          maximum: 2546075019551, 
        },
        //https://github.com/dashpay/platform/blob/v0.25-dev/packages/js-dpp/schema/dataContract/dataContractMeta.json

        //https://github.com/dashpay/platform/blob/v0.25-dev/packages/js-dpp/schema/document/documentBase.json

        //https://stackoverflow.com/questions/34334376/json-schema-for-array-of-tuples

        //https://json-schema.org/understanding-json-schema/reference/array.html#id7 
        

        cart:{ //array of tuples(dgpitem(docId),quantity)
          type: 'array', 
          minItems: 1,
          maxItems: 20,
          items: { //This defines the tuple
              type: 'array',
              minItems: 2, 
              maxItems: 2, 
              prefixItems: [{ //This the tuple
                type: 'array',
                byteArray: true,
                minItems: 32,
                maxItems: 32,
                contentMediaType: 'application/x.dash.dpp.identifier',
              },{
                type: 'integer',
                 minimum: 1,
                 maximum: 1000000, 
              }],
              items: false
            },
        },
        toId: { //This is the Merchant ownerId
          type: 'array',
          byteArray: true,
          minItems: 32,
          maxItems: 32,
          contentMediaType: 'application/x.dash.dpp.identifier',
        },
        txId:{ 
          type: 'string',
          minLength: 64,
          maxLength: 64,
        } 
      },
      required:['timeStamp','cart','toId','txId',"$createdAt", "$updatedAt"], 
      additionalProperties: false,
    },

    dgpmsg: {
      type: 'object',
      indices: [      
        {
          name: 'orderIdandtimeStamp',
          properties: [{orderId: 'asc' }, {timeStamp: 'asc' }],
          unique: false,
        }
      ],
      properties: {
        timeStamp: {
          type: 'integer',
          minimum: 0,
          maximum: 2546075019551,
           
        },
        msg: {
          type: 'string',
          minLength: 1,
          maxLength: 250,
        },
        orderId: {
          type: 'array',
          byteArray: true,
          minItems: 32,
          maxItems: 32,
          contentMediaType: 'application/x.dash.dpp.identifier',
        },
      },
      required: ['timeStamp', 'msg','orderId', "$createdAt", "$updatedAt"], 
      additionalProperties: false,
    },
  };


  const contract = await platform.contracts.create(contractDocuments, identity);
  console.dir({ contract: contract.toJSON() });


  const validationResult = await platform.dpp.dataContract.validate(contract);

  if (validationResult.isValid()) {
    console.log('Validation passed, broadcasting contract..');
    // Sign and submit the data contract
    return platform.contracts.publish(contract, identity);
  }
  console.error(validationResult); // An array of detailed validation errors
  throw validationResult.errors[0];
};

registerContract()
  .then((d) => console.log('Contract registered:\n', d.toJSON()))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect());
