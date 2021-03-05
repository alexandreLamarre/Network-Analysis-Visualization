import Settings from "../../Animations/Algorithms/Settings";
import SettingObject from "../../Animations/Algorithms/Setting";

export function NewDefaultNetworkSettings(){
    const networkSettings = new Settings("Network")

    const forcedConnectedness = SettingObject.newCheckBoxSetting("Force connectedness")
    const edges = SettingObject.newRangeSetting("Edges", 1, 600, 1, 40)
    const vertices = SettingObject.newRangeSetting("Vertices", 4, 200, 1, 20)

    const maxEdges = function(){
        const n = vertices.obj.value
        return Math.floor(n * (n-1)/2)
    }
    const minEdges = function(){
        if (forcedConnectedness.obj.value){
            return vertices.obj.value
        } else {
            return 0
        }
    }

    const minVertices = function(){
        if (forcedConnectedness.obj.value){
            return edges.obj.value + 1
        } else {
            return 4
        }
    }

    edges.obj.min = minEdges()
    edges.obj.max = maxEdges()
    vertices.min = minVertices()

    networkSettings.push(vertices)
    networkSettings.push(edges)
    networkSettings.push(forcedConnectedness)
    return networkSettings
}