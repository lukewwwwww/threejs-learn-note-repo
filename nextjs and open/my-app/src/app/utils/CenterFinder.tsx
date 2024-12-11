class CenterFinder {
    static findCenter(details: Map<string, [number, number, number][]>) {
      const detailsValuesArray = Array.from(details.values()).flat(2);
      const numPoints = detailsValuesArray.length / 3;
  
      let centerX = 0;
      let centerY = 0;
      let centerZ = 0;
  
      for (let i = 0; i < numPoints; i++) {
        centerX += detailsValuesArray[i * 3];
        centerY += detailsValuesArray[i * 3 + 1];
        centerZ += detailsValuesArray[i * 3 + 2];
      }
  
      centerX /= numPoints;
      centerY /= numPoints;
      centerZ /= numPoints;
  
      const center : [number,number,number] = [centerX, centerY, centerZ];
  
      return center;
    }
  }
  
  export const findCenter = CenterFinder.findCenter.bind(CenterFinder);