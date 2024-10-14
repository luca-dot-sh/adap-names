
import { Name } from "../../../src/adap-b04/names/Name";
import { StringName } from "../../../src/adap-b04/names/StringName";
import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";
import { describe, it, expect } from "vitest";
import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";
import { MethodFailureException } from "../../../src/adap-b04/common/MethodFailureException";
import { InvalidStateException } from "../../../src/adap-b04/common/InvalidStateException";

describe("Basic StringName function tests", () => {
    it("test insert", () => {
        let n: Name = new StringName("oss.fau.de");
        n.insert(1, "cs");
        expect(n.asString()).toBe("oss.cs.fau.de");
    });
    it("test append", () => {
        let n: Name = new StringName("oss.cs.fau");
        n.append("de");
        expect(n.asString()).toBe("oss.cs.fau.de");
    });
    it("test remove", () => {
        let n: Name = new StringName("oss.cs.fau.de");
        n.remove(0);
        expect(n.asString()).toBe("cs.fau.de");
    });
});

describe("Basic StringArrayName function tests", () => {
    it("test insert", () => {
        let n: Name = new StringArrayName(["oss", "fau", "de"]);
        n.insert(1, "cs");
        expect(n.asString()).toBe("oss.cs.fau.de");
    });
    it("test append", () => {
        let n: Name = new StringArrayName(["oss", "cs", "fau"]);
        n.append("de");
        expect(n.asString()).toBe("oss.cs.fau.de");
    });
    it("test remove", () => {
        let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
        n.remove(0);
        expect(n.asString()).toBe("cs.fau.de");
    });
});

describe("Delimiter function tests", () => {
    it("test insert", () => {
        let n: Name = new StringName("oss#fau#de", '#');
        n.insert(1, "cs");
        expect(n.asString()).toBe("oss#cs#fau#de");
    });
});

describe("Escape character extravaganza", () => {
    it("test escape and delimiter boundary conditions", () => {
        let n: Name = new StringName("oss.cs.fau.de", '#');
        expect(n.getNoComponents()).toBe(1);
        expect(n.asString()).toBe("oss.cs.fau.de");
        n.append("people");
        expect(n.asString()).toBe("oss.cs.fau.de#people");
    });
});

describe("selfmade tests", () => {
    it("test escape and delimiter boundary conditions", () => {
        // Original name string = "oss.cs.fau.de"
        let n: Name = new StringArrayName(["oss.cs.fau\\#de"], '#');
        expect(n.asString()).toBe("oss.cs.fau#de");
        expect(n.getNoComponents()).toBe(1)
        n.append("people");
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
        let s1 = new StringName("oss.cs.fau.de")
        let s2 = new StringName("oss.cs")
        s1.concat(s2)

        expect(s1.asDataString()).toBe("oss.cs.fau.de.oss.cs")

    });

    it("test preconditions", () => {
        expect(() => new StringArrayName([])).toThrowError(IllegalArgumentException)
    });
});