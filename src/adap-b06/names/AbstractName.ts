import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { InvalidStateException } from "../common/InvalidStateException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter
    }

    public asString(delimiter: string = this.delimiter): string {
        let res: string[] = []
        for (let i = 0; i < this.getNoComponents(); i++) {
            res.push(this.getComponent(i).replace(ESCAPE_CHARACTER + delimiter, delimiter))
        }
        return res.join(delimiter)
    }

    public toString(): string {
        return this.asString()
    }

    public asDataString(): string {
        let res: string[] = []
        for (let i = 0; i < this.getNoComponents(); i++) {
            res.push(this.getComponent(i))
        }
        return res.join(this.delimiter)
    }

    public isEqual(other: Name): boolean {
        return this.getHashCode() == other.getHashCode()
    }

    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.asDataString();
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    public clone(): Name {
        return Object.create(this)
    }

    public isEmpty(): boolean {
        return this.asDataString() == ""
    }

    public getDelimiterCharacter(): string {
        return this.delimiter
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): Name;

    abstract insert(i: number, c: string): Name;
    abstract append(c: string): Name;
    abstract remove(i: number): Name;

    public concat(other: Name): Name {
        let res: Name = this
        for (let i = 0; i < other.getNoComponents(); i++) {
            res = res.append(other.getComponent(i))
        }
        return res
    }

    protected runWithMutationProtection(operation:()=>Name): Name {
        let prevHashCode = this.getHashCode()
        let newName:Name = operation()
        InvalidStateException.assert(prevHashCode==newName.getHashCode(),"State of name changed!")
        return newName;
    }


}