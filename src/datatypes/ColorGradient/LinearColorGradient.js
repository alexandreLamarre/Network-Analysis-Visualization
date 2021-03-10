import AbstractColorGradient from "./AbstractColorGradient";

class LinearColorGradient extends AbstractColorGradient{
    constructor(startColor, endColor, numColors){
        super(startColor, endColor)
        this.numColors = numColors
        if(startColor === endColor) this.numColors = 1

        if(this.isValidRGB(startColor)){
            startColor = this.rgbToNums(startColor)
        } else if(this.isValidHexString(startColor)){
            startColor = this.hexToNums(startColor)
        } else{
            throw new Error("Cannot recognize start color: neither hex nor rgb")
        }

        if(this.isValidRGB(endColor)){
            endColor = this.rgbToNums(endColor)
        } else if(this.isValidHexString(endColor)){
            endColor = this.hexToNums(endColor)
        } else{
            throw new Error("Cannot recognize start color: neither hex nor rgb")
        }

        this.colorGradient = []
        if(this.numColors === 1) {
            this.colorGradient.push(this.numsToHex(startColor))
        } else{
            for(let i = 0; i < numColors; i ++){
                const t = i/(numColors-1)
                const newRed = parseInt(this.lerp(startColor[0], endColor[0], t))
                const newGreen = parseInt(this.lerp(startColor[1], endColor[1], t))
                const newBlue = parseInt(this.lerp(startColor[2], endColor[2], t));
                this.colorGradient.push(this.numsToHex([newRed,newGreen, newBlue]))
            }
        }
    }
    /**
     *  Gets the color for a given networkDataType and applies a linear gradient along start color to end color
     *  given its degree and its relative distance from minRange/maxRange
     * @param networkDataType the networkDataType whose color we want to set
     * @param minDegree the minimum degree of the network
     */
    getColorGradientColor(networkDataType, minDegree){
        if(this.colorGradient.length === 1){
            return this.colorGradient[0]
        } else{
            const degree = networkDataType.degree
            if(degree -minDegree > this.numColors) throw new Error("Not enough colors to use for degree ", degree)
            return this.colorGradient[degree -minDegree];
        }

    }
}

export default LinearColorGradient;