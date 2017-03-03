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
         type: String, //enum new, pending, ..
         enum: ['New', 'Process', 'Running', 'Fail', 'Close'],
         default: 'new'
      },
      expectedTripCost: {
         type: Number
      },
      maxTripCost: {
         type: Number
      },
      receiverTinNumber: {
         type: String
      },
      senderTinNumber: {
         type: String
      },
      receiverServiceTaxNumber: {
         type: String
      },      
      senderServiceTaxNumber: {
         type: String
      },
      truckDetails: {
         type: Object //read only ( dump the truck details at the time of assignment)
      },
      currentPoint: {
         type: String //location of truck if status is running
      },
      finalTripCost: {
         type: Number
      },       
      paymentsReceived: schemaUtils.spend(true),        
      quotes: {
         cost: {
            type: Number
         },
         userId: {
            type: Schema.Types.ObjectId
         },
         userRole: {
            type: String
         },
         comment: schemaTypeUtils.description()
      },
      vehicleRequirements: [{
         vechicleType: {
            type: String, //enum needed -- closed Body, open body,trally, mini truck, auto     
            enum: ['Open Body', 'Closed Body', 'Trally', 'Mini Truck', 'Auto'],
            html: {               
               form: {
                  type: 'select'
               }
            }       
         },         
         requiredCapacity: {
            type: Number
         },
         capacityUnit: uiTypes.weightUnit(),
         minRating: {
            type: Number
         }
      }],    
      totalWeight: {
         type: Number
      },
      totalWeightUnit: uiTypes.weightUnit(),
      spends: schemaUtils.spend(true), 
      pickup: [{
         date: schemaTypeUtils.date(false, {
            title: 'Date & Time'
         }),         
         address: schemaUtils.address(),                                 
         contact: schemaUtils.contact(true),
         material: [{
            name: {
               type: String
            },
            materialType: uiTypes.materialType(),
            description: schemaTypeUtils.description(),
            weight: {
               type: Number
            }, 
            weightUnit: uiTypes.weightUnit(),
            approximateCost: {
               type: Number
            }
         }],
         formalities: schemaUtils.tripFormality()         
      }],
      drop: [{
         date: schemaTypeUtils.date(false, {
            title: 'Date & Time'
         }),        
         address: schemaUtils.address(),                         
         contact: schemaUtils.contact(true),
         itemsToDrop: {
            type: [String] //pickup.material.name array                     
         },
         formalities: schemaUtils.tripFormality()         
      }],
      comments: {
         type: [String],
         html: {
            form: {
               items: {
                  type: 'textarea'
               }               
            }
         }      
      },
      // comments: schemaTypeUtils.description(false, {
      //    type: [String]
      // }), //schemaUtils.comment(true),
      otherDocs: schemaUtils.tripDoc(true)     
   },
   gridAttributes: ['title']
}); 
// console.log(utils.setObjectProperty('name', {key: 1}).setObjectProperty('age', 20));
module.exports = CurrentSchema.getSchema();