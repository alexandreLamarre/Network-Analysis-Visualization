import React from "react"
import {IonItem, IonLabel} from "@ionic/react"
import AlgorithmSettingsComponent from "../../Components/Settings/AlgorithmSettingsComponent";
/**
 * Settings class handles a container of Setting class
 */
class AlgorithmSettings{
    constructor(name){
        this.name = name + " Settings"
        this.settings = []
    }

    /**
     * Adds a Setting object to Settings
     * @param setting Setting object to be added to the current settings
     */
    push(setting){
        //Two Setting objects in the same Settings Object should never have the same name
        for (let i = 0; i < this.settings.length; i++){
            if (this.settings[i].obj.name === setting.obj.name){
                throw new Error("Duplicate name settings are not allowed in the same Settings Object")
            }
        }
        this.settings.push(setting)
    }

    toHTML(index){
        const settingsHTML = []
        for(let i = 0; i < this.settings.length; i++){
            settingsHTML.push(this.settings[i].toHTML(i))
        }
        return (
            <AlgorithmSettingsComponent
                key = {index}
                name = {this.name}
                settings = {settingsHTML}
            />
        )
    }
}

export default AlgorithmSettings