import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

function assertTrue(condition: boolean, message: string = ""): void {
    if (!condition) throw Error(message)
}

function isTrailingCharacterEscape(c: string) {
    return c.charAt(c.length - 1) == ESCAPE_CHARACTER
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

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        super(delimiter);
        this.name = other
    }

    public isEmpty(): boolean {
        return this.name == ""
    }

    public getNoComponents(): number {
        return this.getComponents().length
    }


    public getComponent(x: number): string {
        let components = this.getComponents()
        assertTrue(x < components.length)
        return components[x]
    }

    public setComponent(n: number, c: string): void {
        assertNoUnespacedDelimiters(c, this.delimiter)
        let components = this.getComponents()
        assertTrue(n <= components.length, "out of bounds")
        if (n == components.length) {
            this.append(c)
        } else {
            components[n] = c
            this.name = components.join(this.delimiter)
        }
    }

    public insert(n: number, c: string): void {
        assertNoUnespacedDelimiters(c, this.delimiter)
        let components = this.getComponents()
        assertTrue(n <= components.length, "out of bounds")
        if (n == components.length) {
            this.append(c)
        } else {
            components.splice(n, 0, c)
            this.name = components.join(this.delimiter)
        }
    }

    public append(c: string): void {
        assertNoUnespacedDelimiters(c, this.delimiter)
        this.name = this.name.concat(this.delimiter, c)
    }

    public remove(n: number): void {
        let components = this.getComponents()
        assertTrue(!(n == 0 && components.length == 1))
        assertTrue(n < components.length, "out of bounds")
        components.splice(n, 1)
        this.name = components.join(this.delimiter)
    }

    private getComponents(): string[] {
        let split_str = this.name.split(this.delimiter)
        let res: string[] = []
        let currentComponent = ""
        split_str.forEach(component => {
            currentComponent = currentComponent.concat(component)
            // Skip components where the character is escaped
            if (isTrailingCharacterEscape(component)) {
                currentComponent = currentComponent.concat(this.delimiter)
            } else {
                res.push(currentComponent)
                currentComponent = ""
            }
        })
        return res
    }

}