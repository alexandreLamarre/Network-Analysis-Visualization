import AbstractColorGradient from "./AbstractColorGradient";

class PolarColorGradient extends AbstractColorGradient{
    constructor(startColor, endColor, numColors) {
        super(startColor, endColor)
        this.numColors = numColors
        this.colorGradient = [];

        //parse input colors
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

        if(this.numColors === 1) {
            this.colorGradient = [this.numsToHex(startColor)]
        } else{
            this.createColorGradient(startColor, endColor)
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

    /**
     * constructor method for generating the color gradient. requires this.numColors > 1
     * @param startColor
     * @param endColor
     */
    createColorGradient(startColor, endColor){
        var [startHue, startSaturation, startLightness] = this.rgbNumsToHSLNums(startColor)
        var [endHue, endSaturation, endLightness] = this.rgbNumsToHSLNums(endColor)
        for(let i = 0; i < this.numColors; i++){
            const t = i/(this.numColors-1); //we have already assumed by calling this
            const newHue = this.lerp(startHue, endHue, t)
            const newSaturation = this.lerp(startSaturation, endSaturation, t)
            const newLightness = this.lerp(startLightness, endLightness, t)
            const rgb = this.HSLNumsToRGBNums(newHue, newSaturation, newLightness);
            this.colorGradient.push(this.numsToHex(rgb))
        }

        if(this.colorGradient.length !== this.numColors) {
            throw new Error("Did not generate the correct amount of colors", this.colorGradient.length, "versus", this.numColors);
        }
    }

}

export default PolarColorGradient;