import React from "react"
import {IonItem, IonLabel, IonRange, IonCheckbox} from "@ionic/react";

var MIN_VERTICES_NUM = 4
var MAX_VERTICES_NUM = 200
var MIN_EDGES_NUM = 3
var MAX_EDGES_NUM = 600

/**
 * Network Settings Component is the react component that represents & controls
 * settings specific to the network.
 * Every time you update a state value. you must also update the settings prop values
 * for it to correctly work with the network data structure
 */
class NetworkSettingsComponent extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            minV: MIN_VERTICES_NUM,
            minE : MIN_EDGES_NUM,
            maxV : MAX_VERTICES_NUM,
            maxE : Math.min(
                Math.floor(this.props.settings.numV*(this.props.settings.numV -1)/2), MAX_EDGES_NUM),
            numV: this.props.settings.numV,
            numE: this.props.settings.numE,
            scaleVertices: this.props.settings.scaleVertices,
            minSize : this.props.settings.minSize,
            maxSize : this.props.settings.maxSize,
            applyColorGradient : this.props.settings.applyColorGradient,
            startColor: this.props.settings.startColor,
            endColor : this.props.settings.endColor,
            properties : null,
            activeProperty: "General"
        }
        this.settings = this.props.settings
    }

    componentDidMount() {
        //we need to parse the properties 'List' into an array so it is mappable
        const properties = [];
        //here we set the default network type to General in case something
        //goes wrong in the declaration of the NetworkSettings Class
        for (const key in this.settings.properties){
            if(key === "General") {
                this.settings.properties[key] = true
            } else{
                this.settings.properties[key]= false
            }
            properties.push(key)
        }
        this.setState({properties: properties})
    }

    /**
     * Updates the vertex or edge bounds based on the current network type
     * @param numV the number of vertices we want or have
     * @param numE the number of edges we want or have
     * @param updateV whether or not numV is what we want/have respectively and vice-versa for numE
     */
    updateVertexEdgeBounds(numV, numE, updateV, activeProperty){
        if (activeProperty === "Connected"){
            const minE = numV -1
            const maxE= Math.min(Math.floor(numV*(numV-1)/2), MAX_EDGES_NUM)
            const edges = numE > maxE? maxE: numE < minE? minE: numE
            this.settings.numE = edges
            this.settings.numV = numV
            this.setState({numV: numV, numE: edges, minE: minE, maxE: maxE})
        }
        if (activeProperty === "Cycle"){
            if (updateV){
                const edges = numV - 1
                this.settings.numE = numV - 1
                this.settings.numV = numV
                this.setState({numV: numV, numE: edges, minE: MIN_EDGES_NUM, maxE: MAX_VERTICES_NUM-1})
            } else{
                const vertices = numE + 1
                this.settings.numV = vertices
                this.settings.numE = numE
                this.setState({numV: vertices, numE: numE, minE: MIN_EDGES_NUM, maxE: MAX_VERTICES_NUM-1})
            }
        }
        if (activeProperty === "General"){
            this.setState({
                minE: MIN_EDGES_NUM,
                maxE: Math.min(MAX_EDGES_NUM, Math.floor(numV*(numV-1)/2)),
                minV: MIN_VERTICES_NUM,
                maxV : MAX_VERTICES_NUM,
            })
        }
        //as always, changing number of vertices/ edges shuld result in a network reset
        this.settings.shouldReset = true
    }

    /**
     * Setter for the number of vertices in a network,
     * should update vertex number/ edge number bounds as necessary
     * @param v number of vertices
     */
    setNumVertices(v){
        const num = Number(v)
        if(this.state.activeProperty === "Cycle"){
            this.updateVertexEdgeBounds(num, this.state.numE, true, this.state.activeProperty)
        } else if (this.state.activeProperty === "Connected"){
            this.updateVertexEdgeBounds(num, this.state.numE, true, this.state.activeProperty)
        } else{
            this.settings.numV = num
            const maxE = Math.min(Math.floor(num*(num-1)/2), MAX_EDGES_NUM)
            const edges = this.state.numE > maxE? maxE: this.state.numE
            this.settings.numE = edges
            this.settings.shouldReset = true
            this.setState({numV: num, numE: edges, maxE: maxE})
        }
    }

    /**
     * Setter for the number of edges in a network,
     * should update vertex number/edge number as necessary
     * @param v
     */
    setNumEdges(v){
        const num = Number(v)
        if(this.state.activeProperty === "Cycle"){
            this.updateVertexEdgeBounds(this.state.numV, num, false, this.state.activeProperty)
        } else if (this.state.activeProperty === "Connected"){
            this.updateVertexEdgeBounds(this.state.numV, num, false, this.state.activeProperty)
        } else{
            this.settings.numE = num
            this.settings.shouldReset = true
            this.setState({numE: num})
        }
    }

    setScalingVertex(v){
        this.settings.shouldResizeVertex = true
    }

    setMinSize(v){

    }

    setMaxSize(v){

    }

    setApplyColorGradient(v){
        this.settings.shouldRecolor = true
    }

    setStartColor(v){

    }

    setEndColor(v){

    }

    setProperties(v){
        for(const key in this.settings.properties){
            if(key === v){
               this.settings.properties[key] = true
            } else if(v === "Cycle" && key === "Connected"){
                this.settings.properties[key] = true
            } else {
                this.settings.properties[key] = false
            }
        }
        this.updateVertexEdgeBounds(this.state.numV, this.state.numE, true, v)
        this.setState({activeProperty: v})
    }


    render(){
        const propNetwork = this.state.properties === null? []: this.state.properties
        return (
            <div>
                <IonItem lines = "full">
                    <div style = {{textAlign: "center"}}>
                        <b style = {{textAlign: "center"}}> {this.props.name}</b>
                    </div>

                </IonItem >
                <IonItem lines = "full">
                    <p> Network Type </p>
                    <select style = {{marginLeft: "10px"}}
                        value = {this.state.activeProperty}
                            onChange = {(e) => this.setProperties(e.target.value)}>
                        {propNetwork.map((property, index) => (
                            <option key = {index} value = {property}> {property} </option>
                        ))}
                    </select>
                </IonItem>
                <IonItem lines = "full">
                    <p> Vertices {this.state.numV} </p>
                    <IonRange
                        value = {this.state.numV}
                        min = {this.state.minV}
                        max = {this.state.maxV}
                        step = "1"
                        onIonChange = {(e) => this.setNumVertices(e.target.value)}
                        >
                    </IonRange>
                </IonItem>
                <IonItem lines = "full">
                    <p> Edges {this.state.numE}</p>
                    <IonRange
                        value = {this.state.numE}
                        min = {this.state.minE}
                        max = {this.state.maxE}
                        step = "1"
                        onIonChange = {(e) => this.setNumEdges(e.target.value)}
                    > </IonRange>
                </IonItem>
                <IonItem lines = "full">
                    <p> Dynamic Sizing </p>
                    <IonCheckbox style = {{marginLeft: "5%"}}> </IonCheckbox>
                </IonItem>
                <div>
                    <IonItem lines = "full">
                        <p> Minimum Vertex Size</p>
                        <IonRange
                            disabled = {!this.state.scaleVertices}> </IonRange>
                    </IonItem>
                    <IonItem lines = "full">
                        <p> Maximum Vertex Size</p>
                        <IonRange
                            disabled = {!this.state.scaleVertices}> </IonRange>
                    </IonItem>
                </div>
                <IonItem lines = "full">
                    <p> Apply Color Gradient </p>
                    <IonCheckbox style = {{marginLeft: "5%"}}> </IonCheckbox>
                </IonItem>
                <IonItem>
                    <p> Start Color</p>
                    <input
                        disabled = {!this.state.applyColorGradient}
                        style = {{marginLeft: "5%"}}
                        type = "color" defaultValue = {this.settings.startColor} />
                </IonItem>
                <IonItem>
                    <p> End Color </p>
                    <input
                        disabled = {!this.state.applyColorGradient}
                        style = {{marginLeft: "5%"}}
                        type = "color" defaultValue = {this.settings.endColor}/>
                </IonItem>
            </div>
        )
    }
}

export default NetworkSettingsComponent