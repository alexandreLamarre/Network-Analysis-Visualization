/**
 * Abstract types specifies the type of the network should take.
 * e.g, main types: simple, pseudo, multi, hyper, quantum
 * composite types : directed, weighted, labeled
 *
 * @property name the name of the type, this is displayed in the html
 * @property main true = can be augmented with non main types, false = can augment main types
 */
class AbstractType{
    /**
     *
     * @param name the string that represents the name of the network
     * @param isMain bool that represents whether or not the type is a main type, set to true if unspecified
     */
    constructor(name, isMain){
        if(isMain === undefined || isMain === null || typeof isMain !== "boolean") isMain = true
        this.name = name;
        this.main = isMain //main type means it can be augmented with other types, e.g : Simple + directed
    }
}

export default AbstractType;