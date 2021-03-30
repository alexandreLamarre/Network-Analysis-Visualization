import React from "react";
import {IonContent, IonItem, IonLabel, IonSelect, IonSelectOption,
IonList, IonRadioGroup, IonRadio, IonToggle} from "@ionic/react";

/**
 * Component to update the network types & properties
 * @property types the networkTypes object
 * @property subtypes the networkTypes object
 */
class NetworkTypeComponent extends React.Component{
    constructor(props){
        super(props);
        console.log(this.props);

        this.typesObject = this.props.typesObject;
        this.types = this.typesObject.types;
        this.edgesubtypes = this.typesObject.edgesubtypes;
        this.vertexsubtypes = this.typesObject.vertexsubtypes;
        this.properties = this.typesObject.properties;
        this.network = this.props.network;



        this.state = {
            activeType: this.typesObject.activeType,
            activeProperty: this.typesObject.activeProperty,

        }
    }

    componentDidMount(){
        this.setState({
            activeType: this.typesObject.activeType,
            activeProperty: this.typesObject.activeProperty,
        })
    }

    componentWillUnmount() {
        //TODO: set network reset if the properties change from their defaults.
    }

    /**
     * Sets the active type.
     * (Automatically) Updates the selected subtypes to their
     * previous selections associated with the new active type.
     * @param e event passed to this handler
     */
    setActiveType(e){
        const typeName = e.detail.value;
        let found;
        this.types.forEach((t) => {
            if(t.name === typeName){
                this.typesObject.activeType = t;
                found = t;
            }
        });
        if(found === undefined || !found) {
            alert("Selected type" + typeName + " doesn't exist in defined network types - please submit" +
                "a bug report");
            throw new Error("Selected type" + typeName + " doesn't exist in defined network types");
        }

        //Update active property if it is not supported by the active type;
        if(!this.state.activeProperty.supports(found.name)){
            for(let i = 0; i < this.properties.length; i++){
                if(this.properties[i].name === "General"){
                    this.setState({activeProperty: this.properties[i]});
                }
            }
        }

        this.setState({activeType: found});
    }

    /**
     * Sets the active property in the typesObject and udpates the activeProperty
     * state
     * @param e event passed to this handler
     */
    setActiveProperty(e){
        const propertyName = e.detail.value;
        let found;
        this.properties.forEach((p) => {
            if(p.name === propertyName){
                this.typesObject.activeProperty = p;
                found = p;
            }
        });

        if(found === undefined || !found) {
            alert("Selected property " + propertyName + " doesn't exist in defined network properties - please submit" +
                "a bug report");
            throw new Error("Selected property " + propertyName + " doesn't exist in defined network properties");
        }
        this.setState({activeProperty: found})
    }

    /**
     * Adds/removes a subtype based on its occurence in the current edgesubtypes
     * @param e event passed to this handler
     */
    setActiveEdgeSubtypes(e){
        const subtype = e.target.value;
        this.typesObject.activeType.toggleEdgeSubTypes(subtype);
    }

    /**
     * Adds/removes a subtype based on its occurence in the current vertexsubtypes
     * @param e event passed to this handler
     */
    setActiveVertexSubTypes(e){
        const subtype = e.target.value;
        this.typesObject.activeType.toggleVertexSubTypes(subtype);
    }

    render(){
        return (
            <IonContent>
                <br/>
                <div style = {{textAlign: "center"}}>
                    <b className = "noSelectText">
                        Customize Network types and properties
                    </b>
                </div>
                <br/>
                <IonList>
                    <IonRadioGroup
                        value = {this.state.activeType.name}
                        onIonChange = {(e) => this.setActiveType(e)}>
                        <div style = {{textAlign: "center"}}>
                            <b className = "noSelectText">
                                Network Types
                            </b>
                        </div>

                        {this.types.map((t,i) =>
                            <IonItem key = {i}>
                                <IonLabel> {t.name} </IonLabel>
                                <IonRadio value = {t.name} />
                            </IonItem>
                        )}
                    </IonRadioGroup>
                </IonList>

                <IonList>
                    <div style = {{textAlign: "center"}}>
                        <b className = "noSelectText">
                            Network Sub-Types
                        </b>
                    </div>
                    {this.edgesubtypes.map((est, i) =>
                        <IonItem key = {i}>
                            <IonLabel> {est.name} </IonLabel>
                            <IonToggle
                                onClick = {(e) => this.setActiveEdgeSubtypes(e)}
                                checked = {this.state.activeType.edgesubtypes.has(est)}
                                value = {est}
                                slot = "end"/>
                        </IonItem>
                    )}
                    {this.vertexsubtypes.map((vst, i) =>
                        <IonItem key = {i}>
                            <IonLabel> {vst.name} </IonLabel>
                            <IonToggle
                                onClick = {(e) => this.setActiveVertexSubTypes(e)}
                                checked = {this.state.activeType.vertexsubtypes.has(vst)}
                                value = {vst}
                                slot = "end"/>
                        </IonItem>
                    )}
                </IonList>

                <IonList>
                    <IonRadioGroup
                        onIonChange = {(e) => this.setActiveProperty(e)}
                        value = {this.state.activeProperty.name}>
                        <div style = {{textAlign: "center"}}>
                            <b className = "noSelectText">
                                Network Properties
                            </b>
                        </div>
                        {this.properties.map((p, i) =>
                            <IonItem key = {i} hidden = {
                                !p.supports(this.state.activeType.name)|| ![this.state.activeType.edgesubtypes].concat(
                                    [this.state.activeType.vertexsubtypes]).filter((x) => p.supports(x.name))}
                                >
                                <IonLabel> {p.name} </IonLabel>
                                <IonRadio slot = "end" value = {p.name}/>
                            </IonItem>
                        )}
                    </IonRadioGroup>
                </IonList>
            </IonContent>
        )
    }
}

export default NetworkTypeComponent;