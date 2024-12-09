import { describe, it, expect } from "vitest";
import { Name } from "../../../src/adap-b06/names/Name";
import { StringArrayName } from "../../../src/adap-b06/names/StringArrayName";
import { StringName } from "../../../src/adap-b06/names/StringName";
import { IllegalArgumentException } from "../../../src/adap-b06/common/IllegalArgumentException"


describe("selfmade immutability", () => {
    it("test immutable", () => {
        let n1 = new StringArrayName(["A", "B"], "x")
        let n2 = new StringName("AxB", "x")
        expect(n1.isEqual(n2)).toBe(true)
        let newN1 = n1.append("c")
        expect(n1.isEqual(newN1)).toBe(false)
        n1.setComponent(0, "a")
        n1.insert(0, "a")
        let n3 = n1.concat(n2)
    });

    it("test immutable 2", () => {
        let n1 = new StringArrayName(["A", "B"], "x")
        let n2 = new StringName("AxB", "x")
        expect(n1.isEqual(n2)).toBe(true)
        let newN1 = n1.append("c")
        expect(n1.isEqual(newN1)).toBe(false)
    });
});


describe("Basic StringName function tests", () => {
    it("test insert", () => {
        let n: Name = new StringName("oss.fau.de");
        n = n.insert(1, "cs");
        expect(n.asString()).toBe("oss.cs.fau.de");
    });
    it("test append", () => {
        let n: Name = new StringName("oss.cs.fau");
        n = n.append("de");
        expect(n.asString()).toBe("oss.cs.fau.de");
    });
    it("test remove", () => {
        let n: Name = new StringName("oss.cs.fau.de");
        n = n.remove(0);
        expect(n.asString()).toBe("cs.fau.de");
    });
});

describe("Basic StringArrayName function tests", () => {
    it("test insert", () => {
        let n: Name = new StringArrayName(["oss", "fau", "de"]);
        n = n.insert(1, "cs");
        expect(n.asString()).toBe("oss.cs.fau.de");
    });
    it("test append", () => {
        let n: Name = new StringArrayName(["oss", "cs", "fau"]);
        n = n.append("de");
        expect(n.asString()).toBe("oss.cs.fau.de");
    });
    it("test remove", () => {
        let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
        n = n.remove(0);
        expect(n.asString()).toBe("cs.fau.de");
    });
});

describe("Delimiter function tests", () => {
    it("test insert", () => {
        let n: Name = new StringName("oss#fau#de", '#');
        n = n.insert(1, "cs");
        expect(n.asString()).toBe("oss#cs#fau#de");
    });
});

describe("Escape character extravaganza", () => {
    it("test escape and delimiter boundary conditions", () => {
        let n: Name = new StringName("oss.cs.fau.de", '#');
        expect(n.getNoComponents()).toBe(1);
        expect(n.asString()).toBe("oss.cs.fau.de");
        n = n.append("people");
        expect(n.asString()).toBe("oss.cs.fau.de#people");
    });
});

describe("selfmade tests", () => {
    it("test escape and delimiter boundary conditions", () => {
        // Original name string = "oss.cs.fau.de"
        let n: Name = new StringArrayName(["oss.cs.fau\\#de"], '#');
        expect(n.asString()).toBe("oss.cs.fau#de");
        expect(n.getNoComponents()).toBe(1)
        n = n.append("people");
        expect(n.asString()).toBe("oss.cs.fau#de#people");
    });
    it("test stringname", () => {
        let n: Name = new StringName("oss.cs.fau.de")
        expect(n.getNoComponents()).toBe(4)
        expect(n.getComponent(2)).toBe("fau")
        let unescaped = "test.unescaped"
        expect(() => n.setComponent(1, unescaped)).toThrowError(IllegalArgumentException)
        expect(() => n.insert(1, unescaped)).toThrowError(IllegalArgumentException)
        expect(() => n.append(unescaped)).toThrowError(IllegalArgumentException)

        let empty = new StringName("")
        expect(empty.isEmpty()).toBe(true)
        expect(empty.getNoComponents()).toBe(1)

        let testescaped = new StringName("oss.cs.fau\\.de")
        expect(testescaped.getNoComponents()).toBe(3)
        expect(testescaped.asDataString()).toBe("oss.cs.fau\\.de")
        expect(testescaped.asString()).toBe("oss.cs.fau.de")
    });
    it("test in and out", () => {
        let original = new StringName("oss.cs.fau\\.de")
        let out = original.asDataString()
        let copy = new StringName(out)
        expect(original.asString()).toBe(copy.asString())
        expect(original.asDataString()).toBe(copy.asDataString())
        expect(original.getNoComponents()).toBe(copy.getNoComponents())
        expect(original.getComponent(1)).toBe(copy.getComponent(1))

        //Cross interaction
        expect(() => new StringArrayName(["oss", "cs.fau", "de"])).toThrowError()
        let strArrName = new StringArrayName(["oss", "cs", "fau", "de"])
        let ds = strArrName.asDataString()
        let strName = new StringName(ds)
        expect(strArrName.asString()).toBe(strName.asString())
        expect(strArrName.asDataString()).toBe(strName.asDataString())
        expect(strArrName.getNoComponents()).toBe(strName.getNoComponents())
        expect(strArrName.getComponent(1)).toBe(strName.getComponent(1))
    });
    it("test interfaces", () => {
        let original = new StringName("oss.cs.fau.de")
        let originalWEscape = new StringName("oss.cs.fau\\.de")

        let copy = original.clone()
        expect(original.isEqual(copy)).toBe(true)

        let originalArr = new StringArrayName(["oss", "cs", "fau", "de"])
        let copyArr = original.clone()
        expect(originalArr.isEqual(copyArr)).toBe(true)

        expect(original.isEqual(originalArr)).toBe(true)
        expect(original.isEqual(copyArr)).toBe(true)

        expect(original.isEqual(originalWEscape)).toBe(false)
    });

    it("test concat", () => {
        let s1: Name = new StringName("oss.cs.fau.de")
        let s2 = new StringName("oss.cs")
        s1 = s1.concat(s2)

        expect(s1.asDataString()).toBe("oss.cs.fau.de.oss.cs")

    });

    it("test preconditions", () => {
        expect(() => new StringArrayName([])).toThrowError(IllegalArgumentException)
    });
});