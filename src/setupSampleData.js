import { resetAndInsertSampleData } from './utils/insertSampleData';

resetAndInsertSampleData()
  .then(() => console.log('Database reset and sample data setup complete'))
  catch(error => console.error('Error resetting database and setting up sample data:', error));