import Settings from "./Settings"
/**
 * Abstract Super Class that dictates what methods each Network Algorithm Should have
 * **/
class AbstractNetworkAlgorithm{
    constructor(name) {
        this.name = name
        this.settings = new Settings(name)
    }
    /** getAnimations should run the algorithm and get the animations**/
    getAnimations (){
        throw new Error("Cannot fetch animation of an Abstract algorithm")
    }
    /** nextAnimationStep should take the input set of vertices and return the update vertices and edges **/
    nextAnimationStep(){
        throw new Error("Cannot animate an Abstract algorithm")
    }
    /** getSettings should get the settings attribute of the algorithm**/
    getSettings(){
        throw new Error("Cannot get settings of an Abstract algorithm ")
    }
    /** setSettings sets the settings attribute of the algorithm**/
    setSettings(){
        throw new Error("Cannot set settings of an Abstract algorithm")
    }
    /** getHTMLSettings returns the HTML that represent the settings**/
    getHTMLSettings(){
        throw new Error("Can't initiate HTML settings of an Abstract algorithm")
    }
}