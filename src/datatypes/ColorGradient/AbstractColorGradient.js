class AbstractColorGradient{
    constructor(startColor, endColor){
       this.startColor = startColor;
       this.endColor = endColor;
    }

    /**
     * Sets color for a given networkDataType based on the defined gradient algorithm
     * @param networkDataType , the networkDataType whose color we want to set
     * @param additionalInformation data that contains additial information needed for the gradient
     */
    assignColor(networkDataType, additionalInformation){
        if(!networkDataType.hasOwnProperty("color")) throw new Error("Cannot assign a color to a type an " +
                                                                        "object without a color property")
        const color = this.getColorGradientColor(networkDataType, additionalInformation)
        networkDataType.color = color
    }

    /**
     *  Gets the color for a given networkDataType
     * @param networkDataType the networkDataType whose color we want to set
     */
    getColorGradientColor(networkDataType, additionalInformation){
        throw new Error("Cannot get color of an abstract gradient")
    }


    /**
     * Checks if the provided string is a valid rgb color string
     * @param str
     * @returns {boolean}
     */
    isValidRGB(str){
        if(!str.startsWith("rgb")) return false
        var vals = str.split("(")[1].split(")")[0];
        vals = vals.split(",")

        return vals.length === 3
    }

    /**
     * Checks if the provided string is a valid hex color string
     * @param str
     * @returns {boolean}
     */
    isValidHexString(str){
        if(!str.startsWith("#")) return false

        return str.length === 7
    }

    /**
     * Turns an rgb color string to an array of rgb nums. Assums rgb string is valid.
     * @param str the rgb color string
     * @returns {number[]} rgb nums array
     */
    rgbToNums(str){
        var vals = str.split("(")[1].split(")")[0];
        vals = vals.split(",")
        for(let i = 0; i < vals.length; i++){
            vals[i] = parseInt(vals[i])
        }
        return vals
    }

    /**
     * Converts a hex color string to an array of rgb values. Assumes hex string is valid.
     * @param str the hex string to convert
     * @returns {number[]} the rgb number values of the hex string
     */
    hexToNums(str){
        var vals = str.slice(1);
        var num1 = parseInt(vals.slice(0,2),16)
        var num2 = parseInt(vals.slice(2,4), 16)
        var num3 = parseInt(vals.slice(4,6), 16)
        return [num1, num2, num3]
    }

    /**
     * Turns rgb numbers into color hex string. Assumes rgb numbers are valid.
     * @param nums [3]float rgb numbers
     * @returns {string} the hex color string of nums
     */
    numsToHex(nums){
        var val = "#"
        for(let i = 0; i < nums.length; i++){
            nums[i] = nums[i].toString(16)
            if(nums[i].length === 1) nums[i] = "0" + nums[i]
            val += nums[i]
        }
        return val
    }

    /**
     * Turns an array of rgb values to an array of HSL values. Assumes the rgb array is valid.
     * @param rgb array of rgb values
     * @returns {number[]} the array of HSL values [hue, saturation, lightness]
     */
    rgbNumsToHSLNums(rgb){
        const red = rgb[0]/255;
        const green = rgb[1]/255;
        const blue = rgb[2]/255;
        const Cmax = Math.max(...[red, green, blue]);
        const Cmin = Math.min(...[red,green,blue]);
        const delta = Cmax - Cmin;
        const hue = this.calculateHue(delta, Cmax, red, green, blue) % 360
        const lightness = (Cmax + Cmin)/2;
        const saturation = delta === 0 || typeof delta !== "number" || !isFinite(delta) ? 0:
            delta/(1 -Math.abs(2*lightness -1));
        return [hue, saturation, lightness];
    }

    /**
     * Helper function for rgbNumsToHSLNums
     * Returns the hue of a color given a delta and cmax and the respective red,green, blue values of the color
     * @param delta
     * @param Cmax
     * @param red
     * @param green
     * @param blue
     * @returns {number} the hue of the color
     */
    calculateHue(delta, Cmax, red, green, blue){
        if(delta === 0 || typeof delta !== "number" || !isFinite(delta)) return 0;
        if(Cmax === red) return 60*(((green-blue)/delta)%6);
        if(Cmax === green) return 60*((blue-red)/delta+2);
        if(Cmax === blue) return 60*((red- green)/delta + 4);
    }

    /**
     * converts HSL color number values to RGB number values
     * @param hue
     * @param saturation
     * @param lightness
     * @returns {number[]} the rgb array of number values
     */
    HSLNumsToRGBNums(hue, saturation, lightness){
        const C = (1 - Math.abs(2*lightness -1)) * saturation;
        const X = C * (1 - Math.abs(hue/60)%2 -1);
        const m = lightness - C/2;
        const [rPrime, gPrime, bPrime] = this.checkDegrees(hue, C, X)

        return [Math.abs(Math.floor(((rPrime +m) * 255) % 256)),
                Math.abs(Math.floor(((gPrime + m)*255)%256)),
                Math.abs(Math.floor(((bPrime +m)*255)%256))];
    }

    /**
     * helper for HSLNumsToRGBNUms, maps the polar coordinates back to rgb cube coordinates
     * @param hue
     * @param C
     * @param X
     * @returns {number[]} the rgb array of values
     */
    checkDegrees(hue, C, X){
        if((hue >= 0 && hue < 60) || hue === 360) return [C,X,0];
        if(hue >= 60 && hue < 120 ) return [X,C,0];
        if(hue >= 120 && hue < 180 ) return [0, C, X];
        if(hue >= 180 && hue < 240 ) return [0, X, C];
        if(hue >= 240 && hue < 300 ) return [X, 0, C];
        if(hue >= 300 && hue < 360 ) return [C, 0, X];
        return [0,0,0];
    }

    /**
     * Linear interpolation of two values
     * @param start the start value of the linear function
     * @param  end the end value of the linear function
     * @param t the position between start value and end value
     * @ return newValue the value between start and end at position t
     */
    lerp(start, end, t){
        return start + t*(end -start)
    }

}

export default AbstractColorGradient