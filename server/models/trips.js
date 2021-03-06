let BaseSchemaFactory = require('./base');
// import globals from '../utils/globals';
const utils = require('../utils/util');
// import tripsTrucks from '../applicationsConfig/trips_trucks.js';
let cache = require('../utils/cache');
const schemaUtils = require('../utils/schema');
const schemaTypeUtils = require('../utils/schema-types');
const uiTypes = require('../utils/ui-types');

let Schema = require('mongoose').Schema;

// console.log(cache.TRIPS_TRUCKS);
const CurrentSchema = new BaseSchemaFactory({ 
   collection: 'Trips',   
   schema: {
      status: {
         type: Schema.Types.String, //enum new, pending, ..
         enum: ['New', 'Quoted', 'PaymentPending', 'PaymentMade', 'PaymentReceived', 'Approved', 
          'Waiting for assignment', 'Running', 
         'Cancelled', 'Successful', 'Assigned'],
         default: 'New'
      },
      expectedTripCost: {
         type: Schema.Types.Number
      },
      maxTripCost: {
         type: Schema.Types.Number
      },
      receiverTinNumber: {
         type: Schema.Types.String
      },
      senderTinNumber: {
         type: Schema.Types.String
      },
      receiverServiceTaxNumber: {
         type: String
      },      
      senderServiceTaxNumber: {
         type: Schema.Types.String
      },
      truckDetails: {
         type: Object //read only ( dump the truck details at the time of assignment)
      },
      currentPoint: {
         type: Schema.Types.String //location of truck if status is running
      },
      finalTripCost: {
         type: Schema.Types.Number
      },       
      paymentsReceived: schemaUtils.spend(true),        
      quotes: {
         quotetype: {
            type: Schema.Types.String,
            enum: ['Flat', 'Tons'],
            html: {               
               form: {
                  type: 'select'
               }
            }  
         },
         costPerTon: {
            type: Schema.Types.Number
         },
         loadingPerTon: {
            type: Schema.Types.Number
         },
         unloadingPerTon: {
            type: Schema.Types.Number
         },
         cost: {
            type: Schema.Types.Number
         },
         userId: {
            type: Schema.Types.ObjectId
         },
         userRole: {
            type: Schema.Types.String
         },  
         defaultQuoteForPeriod: {
            type: Schema.Types.String
         },  
         payAllLater: {
            type: Schema.Types.String
         },     
         startDate: schemaTypeUtils.date(false, {
            title: 'Start Date'
         }),
         endDate: schemaTypeUtils.date(false, {
            title: 'End Date'
         }),
         comment: schemaTypeUtils.description()
      },
      tripAdmin:{
         userId: {
            type: Schema.Types.ObjectId
         },
         totalAmount: {
            type: Schema.Types.Number
         }, 
         balanceAmount: {
            type: Schema.Types.Number
         },   
         status: {
            type: Schema.Types.String,
            enum: ['ReceivedAll', 'Pending']
         } 
      },
      truckAdmin:{
         userId: {
            type: Schema.Types.ObjectId
         },
         totalAmount: {
            type: Schema.Types.Number
         }, 
         balanceAmount: {
            type: Schema.Types.Number
         },    
         status: {
            type: Schema.Types.String,
            enum: ['PaidAll', 'Pending']
         } 
      },
     /*  paymentInfo: {
         amountTotal: {
            type: Schema.Types.String
         },
         duedate: schemaTypeUtils.date(false, {
            title: 'Date & Time'
         }),
         status: {
            type: Schema.Types.String,
            enum: ['Paid', 'Received', 'Pending', 'PendingPayments', 'PendingReceivable'],
            default: 'Pending'
         },
         paymentlog:[{
         amountPaid: {
            type: Schema.Types.Number,
            required: true
         },
         modeOfPayment: {
            type: Schema.Types.String,
            required: true,
            enum: ['Online', 'BankDeposit'],
            html: {               
               form: {
                  type: 'select'
               }
            }  
         },
         dateOfPayment: schemaTypeUtils.date(false, {
            title: 'Date & Time',
            required: true
         }),
         transactionid: {
            type: Schema.Types.String
         },
         referenceDoc: {
            type: Schema.Types.String
         }
      }]}, */
      vehicleRequirements: {
         vehicleType: {
            type: Schema.Types.String, //enum needed -- closed Body, open body,trally, mini truck, auto     
            enum: ['Open Body', 'Closed Body', 'Trally', 'Mini Truck', 'Auto'],
            html: {               
               form: {
                  type: 'select'
               }
            }       
         },         
         requiredCapacity: {
            type: Schema.Types.Number
         },
         capacityUnit: uiTypes.weightUnit(),
         minRating: {
            type: Schema.Types.Number
         },
         vehicleCount: {
            type: Schema.Types.Number
         }
      },    
      totalWeight: {
         type: Schema.Types.Number
      },
      totalWeightUnit: uiTypes.weightUnit(),
      spends: schemaUtils.spend(true), 
      pickup: {                  
         date: schemaTypeUtils.date(false, {
            title: 'Date & Time'
         }),
         address: schemaUtils.address(),                                          
         contact: schemaUtils.contact(true),
         material: {
            name: {
               type: Schema.Types.String
            },
            materialType: uiTypes.materialType(),
            description: schemaTypeUtils.description(),
            weight: {
               type: Schema.Types.Number
            }, 
            weightUnit: uiTypes.weightUnit(),
            approximateCost: {
               type: Schema.Types.Number
            }
         },
         formalities: schemaUtils.tripFormality()         
      },
      drop: {                
         date: schemaTypeUtils.date(false, {
            title: 'Date & Time'
         }), 
         address: schemaUtils.address(),                                  
         contact: schemaUtils.contact(true),
         itemsToDrop: {
            type: [Schema.Types.String] //pickup.material.name array                     
         },
         formalities: schemaUtils.tripFormality()         
      },
      comments: [{
         date: schemaTypeUtils.date(false, {
            title: 'Date & Time',
            required: false
         }),
         commentedby: {
            type: Schema.Types.String
         },
         comment: {
            type: Schema.Types.String,
            html: {
               form: {
                  items: {
                     type: 'textarea'
                  }               
               }
            }      
         }
      }],
      // comments: schemaTypeUtils.description(false, {
      //    type: [String]
      // }), //schemaUtils.comment(true),
      otherDocs: schemaUtils.tripDoc(true)     
   },
   gridAttributes: ['title']
}); 
// console.log(utils.setObjectProperty('name', {key: 1}).setObjectProperty('age', 20));
module.exports = CurrentSchema.getSchema();