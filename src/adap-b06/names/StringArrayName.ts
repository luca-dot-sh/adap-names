import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";
import { Name } from "./Name";
import { StringName } from "./StringName";

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

    constructor(other: string[], delimiter?: string) {
        super(delimiter);
        IllegalArgumentException.assert(other.length != 0, "Input array empty")
        other.forEach((component) => assertNoUnespacedDelimiters(component, this.delimiter))
        this.components = other
    }

    public isEmpty(): boolean {
        this.assertClassInvariants()
        return this.components[0] == ""
    }

    public getNoComponents(): number {
        this.assertClassInvariants()
        return this.components.length
    }

    public getComponent(i: number): string {
        this.assertClassInvariants()
        this.assertValidComponentIndexForGet(i)
        return this.components[i]
    }

    public setComponent(i: number, c: string): Name {
        return this.runWithMutationProtection(() => {
            this.assertClassInvariants()
            assertNoUnespacedDelimiters(c, this.delimiter)
            this.assertValidComponentIndexForSet(i)
            let res: Name
            if (i == this.components.length) {
                res = this.append(c)
            } else {
                let components = this.getCopiedComponents()
                components[i] = c
                res = new StringArrayName(components, this.delimiter)
            }
            this.assertNameHasAtLeastOneComponent(res)
            return res
        })
    }

    public insert(i: number, c: string): Name {
        return this.runWithMutationProtection(() => {
            this.assertClassInvariants()
            assertNoUnespacedDelimiters(c, this.delimiter)
            this.assertValidComponentIndexForSet(i)
            let res: Name
            if (i == this.components.length) {
                res = this.append(c)
            } else {
                let components = this.getCopiedComponents()
                components.splice(i, 0, c)
                res = new StringArrayName(components, this.delimiter)
            }
            this.assertNameHasAtLeastOneComponent(res)
            return res
        })
    }

    public append(c: string): Name {
        return this.runWithMutationProtection(() => {
            this.assertClassInvariants()
            assertNoUnespacedDelimiters(c, this.delimiter)
            let components = this.getCopiedComponents()
            components.push(c)
            let res =new StringArrayName(components, this.delimiter)
            this.assertNameHasAtLeastOneComponent(res)
            return  res
        })
    }

    public remove(i: number): Name {
        return this.runWithMutationProtection(() => {
            this.assertClassInvariants()
            let components = this.getCopiedComponents()
            this.assertValidComponentIndexForGet(i)
            let deletedElements = components.splice(i, 1)
            if (deletedElements.length != 1) {
                throw new MethodFailedException("no element was deleted")
            }
            if (this.components.length == 0) {
                throw new MethodFailedException("Name must always contain at least on component")
            }
            let res = new StringArrayName(components, this.delimiter)
            this.assertNameHasAtLeastOneComponent(res)
            return res
        })
    }

    private assertValidComponentIndexForGet(i: number): void {
        IllegalArgumentException.assert(i < this.components.length, "out of bounds")
    }

    private assertValidComponentIndexForSet(i: number): void {
        IllegalArgumentException.assert(i <= this.components.length, "out of bounds")
    }

    private assertClassInvariants(){
        this.assertAtLeastOneComponent()
    }

    /** If we don't work on the components array (like in assertNameHasAtLeastOneComponent) here, we will get a Stack Overflow error*/
    private assertAtLeastOneComponent(){
        InvalidStateException.assert(this.components.length > 0, "there must always be at least one component")
    } 


    private assertNameHasAtLeastOneComponent(name:Name) {
        InvalidStateException.assert(this.getNoComponents() > 0, "there must always be at least one component")
    }

    private getCopiedComponents(): string[] {
        return [...this.components]
    }

}