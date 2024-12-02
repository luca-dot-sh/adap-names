import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

    public findNodes(bn: string): Set<Node> {
        let res: Set<Node> = new Set<Node>()
        super.findNodes(bn).forEach(it=>res.add(it))
        this.childNodes.forEach(child=>child.findNodes(bn).forEach(childRes=>res.add(childRes)))
        return res
    }

}