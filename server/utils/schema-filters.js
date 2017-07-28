module.exports = { 
   getTripDefaultFilters: () => {   
      return {
         status: { op: '^' }, 
         currentPoint: { op: '^' }, 
         'vehicleRequirements.vechicleType': { op: '^' }, 
         'pickup.address.organisation': { op: '%' }, 
         'pickup.address.address': { op: '%' }, 
         'pickup.address.location': { op: '%' }, 
         'pickup.address.zip': { op: '=' }, 
         'pickup.contact.firstName': { op: '^' },
         'pickup.contact.lastName': { op: '^' }, 
         'pickup.contact.mobile': { op: '=' }, 
         'pickup.contact.email': { op: '^' }, 
         'pickup.contact.alternativePhone': { op: '=' }, 
         'drop.address.organisation': { op: '%' }, 
         'drop.address.address': { op: '%' }, 
         'drop.address.location': { op: '%' }, 
         'drop.address.zip': { op: '=' }, 
         'drop.contact.firstName': { op: '^' }, 
         'drop.contact.lastName': { op: '^' }, 
         'drop.contact.mobile': { op: '=' }, 
         'drop.contact.email': { op: '^' }, 
         'drop.contact.alternativePhone': { op: '=' }
      };
   }
}