import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

function assertTrue(condition: boolean, message: string = ""): void {
    if (!condition) throw Error(message)
}

function assertNoUnespacedDelimiters(c: string, delimiter: string): void {
    let str_components = c.split(delimiter)
    for (let i = 0; i < str_components.length; i++) {
        if (i > 0
            && str_components[i - 1].length > 0
            && str_components[i - 1].charAt(str_components[i - 1].length - 1) != ESCAPE_CHARACTER
        ) {
            throw new Error("String not masked propertly: " + c);
        }
    }
}

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        super(delimiter);
        assertTrue(other.length != 0)
        other.forEach((component) => assertNoUnespacedDelimiters(component, this.delimiter))
        this.components = other
    }

    public isEmpty(): boolean {
        return this.components[0] == ""
    }

    public getNoComponents(): number {
        return this.components.length
    }

    public getComponent(i: number): string {
        assertTrue(i < this.components.length, "out of bounds")
        return this.components[i]
    }

    public setComponent(i: number, c: string): void {
        assertNoUnespacedDelimiters(c, this.delimiter)
        assertTrue(i < this.components.length, "out of bounds")
        this.components[i] = c
    }

    public insert(i: number, c: string): void {
        assertNoUnespacedDelimiters(c, this.delimiter)
        assertTrue(i < this.components.length, "out of bounds")
        this.components.splice(i, 0, c)
    }

    public append(c: string): void {
        assertNoUnespacedDelimiters(c, this.delimiter)
        this.components.push(c)
    }

    public remove(i: number): void {
        assertTrue(!(i == 0 && this.components.length == 1))
        assertTrue(i < this.components.length, "out of bounds")
        this.components.splice(i, 1)
    }

}