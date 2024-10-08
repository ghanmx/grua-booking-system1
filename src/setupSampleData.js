import { resetAndInsertSampleData } from './utils/insertSampleData';

const setupSampleData = async () => {
  try {
    await resetAndInsertSampleData();
    console.log('Database reset and sample data setup complete');
  } catch (error) {
    console.error('Error resetting database and setting up sample data:', error);
  }
};

setupSampleData();