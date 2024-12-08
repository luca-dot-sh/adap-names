import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";


import { Name } from "../names/Name";
import { Directory } from "./Directory";
import { Exception } from "../common/Exception";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        this.assertIsValidBaseNameAsPrecond(bn)
        this.doSetBaseName(bn);
        this.assertClassInvariants()
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        try {
            return this.setOfThisNodeIfMatchingAndValid(bn)
        } catch(e) {
            throw new ServiceFailureException("exception when searching node",e as Exception)
        }
    }

    private setOfThisNodeIfMatchingAndValid(bn:string){
        this.assertClassInvariants()
        let res: Set<Node> = new Set<Node>()
        if(this.getBaseName()==bn){
            res.add(this)
        }
        return res
    }

    protected assertClassInvariants(): void {
        const bn: string = this.doGetBaseName();
        this.assertIsValidBaseNameAsClassInv(bn);
    }

    protected assertIsValidBaseNameAsPrecond(bn: string): void {
        const condition: boolean = (bn != "");
        IllegalArgumentException.assert(condition, "invalid base name");
    }

    protected assertIsValidBaseNameAsClassInv(bn: string): void {
        const condition: boolean = (bn != "");
        InvalidStateException.assert(condition, "invalid base name");
    }

}
