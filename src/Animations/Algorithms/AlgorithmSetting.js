import React from "react"
import {IonRange, IonItem, IonLabel, IonCheckbox} from "@ionic/react"
import SettingOption from "../../Components/Settings/SettingOption";
import SettingRange from "../../Components/Settings/SettingRange";
import SettingCheckbox from "../../Components/Settings/SettingCheckbox";
/**
 * Setting represents a setting on an algorithm
 */
class AlgorithmSettingObject{
    constructor(obj){
        this.obj = obj
    }

    /**
     * Creates a setting that could take on a range of values
     * @param name the name/label string of the setting
     * @param min minimum value of the range of values
     * @param max maximum value of the range of values
     * @param step the increment the user can change the value by
     * @param value is the initial value of the setting
     * @returns {Setting}
     */
    static newRangeSetting(name, min, max, step, value){
        console.log(name, min, max, step, value)
        console.log(validParameter(name), validParameter(min), validParameter(max),
            validParameter(step), validParameter(value))
        if (!validParameter(name) || !validParameter(min) || !validParameter(max) || !validParameter(step)){
            throw new Error("Invalid parameter provided to new Range setting")
        }
        if (!value){
            value = min
        }
        var s = {type: "range", name: name, min: min, max: max, step:step, value: value}
        return new AlgorithmSettingObject(s)
    }

    /**
     * Creates a new setting that gives the user a choice of string options
     * @param name the name string of the new setting
     * @param options the array of string options
     * @param value the value string of options
     */
    static newOptionSetting(name, options, value){
        if (!validParameter(name) || !validParameter(options)){
            throw new Error("Invalid parameter provided to new Option setting")
        }
        if(options.lengh === 0) throw new Error("No options provided to new Option setting")
        if (!value){
            value = options[0]
        }
        if (!options.includes(value)){
            throw new Error("Initial option provided to new Options setting is not provided in")
        }

        var s = {type: "option", name: name, options: options, value: value}
        return new AlgorithmSettingObject(s)
    }

    /**
     * Creates a new setting that generates a binary setting in the form of a checkbox
     * @param name
     * @param value
     * @returns {Setting}
     */
    static newCheckBoxSetting(name, value){
        if (!validParameter(name)){
            throw new Error("Name provided to new CheckBox setting is not valid")
        }
        if (!validParameter(value)) value = false

        var s = {type: "checkbox", name: name, value: value}
        return new AlgorithmSettingObject(s)
    }

    /**
     * toHTML returns the component representation of the setting
     * @param key the provided props key to pass down to the component
     * @returns {JSX.Element}
     */
    toHTML(key){
       if (this.obj.type === "range"){
           return (
               <SettingRange
                   key = {key}
                   settings = {this.obj}
               />)
       }
       if (this.obj.type === "option"){
           return (
               <SettingOption
                   key = {key}
                   settings = {this.obj}
               />
           )
       }
       if (this.obj.type === "checkbox"){
           return(
               <SettingCheckbox
                   key = {key}
                   settings = {this.obj}
               />
               )
       }
    }
}

export default AlgorithmSettingObject

/**
 * Checks if a provided parameter is non null. not undefined and not NaN
 * @param parameter the parameter to check
 * @returns {boolean} is a valid parameter
 */
function validParameter(parameter){
    return !(parameter === undefined || parameter === null);
}

