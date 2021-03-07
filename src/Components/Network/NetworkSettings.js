import React from "react"
import NetworkSettingsComponent from "./NetworkSettingsComponent";

/**
 * Handles the attributes of a Network and passes
 * them down to its .toHTML component and updates them there
 */
class NetworkSettings{
    /**
     * @attr numV : the number of vertices in the network
     * @attr numE : the number of edges in the network
     * @attr scaleVertices: boolean deciding whether or not
     *                      vertex size based on their degree
     * @attr minSize: minimum vertex size if scaling vertex size
     * @attr maxSize: maximum vertex size if scaling vertex size
     * @attr applyColorGradient: boolean deciding whether or not
     *          to apply color to vertices based on their degree
     * @attr startColor string(color) that specifies the start color of the color gradient
     * @attr endColor string(color) that specifies the end color of the color gradient
     * @attr properties specified the properties of the network:
     *              these affect network generation algorithms and which algorithms can be run
     */
    constructor(){
        //number of vertices and edges
        this.numV = 60
        this.numE = 200
        //scaling vertx size
        this.scaleVertices = false
        this.minSize = 1
        this.maxSize = 12
        //apply color gradients
        this.applyColorGradient = false
        this.applyColorGradientVertex = false
        this.applyColorGradientEdge = false
        this.startColor =  "#00ffff"
        this.endColor = "#00ffff"
        //network type/properties
        //they are ordered
        this.properties = {}
        this.properties.General = true
        this.properties.Connected = false
        this.properties.Cycle = false


        //handlers: if these values are true the network
        // should reassign its vertices/edges properties
        // according to which of the following are true
        this.shouldReset = false //re-randomize vertices/edges
        this.shouldResizeVertex = false
        this.shouldRecolor = false
    }

    getProperties(){
        return this.properties
    }

    toHTML(){
        return (<NetworkSettingsComponent
            settings = {this} name = {"Network Settings"}/>)
    }
}

export default NetworkSettings
