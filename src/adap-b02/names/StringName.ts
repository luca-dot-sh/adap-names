import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

function assertTrue(condition: boolean, message: string = ""): void {
    if (!condition) throw Error(message)
}

function isTrailingCharacterEscape(c: string) {
    return c.charAt(c.length - 1) == ESCAPE_CHARACTER
}

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        this.delimiter = delimiter ?? DEFAULT_DELIMITER
        this.name = other
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.name.replaceAll(ESCAPE_CHARACTER + delimiter, delimiter)
    }

    public asDataString(): string {
        return this.name
    }

    public isEmpty(): boolean {
        return this.name == ""
    }

    public getDelimiterCharacter(): string {
        return this.delimiter
    }

    public getNoComponents(): number {
        return this.getComponents().length
    }


    public getComponent(x: number): string {
        let components = this.getComponents()
        assertTrue(x<components.length)
        return components[x]
    }

    public setComponent(n: number, c: string): void {
        let components = this.getComponents()
        assertTrue(n<=components.length, "out of bounds")
        if(n==components.length){
            this.append(c)
        } else {
            components[n]= c
            this.name = components.join(this.delimiter)
        }
    }

    public insert(n: number, c: string): void {
        let components = this.getComponents()
        assertTrue(n<=components.length, "out of bounds")
        if(n==components.length){
            this.append(c)
        } else {
            components.splice(n,0,c)
            this.name = components.join(this.delimiter)
        }
    }

    public append(c: string): void {
        this.name = this.name.concat(this.delimiter,c)
    }

    public remove(n: number): void {
        let components = this.getComponents()
        assertTrue(!(n==0 && components.length==1))
        assertTrue(n<components.length, "out of bounds")
        components.splice(n,1)
        this.name = components.join(this.delimiter)
    }

    public concat(other: Name): void {
        this.name = this.name.concat(this.delimiter, other.asDataString())
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