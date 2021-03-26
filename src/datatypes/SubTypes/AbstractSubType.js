/**
 * A sub type defines a network type can be applied to an existing network type.
 * For example, 'directed' and 'weighted' subtypes can be applied to
 * simple, pseudo, multi and hyper networks
 * @property name the name of the abstract sub type
 */
class AbstractSubType {
    constructor(name){
        this.name = name
    }

    set(params){
        throw new Error("Abstract Sub Type cannot assign specific parameters -" +
            "must implement the set params method in child class")
    }
}

export default AbstractSubType;