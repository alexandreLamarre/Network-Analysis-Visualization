import React from "react"
import {IonItem, IonLabel} from "@ionic/react"
import SettingsComponent from "../../Components/Settings/SettingsComponent";
/**
 * Settings class handles a container of Setting class
 */
class Settings{
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

    toHTML(){
        const settingsHTML = []

        for(let i = 0; i < this.settings.length; i++){
            settingsHTML.push(this.settings[i].toHTML(i))
        }
        console.log("settings to HTML", settingsHTML)
        return (
            <SettingsComponent
                name = {this.name}
                settings = {settingsHTML}
            />
        )
    }
}

export default Settings