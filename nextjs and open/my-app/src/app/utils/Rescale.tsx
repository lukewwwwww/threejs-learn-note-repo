class Rescaler {
    static rescale(
      details: Map<string, [number, number, number][]>,
      centerCoord: number[]
    ) {
      const detailsValuesArray = Array.from(details.values()).flat().flat();
      const absoluteValuesArray = detailsValuesArray.map((value) =>
        Math.abs(value)
      );
      const largestNum = Math.max(...absoluteValuesArray);
  
      const detailsArray = Array.from(details);
  
      let scaleOffset = 0.0025 * window.screen.height;
      const detailsRescaled = new Map(
        detailsArray.map(([key, coords]) => {
          return [
            key,
            coords.map((coord) => {
              return [
                ((coord[0] - centerCoord[0]) / largestNum) * scaleOffset,
                ((coord[1] - centerCoord[1]) / largestNum) * scaleOffset,
                ((coord[2] - centerCoord[2]) / largestNum) * scaleOffset,
              ] as [number, number, number];
            }),
          ];
        })
      );
  
      return detailsRescaled;
    }
  }
  
  export const rescale = Rescaler.rescale.bind(Rescaler);