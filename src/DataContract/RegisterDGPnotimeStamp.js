//THIS IS THE DGP - REGISTER DATA CONTRACT - no timeStamp

const Dash = require('dash');

const clientOpts = {
  network: 'testnet',
  
  wallet: {
    mnemonic: '', // <- CHECK
    
    unsafeOptions: {
      skipSynchronizationBeforeHeight: 900000, //<- CHANGE*********
      
    },
  },
};

const client = new Dash.Client(clientOpts);

const registerContract = async () => {
  const { platform } = client;
  const identity = await platform.identities.get(
    ''// <- CHECK
  );


  const contractDocuments = {
    dgpstore: {
      type: 'object',
      //Search for My Store (by Merchant) will be by ownerId
      //Search for Store (by Buyer) will be DPNS Doc then MyStore
      indices: [
        {
          name: 'ownerId',
          properties: [{ $ownerId: 'asc' }],
          unique: false,
        }
      ],
      properties: {
        description: { //Why is the description required? mainly bc no image so need a differenciator
          type: 'string',
          minLength: 1,
          maxLength: 250,
        },
        public:{ //New add required true by default no query
          type: 'boolean'
        },
        open:{
          type: 'boolean'
        },
        
        
      },
      required: ['description','public','open', "$createdAt", "$updatedAt"],
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
        price: { //this will be priced in duffs but i will have Dash, mDash for display
          type: 'integer',
          minimum: 0,
          maximum: 1800000000000000,
           
        },
        description: { 
          type: 'string',
          minLength: 1,
          maxLength: 250,
        },
        category: { //THIS IS A NEW THING AND ITS NOT REQUIRED AND NOT QUERY
          type: 'string',
          minLength: 0,
          maxLength: 32,
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
          name: 'ownerIdAndcreatedAt',
          properties: [{ $ownerId: 'asc' }, { $createdAt: 'asc' }],
          unique: false,
        },        
        { //This is MERCHANT QUERY
          name: 'toIdandcreatedAt',
          properties: [{ toId: 'asc' }, { $createdAt: 'asc' }],
          unique: false,
        },
        { //This is Active Orders QUERY (ADDED -> NICE)
          name: 'createdAt',
          properties: [{ $createdAt: 'asc' }],
          unique: false,
        }
      ],
      properties: {
        comment: { 
          type: 'string',
          minLength: 1,
          maxLength: 250,
        },
        
        //https://github.com/dashpay/platform/blob/v0.25-dev/packages/js-dpp/schema/dataContract/dataContractMeta.json

        //https://github.com/dashpay/platform/blob/v0.25-dev/packages/js-dpp/schema/document/documentBase.json

        //https://stackoverflow.com/questions/34334376/json-schema-for-array-of-tuples

        //https://json-schema.org/understanding-json-schema/reference/array.html#id7 
        // ^^^ if the high cost estimate is not reduced then I may have to look into what uniqueness does

        cart:{ //array of tuples(dgpitem(docId),quantity)
          type: 'array', //WILL HAVE TO HANDLE IF BAD DATA ON MERCHANT SIDE
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
      required:['cart','toId','txId',"$createdAt", "$updatedAt"], 
      additionalProperties: false,
    },

    dgpmsg: {
      type: 'object',
      indices: [      
        {
          name: 'orderIdandcreatedAt',
          properties: [{orderId: 'asc' }, {$createdAt: 'asc' }],
          unique: false,
        }
      ],
      properties: {
        
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
      required: [ 'msg','orderId', "$createdAt", "$updatedAt"], 
      additionalProperties: false,
    },
  };

  const contract = await platform.contracts.create(contractDocuments, identity);
  console.dir({ contract: contract.toJSON() });

  
  await platform.contracts.publish(contract, identity);
  return contract;
  
};

registerContract()
  .then((d) => console.log('Contract registered:\n', d.toJSON()))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect());
