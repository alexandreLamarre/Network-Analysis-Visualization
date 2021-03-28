import AbstractType from "./AbstractType";
import SimpleType from "./SimpleType";
import PseudoType from "./PseudoType";
import MultiType from "./MultiType";
import HyperType from "./HyperType";

test("AbstractType constructor", () => {
    const aType = new AbstractType("name");
    expect(aType.name).toBe("name");
    expect(aType.vertexsubtypes.size).toBe(0);
    expect(aType.edgesubtypes.size).toBe(0);
})

test("AbstractType edge-subtypes methods", () => {
    //TODO
});

test("AbstractType vertex-subtypes methods", () => {
    //TODO
});

test("SimpleType constructor", () => {
    const sType = new SimpleType();
    expect(sType.name).toBe("Simple");
    expect(sType.edgesubtypes.size).toBe(0);
    expect(sType.vertexsubtypes.size).toBe(0);
});

test("PseudoType constructor", () => {
    const pType = new PseudoType();
    expect(pType.name).toBe("Pseudo");
    expect(pType.edgesubtypes.size).toBe(0);
    expect(pType.vertexsubtypes.size).toBe(0);
});

test("MultiType constructor", () => {
    const mType = new MultiType();
    expect(mType.name).toBe("Multi");
    expect(mType.edgesubtypes.size).toBe(0);
    expect(mType.vertexsubtypes.size).toBe(0);
});

test("HyperType constructor", () => {
    const hType = new HyperType();
    expect(hType.name).toBe("Hyper");
    expect(hType.edgesubtypes.size).toBe(0);
    expect(hType.vertexsubtypes.size).toBe(0);
});