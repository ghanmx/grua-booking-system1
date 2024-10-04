import { insertSampleData } from './utils/insertSampleData';

insertSampleData()
  .then(() => console.log('Sample data setup complete'))
  .catch(error => console.error('Error setting up sample data:', error));