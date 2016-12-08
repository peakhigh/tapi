//TODO:: use singleton class 
class Constants {
  constructor() {
    this.CONFIG_KEY_SEPERATOR = '#';
    this.CONFIG_KEY_FORM_PREFIX = 'Form';
    this.CONFIG_KEY_GRID_PREFIX = 'Grid';
    this.CONFIG_KEY_DB_PREFIX = 'DB';
  }
}

export default (new Constants);