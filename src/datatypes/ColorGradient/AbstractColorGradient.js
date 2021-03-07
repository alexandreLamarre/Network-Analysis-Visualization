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



    isValidRGB(str){
        if(!str.startsWith("rgb")) return false
        var vals = str.split("(")[1].split(")")[0];
        vals = vals.split(",")

        return vals.length === 3
    }


    isValidHexString(str){
        if(!str.startsWith("#")) return false

        return str.length === 7
    }

    rgbToNums(str){
        var vals = str.split("(")[1].split(")")[0];
        vals = vals.split(",")
        for(let i = 0; i < vals.length; i++){
            vals[i] = parseInt(vals[i])
        }
        return vals
    }

    hexToNums(str){
        var vals = str.slice(1);
        var num1 = parseInt(vals.slice(0,2),16)
        var num2 = parseInt(vals.slice(2,4), 16)
        var num3 = parseInt(vals.slice(4,6), 16)
        return [num1, num2, num3]
    }

    numsToHex(nums){
        var val = "#"
        for(let i = 0; i < nums.length; i++){
            nums[i] = nums[i].toString(16)
            if(nums[i].length === 1) nums[i] = "0" + nums[i]
            val += nums[i]
        }
        return val
    }

}

export default AbstractColorGradient