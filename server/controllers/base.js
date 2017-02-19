module.exports = class BaseModel {
  constructor(options) { 
    this.Model = options.model;

    this.create = (req, res, next) => {       
      const entry = new this.Model(req.body.entry);
    
      entry.saveAsync()
         .then((savedEntry) => res.json(savedEntry))
         .error((e) => next(e));
   };

   this.list = (req, res, next) => { 
      console.log('user......', req.user);
      const { limit = 50, skip = 0 } = req.query;
      this.Model.list({ limit, skip }).then((entries) =>	res.json(entries))
         .error((e) => next(e));
   };
  }  
};