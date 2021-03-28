import * as TYPES from "./Types";
import * as SUBTYPES from "./SubTypes";

import React from "react";
import NetworkTypeComponent from "../Components/Properties/NetworkTypeComponent";

class NetworkTypes{
    constructor(){
        this.types = [];
        for(const key in TYPES){
            this.types.push(new TYPES[key]())
        }
        this.vertexsubtypes = [];
        this.edgesubtypes = [];
        this.activeType = this.types[0];
    }

    toHTML(network){
        return (<NetworkTypeComponent
            network = {network}
            typesObject = {this}/>)
    }
}

export default NetworkTypes;