import BaseSchemaFactory from './base';
// import globals from '../utils/globals';
import utils from '../utils/util';
// import tripsTrucks from '../applicationsConfig/trips_trucks.js';
import cache from '../utils/cache';
import schemaUtils from '../utils/schema';
let Schema = require('mongoose').Schema;

// console.log(cache.TRIPS_TRUCKS);
const CurrentSchema = new BaseSchemaFactory({ 
   collection: 'Trips',   
   schema: {
      status: {
         type: String //enum new, pending, ..
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
         comment: {
            type: String
         }
      },
      vehicleRequirements: {
         vechicleType: {
            type: String //enum needed -- closed Body, open body,trally, mini truck, auto
         },
         minRating: {
            type: Number
         },
         minCapacity: {
            type: Number
         }         
      },    
      totalWeight: {
         type: Number
      },
      spends: schemaUtils.spend(true), 
      pickup: [{
         date: {
            type: Date     
         },         
         address: schemaUtils.address(),                                 
         contact: schemaUtils.contact(true),
         material: [{
            name: {
               type: String
            },
            materialType: {
               type: String     
            },
            description: {
               type: String
            },
            weight: {
               type: Number
            }, 
            weightUnit: {
               type: Number
            },
            approximateCost: {
               type: Number
            }
         }],
         formalities: schemaUtils.tripFormality()         
      }], 
      drop: [{
         date: {
            type: Date     
         },        
         address: schemaUtils.address(),                         
         contact: schemaUtils.contact(true),
         itemsToDrop: {
            type: [String] //pickup.material.name array
         },
         formalities: schemaUtils.tripFormality()         
      }],
      comments: schemaUtils.comment(true),
      otherDocs: schemaUtils.tripDoc(true)     
   },
   gridAttributes: ['title']
}); 
// console.log(utils.setObjectProperty('name', {key: 1}).setObjectProperty('age', 20));
export default CurrentSchema.getSchema();