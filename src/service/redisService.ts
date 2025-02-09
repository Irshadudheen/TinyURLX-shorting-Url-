import { redisClient } from '../config/redis'; 

// Function to set a value in Redis
const setValue = async (key:string, value:string) => {
  try {
    
    await redisClient.set(key, JSON.stringify(value), {
        EX: 86400, 
      });
    console.log(`Set key ${key} in Redis`);
    return key
  } catch (err) {
    console.error(`Error setting value for key ${key}:`, err);
    throw err; 
  }
};

// Function to get a value from Redis
const getValue = async (key:string) => {
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null; 
  } catch (err:any) {
    console.error(`Error getting value for key ${key}:`, err.message);
    throw err; 
  }
};

// Function to delete a value from Redis
const deleteValue = async (key:string) => {
  try {
    await redisClient.del(key);
    console.log(`Deleted key ${key} from Redis`);
  } catch (err) {
    console.error(`Error deleting value for key ${key}:`, err);
    throw err;
  }
};

// Function to check if a key exists in Redis
const exists = async (key:string) => {
  try {
    const exists = await redisClient.exists(key);
    return exists === 1; // Returns 1 if the key exists
  } catch (err) {
    console.error(`Error checking existence of key ${key}:`, err);
    throw err; 
  }
};


export{
  setValue,
  getValue,
  deleteValue,
  exists,
};