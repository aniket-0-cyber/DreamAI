// src/sample-files/deep-clone.ts

function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
  
    if (obj instanceof Date) {
      return new Date(obj.getTime()) as any;
    }
  
    if (obj instanceof Array) {
      const arrCopy = [] as any[];
      obj.forEach((_, i) => {
        arrCopy[i] = deepClone(obj[i]);
      });
      return arrCopy as any;
    }
  
    if (obj instanceof Object) {
      const objCopy = {} as { [key: string]: any };
      Object.keys(obj).forEach(key => {
        objCopy[key] = deepClone((obj as { [key: string]: any })[key]);
      });
      return objCopy as any;
    }
  
    throw new Error("Unable to copy obj! Its type isn't supported.");
  }
  
  export default deepClone; 