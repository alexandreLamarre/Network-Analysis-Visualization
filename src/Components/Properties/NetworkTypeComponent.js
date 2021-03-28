import React from "react";
import {IonContent, IonItem, IonLabel, IonSelect, IonSelectOption} from "@ionic/react";

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
        const edgesubtypes = this.typesObject.activeType.edgesubtypes;
        const vertexsubtypes = this.typesObject.activeType.vertexsubtypes;
        this.network = this.props.network;

        const currentedgesubtypes = [];
        edgesubtypes.forEach((st) => {
            currentedgesubtypes.push(st)
        });

        const currentvertexsubtypes = [];
        vertexsubtypes.forEach((vt) => {
            currentvertexsubtypes.push(vt)
        });

        this.state = {
            activeType: this.typesObject.activeType,
            edgesubtypes: currentedgesubtypes,
            vertexsubtypes: currentvertexsubtypes,
        }

    }

    /**
     * Sets the active type.
     * @param e event passed to this handler
     */
    setActiveType(e){
        console.log("activeType changed")
        const typeName = e.detail.value;
        console.log(typeName)
        let found; let newedgesubtypes = [];
        this.types.forEach((t) => {
            if(t.name === typeName){
                this.typesObject.activeType = t;
                found = t;
                t.edgesubtypes.forEach((st) => {
                    newedgesubtypes.push(st.name);
                });
            }
        });
        console.log(found, newedgesubtypes)
        if(found === undefined || !found) {
            alert("Selected type" + e.target.value + " doesn't exist in defined network types - please submit" +
                "a bug report");
            throw new Error("Selected type" + e.target.value + " doesn't exist in defined network types");
        }
        //TODO: set network update
        this.setState({activeType: found,edgesubtypes:newedgesubtypes});
    }

    /**
     * Adds/removes a subtype based on its occurence in the current edgesubtypes
     * @param e event passed to the handler
     */
    setActiveEdgeSubtypes(e){
        console.log("edge subtypes changed")
        const subtypeNames = e.detail.value;
        for(let i = 0; i < subtypeNames; i++){
            const subtypeName = subtypeNames[i];
            if(this.typesObject.activeType.edgesubtypes.has(subtypeName)){
                this.typesObject.activeType.edgesubtypes.delete(subtypeName);
            } else{
                this.typesObject.activeType.edgesubtypes.add(subtypeName);
            }
        }
        const newedgesubtypes = [];
        this.typesObject.activeType.edgesubtypes.forEach((st) => {
            newedgesubtypes.push(st.name)
        });
        this.setState({edgesubtypes: newedgesubtypes});
    }

    render(){
        return (
            <IonContent>
                <IonLabel> Test Display for network types</IonLabel>
                <IonItem>
                    <IonLabel> Network Types </IonLabel>
                    <IonSelect
                        id = "type"
                        value = {this.state.activeType.name}
                        onIonSubmit = {(e) => this.setActiveType(e)}>
                        {this.types.map((t, i) =>
                            <IonSelectOption key = {i} value = {t.name}> {t.name} </IonSelectOption>
                        )}
                    </IonSelect>
                </IonItem>
                <IonItem>
                    <IonLabel> Network Edge Sub-Types </IonLabel>
                    <IonSelect
                        id = "edge sub type"
                        value = {this.state.edgesubtypes}
                        multiple = {true}
                        onIonSubmit = {(e) => this.setActiveEdgeSubtypes(e)}>
                        {this.state.edgesubtypes.map((st, i) =>
                            <IonSelectOption key = {i} value = {st.name}> {st.name} </IonSelectOption>
                        )}
                    </IonSelect>

                </IonItem>
                <IonItem>
                    <IonLabel> Network Vertex Sub-types</IonLabel>
                </IonItem>
                <IonItem>
                    <IonLabel> Network Properties Go here</IonLabel>
                </IonItem>
            </IonContent>
        )
    }
}

export default NetworkTypeComponent;