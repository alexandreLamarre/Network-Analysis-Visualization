import AbstractType from "./AbstractType";
import SimpleType from "./SimpleType";
import PseudoType from "./PseudoType";
import MultiType from "./MultiType";
import HyperType from "./HyperType";
import LabelledType from "../SubTypes/VertexSubTypes/LabelledType";
import DirectedType from "../SubTypes/EdgeSubTypes/DirectedType";
import WeightedType from "../SubTypes/EdgeSubTypes/WeightedType";

// ======== ABSTRACT TYPE tests ================
test("AbstractType constructor", () => {
    const aType = new AbstractType("name");
    expect(aType.name).toBe("name");
    expect(aType.vertexsubtypes.size).toBe(0);
    expect(aType.edgesubtypes.size).toBe(0);
})

test("AbstractType edge-subtypes methods", () => {
    const aType = new AbstractType("name");
    const d = new DirectedType();
    const w = new WeightedType();
    expect(aType.edgesubtypes.size).toBe(0)
    aType.toggleEdgeSubTypes(d);
    expect(aType.edgesubtypes.size).toBe(1);
    expect(aType.edgesubtypes).toContain(d);
    aType.toggleEdgeSubTypes(w);
    expect(aType.edgesubtypes).toContain(w);
    expect(aType.edgesubtypes.size).toBe(2);
    aType.toggleEdgeSubTypes(w);
    aType.toggleEdgeSubTypes(d);
    expect(aType.edgesubtypes.size).toBe(0);
    expect(aType.edgesubtypes).not.toContain(w);
    expect(aType.edgesubtypes).not.toContain(d);
});

test("AbstractType vertex-subtypes methods", () => {
    const aType = new AbstractType("name");
    const l = new LabelledType();
    expect(aType.vertexsubtypes.size).toBe(0);
    aType.toggleVertexSubTypes(l);
    expect(aType.vertexsubtypes).toContain(l);
    expect(aType.vertexsubtypes.size).toBe(1);
    aType.toggleVertexSubTypes(l)
    expect(aType.vertexsubtypes).not.toContain(l);
    expect(aType.vertexsubtypes.size).toBe(0);
});


// ==================== SIMPLE TYPE =====================
test("SimpleType constructor", () => {
    const sType = new SimpleType();
    expect(sType.name).toBe("Simple");
    expect(sType.edgesubtypes.size).toBe(0);
    expect(sType.vertexsubtypes.size).toBe(0);
});

// ==================== PSEUDO TYPE ======================
test("PseudoType constructor", () => {
    const pType = new PseudoType();
    expect(pType.name).toBe("Pseudo");
    expect(pType.edgesubtypes.size).toBe(0);
    expect(pType.vertexsubtypes.size).toBe(0);
});

// ===================== MULTI TYPE ======================
test("MultiType constructor", () => {
    const mType = new MultiType();
    expect(mType.name).toBe("Multi");
    expect(mType.edgesubtypes.size).toBe(0);
    expect(mType.vertexsubtypes.size).toBe(0);
});

// ==================== HYPER TYPE ======================
test("HyperType constructor", () => {
    const hType = new HyperType();
    expect(hType.name).toBe("Hyper");
    expect(hType.edgesubtypes.size).toBe(0);
    expect(hType.vertexsubtypes.size).toBe(0);
});