

const Dash = require('dash');

const clientOpts = {
  network: 'testnet',
  
  wallet: {
    mnemonic: 'Put 12 word mnemonic here..', // <- CHECK
    
    unsafeOptions: {
      skipSynchronizationBeforeHeight: 900000, //<- CHANGE*********
      
    },
  },
};

const client = new Dash.Client(clientOpts);

const registerContract = async () => {
  const { platform } = client;
  const identity = await platform.identities.get(
    'Put the identity id for the mnemonic here..'  // <- CHECK
  );

  
  /* 1)
  { //DGM From others payment OR request Msgs
    where: [
      ['toId', '==' ,****YourOwnerIdString***],
      ['$createdAt', '<=' , Date.now()] 
    ],
    orderBy: [
    ['$createdAt', 'asc'],
  ],
  }*/

  /* 2)
  { //DGM My Payment Msgs
    where: [
      ['$ownerId', '==', ****YourOwnerIdString***],
      ['$createdAt', '<=' , Date.now()]
    ],
    orderBy: [
    ['$createdAt', 'asc'],
  ],
  }
  */


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
        description: { //Why is the description required? mainly bc no image so need a differenciator
          type: 'string',
          minLength: 1,
          maxLength: 350,
        },
        public:{ 
          type: 'boolean'
        },
        open:{
          type: 'boolean'
        },
        payLater:{
          type: 'boolean'
        },
        acceptCredits:{
          type: 'boolean'
        },
        acceptDash:{
          type: 'boolean'
        },

        //https://github.com/dashpay/dips/blob/master/dip-0015.md#the-profile
        // image:{ //FUTURE POSSIBILITIES...
        // }
        
      },
      required: ['description','public','open','payLater','acceptCredits','acceptDash', "$createdAt", "$updatedAt"],
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
        { //This is Active Orders QUERY
          name: 'createdAt',
          properties: [{ $createdAt: 'asc' }],
          unique: false,
         }
        //, //MUST **REQUIRE** TO USE AS INDEX!! <= LEARNED SOMETHING!!
        // { //This is to ensure txId uniqueness and no duplicates
        //   name: 'txId',
        //   properties: [{ txId: 'asc' }],
        //   unique: true,
        // }
      ],
      properties: {
        comment: { 
          type: 'string',
          minLength: 1,
          maxLength: 350,
        },
        

        cart: {
          type: 'string',
          maxLength: 1200, 
        }, 
        toId: { //This is the Merchant ownerId
          type: 'array',
          byteArray: true,
          minItems: 32,
          maxItems: 32,
          contentMediaType: 'application/x.dash.dpp.identifier',
        },

        txId:{ //ALSO WANT THIS TO BE IMMUTABLE...? INDICES ARE REQUIRED..
          type: 'string',
          minLength: 64,
          maxLength: 64,
        } 
      },
      required:['cart','toId',"$createdAt", "$updatedAt"], //txId Optional => for future order and payment separation
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
          maxLength: 350,
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
