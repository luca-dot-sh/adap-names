import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        IllegalArgumentException.assert(baseName!="","baseName must not be empty")
        super(baseName, parent);
    }

    public open(): void {
        IllegalArgumentException.assert(this.state!=FileState.OPEN, "do not open opened file")
        IllegalArgumentException.assert(this.state!=FileState.DELETED, "do not open deleted file")
        this.state = FileState.OPEN
    }

    public read(noBytes: number): Int8Array {
        // read something
        return new Int8Array();
    }

    public close(): void {
        IllegalArgumentException.assert(this.state!=FileState.CLOSED, "do not close closed file")
        IllegalArgumentException.assert(this.state!=FileState.DELETED, "do not close deleted file")
        this.state = FileState.CLOSED    
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}