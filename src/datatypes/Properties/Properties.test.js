import CycleProperty from "./CycleProperty";
import GeneralProperty from "./GeneralProperty";
import {fastPickRandomIndex} from "./CycleProperty";
import {MIN_V} from "../Types/AbstractType";
import Vertex from "../Vertex";
import Edge from "../Edge";


//====== GENERAL PROPERTIES TEST ==============

//general helpers
test("Pick fast acceptable vertex helper tests", () => {

})

test("General property constructor", () =>{
    const gProperty = new GeneralProperty();
    expect(gProperty.name).toBe("General");
    expect(gProperty.getDependantProperties().size).toBe(0);
    expect(gProperty.supportedTypes.size).toBe(7)
    expect(gProperty.supportedTypes).toContain("Simple");
    expect(gProperty.supportedTypes).toContain("Pseudo");
    expect(gProperty.supportedTypes).toContain("Multi");
    expect(gProperty.supportedTypes).toContain("Hyper");
    expect(gProperty.supportedTypes).toContain("Directed");
    expect(gProperty.supportedTypes).toContain("Weighted");
    expect(gProperty.supportedTypes).toContain("Labelled");
})




// ===== CYCLE PROPERTIES TEST ================

// cycle helpers
test("Pick fast random index helper tests", () => {
    const arr = [3,4,5,6,7];
    let curLen = arr.length;
    let value;
    while(curLen > 0){
        [value, curLen] = fastPickRandomIndex(arr, curLen)
        expect(arr.slice(0, curLen)).not.toContain(value);
    }
    expect(fastPickRandomIndex(arr, curLen)).toBeNull();
});

//actual cycle tests;

test("Cycle property constructor", () => {
    const cProperty = new CycleProperty()
    expect(cProperty.name).toBe("Cycle")
    expect(cProperty.getDependantProperties()).toContain("Connected")
    expect(cProperty.getDependantProperties().size).toBe(1)
    expect(cProperty.supportedTypes.size).toBe(7);
    expect(cProperty.supportedTypes).toContain("Simple");
    expect(cProperty.supportedTypes).toContain("Pseudo");
    expect(cProperty.supportedTypes).toContain("Multi");
    expect(cProperty.supportedTypes).toContain("Hyper");
    expect(cProperty.supportedTypes).toContain("Directed");
    expect(cProperty.supportedTypes).toContain("Weighted");
    expect(cProperty.supportedTypes).toContain("Labelled");
});

test("Cycle property check", () => {
    const cProperty = new CycleProperty();
    const vertices = [];
    for(let i = 0; i < 10; i++){
        vertices.push(new Vertex(1,1));
    }
    const uedges = [];
    for(let i = 0; i < 35; i++){
        uedges.push(new Edge(-1,-1));
    }
    //TODO: finish this stupid method
    const gProperty = new GeneralProperty();
    const edges = []
})

test("CycleProperty assignEdge tests", () => {
    const cProperty = new CycleProperty();
    for(let i = MIN_V; i < 20; i++){
        const vertices = [];
        for(let j = 0; j < i; j++){
            vertices.push(new Vertex(1,1))
        }
        const uedges = []
        for(let j = 0; j < i; j++){
            uedges.push(new Edge(-1,-1))
        }
        const edges = cProperty.assignEdges(vertices, uedges)
        expect(edges.length).toBe(i)
        let root = edges[0].start
        expect(edges[edges.length-1].end).toBe(root)
        let prevEnd = edges[0].end
        for(let e = 1; e < edges.length -1; e++){
            expect(edges[e].start).toBe(prevEnd)
            prevEnd = edges[e].end
        }

        for(let v = 0; v < vertices.length; v++){
            expect(vertices[v].degree).toBe(2);
        }
    }
})

test("CycleProperty get bounds", () => {
    const cProperty = new CycleProperty();

    let maxV; let maxE;
    [maxV, maxE] = cProperty.getMaxBound(
        4,4, 200, 600);
    expect(maxV).toBe(200);
    expect(maxE).toBe(200);
    [maxV, maxE] = cProperty.getMaxBound(
        50,60,  150, 800);
    expect(maxV).toBe(150);
    expect(maxE).toBe(200);

    let minV; let minE;
    [minV, minE] = cProperty.getMinBound(
        50,50,  4, 3);
    expect(minV).toBe(4);
    expect(minE).toBe(4);

    [minV, minE] = cProperty.getMinBound(
        50, 50, 10, 10);
    expect(minV).toBe(4);
    expect(minE).toBe(4);
})