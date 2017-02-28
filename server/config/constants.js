//TODO:: use singleton class 
class Constants {
  constructor() {
    this.CONFIG_KEY_SEPERATOR = '#';
    this.CONFIG_KEY_FORM_SUFFIX = 'Form';
    this.CONFIG_KEY_GRID_SUFFIX = 'Grid';
    this.CONFIG_KEY_DB_SUFFIX = 'DB';
    this.CONFIG_KEY_SERVICE_SUFFIX = 'Service';
    this.DEFAULT_PAGE_SIZE = 5;
  }
}

module.exports = (new Constants);