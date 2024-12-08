import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../../adap-b05/common/IllegalArgumentException";
import { MethodFailedException } from "../../adap-b05/common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

function assertNoUnespacedDelimiters(c: string, delimiter: string): void {
    let str_components = c.split(delimiter)
    for (let i = 0; i < str_components.length; i++) {

        IllegalArgumentException.assert(!(i > 0
            && str_components[i - 1].length > 0
            && str_components[i - 1].charAt(str_components[i - 1].length - 1) != ESCAPE_CHARACTER), "String not masked propertly: " + c)
    }
}

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    private assertValidComponentIndexForGet(i: number): void {
        IllegalArgumentException.assert(i < this.components.length, "out of bounds")
    }

    private assertValidComponentIndexForSet(i: number): void {
        IllegalArgumentException.assert(i <= this.components.length, "out of bounds")
    }

    private assertAtLeastOneComponent(){
        InvalidStateException.assert(this.components.length>0,"there must always be at least one component")
    }

    constructor(other: string[], delimiter?: string) {
        super(delimiter);
        IllegalArgumentException.assert(other.length != 0, "Input array empty")
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
        this.assertValidComponentIndexForGet(i)
        return this.components[i]
    }

    private doSetComponent(i:number , c:string){
        this.components[i] = c
    }

    public setComponent(i: number, c: string): void {
        assertNoUnespacedDelimiters(c, this.delimiter)
        this.assertValidComponentIndexForSet(i)
        if(i == this.components.length) {
            this.append(c)
        } else {
            this.doSetComponent(i,c)
        }
        this.assertAtLeastOneComponent()
    }

    public insert(i: number, c: string): void {
        assertNoUnespacedDelimiters(c, this.delimiter)
        this.assertValidComponentIndexForSet(i)
        if(i == this.components.length) {
            this.append(c)
        } else {
            this.components.splice(i, 0, c)
        }
        this.assertAtLeastOneComponent()
    }

    public append(c: string): void {
        assertNoUnespacedDelimiters(c, this.delimiter)
        this.components.push(c)
        this.assertAtLeastOneComponent()
    }

    public remove(i: number): void {
        let old_components = this.components
        this.assertValidComponentIndexForGet(i)
        this.components.splice(i, 1)
        if (this.components.length == 0) {
            this.components = old_components
            throw new MethodFailedException("Name must always contain at least on component")
        }
        this.assertAtLeastOneComponent()
    }

}