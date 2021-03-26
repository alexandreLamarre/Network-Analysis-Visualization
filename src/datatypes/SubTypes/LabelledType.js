import AbstractSubType from "./AbstractSubType";

/**
 * LabelledType is a subtype that applies labels to vertices.
 */
class LabelledType extends AbstractSubType{
    constructor(){
        super("Labelled")
    }

    /**
     *
     * @param params the extra parameters for creating vertices
     * @param label the label to add to a vertex
     * @returns {{labels}|*} the updated params for a vertex
     */
    set(params, label){
        if(label === undefined || !label) label = "unlabelled"
        if(params.labels === undefined || !params.labels){
            params.labels = []
            params.labels.push(label)
        }
        return params
    }
}

export default LabelledType;