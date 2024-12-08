import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

function isTrailingCharacterEscape(c: string) {
    return c.charAt(c.length - 1) == ESCAPE_CHARACTER
}

function assertInBounds(i: number, bound:number): void {
    IllegalArgumentException.assert(i < bound, "out of bounds")
}

function assertNoUnespacedDelimiters(c: string, delimiter: string): void {
    let str_components = c.split(delimiter)
    for (let i = 0; i < str_components.length; i++) {

        IllegalArgumentException.assert(!(i > 0
            && str_components[i - 1].length > 0
            && str_components[i - 1].charAt(str_components[i - 1].length - 1) != ESCAPE_CHARACTER), "String not masked propertly: " + c)
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
        assertInBounds(x, components.length)
        return components[x]
    }

    public setComponent(n: number, c: string): Name {
        assertNoUnespacedDelimiters(c, this.delimiter)
        let components = this.getComponents()
        assertInBounds(n, components.length+1)
        if (n == components.length) {
            return this.append(c)
        } else {
            components[n] = c
            return new StringName(components.join(this.delimiter))
        }
    }

    public insert(n: number, c: string): Name {
        assertNoUnespacedDelimiters(c, this.delimiter)
        let components = this.getComponents()
        assertInBounds(n, components.length+1)
        if (n == components.length) {
            return this.append(c)
        } else {
            components.splice(n, 0, c)
            return new StringName(components.join(this.delimiter))
        }
    }

    public append(c: string): Name {
        assertNoUnespacedDelimiters(c, this.delimiter)
        return new StringName(this.name.concat(this.delimiter, c))
    }

    public remove(n: number): Name {
        let components = this.getComponents()
        IllegalArgumentException.assert(!(n == 0 && components.length == 1),"never remove the last component")
        assertInBounds(n,components.length)
        components.splice(n, 1)
        MethodFailedException.assert(components.length!=0,"the number of components must never be 0")
        return new StringName(components.join(this.delimiter))
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