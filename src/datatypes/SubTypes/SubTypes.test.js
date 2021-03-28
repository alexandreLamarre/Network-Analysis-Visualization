import LabelledType from "./VertexSubTypes/LabelledType";
import WeightedType from "./EdgeSubTypes/WeightedType";
import DirectedType from "./EdgeSubTypes/DirectedType";

test("LabelledType constructor", () => {
    const lType = new LabelledType();
    expect(lType.name).toBe("Labelled");
});

test("LabelledType set method", () => {
    const lType = new LabelledType();
    let params = {};
    lType.set(params);
    expect(params.labels.length).toBe(0);

    lType.set(params);
    expect(params.labels.length).toBe(0);
    lType.set(params, 5);
    expect(params.labels.length).toBe(0);

    lType.set(params, "protein");
    expect(params.labels.length).toBe(1);
    expect(params.labels).toContain("protein");

    lType.set(params, new Set());
    expect(params.labels.length).toBe(1);
    lType.set(params, "steroid");
    expect(params.labels.length).toBe(2);
    expect(params.labels).toContain("steroid");
});

test("WeightedType constructor", () => {
    const wType = new WeightedType();
    expect(wType.name).toBe("Weighted");
});

test("WeightedType set method", () => {
    const wType = new WeightedType();
    let params = {};
    wType.set(params);
    expect(params.weight).toBeLessThan(1);
    expect(params.weight).toBeGreaterThanOrEqual(0);
});

test("DirectedType constructor", () => {
    const dType = new DirectedType();
    expect(dType.name).toBe("Directed");
});

test("DirectedType set method", () => {
    const dType = new DirectedType();
    let params = {};
    dType.set(params);
    expect(params.directed).toBe(true);
})