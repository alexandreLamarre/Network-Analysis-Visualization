import * as TYPES from "./Types";
import * as SUBTYPES from "./SubTypes";
import * as PROPERTIES from "./Properties";

import React from "react";
import NetworkTypeComponent from "../Components/Properties/NetworkTypeComponent";

class NetworkTypes{
    /**
     * Automatically imports and instantiates network type and property objects.
     */
    constructor(){
        this.types = [];
        this.vertexsubtypes = [];
        this.edgesubtypes = [];
        this.properties = [];
        for(const key in TYPES){
            this.types.push(new TYPES[key]())
        }
        for(const key in SUBTYPES){
            if(key === "EDGE"){
                for(const subtype in SUBTYPES[key]){
                    this.edgesubtypes.push(new SUBTYPES[key][subtype]());
                }
            } else if (key === "VERTEX"){
                for(const subtype in SUBTYPES[key]){
                    this.vertexsubtypes.push(new SUBTYPES[key][subtype]());
                }
            }
        }

        for(const key in PROPERTIES){
            this.properties.push(new PROPERTIES[key]());
        }
        this.activeType = this.types[0];
        this.activeProperty = this.properties[0];
    }

    /**
     * Exports network type settings to HTML
     * @param network the network in question
     * @returns {JSX.Element}
     */
    toHTML(network){
        return (<NetworkTypeComponent
            network = {network}
            typesObject = {this}/>)
    }
}

export default NetworkTypes;