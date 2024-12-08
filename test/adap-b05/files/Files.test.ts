import { describe, it, expect } from "vitest";

import { StringName } from "../../../src/adap-b05/names/StringName";

import { Node } from "../../../src/adap-b05/files/Node";
import { File } from "../../../src/adap-b05/files/File";
import { BuggyFile } from "../../../src/adap-b05/files/BuggyFile";
import { Directory } from "../../../src/adap-b05/files/Directory";
import { RootNode } from "../../../src/adap-b05/files/RootNode";
import { InvalidStateException } from "../../../src/adap-b05/common/InvalidStateException";
import { ServiceFailureException } from "../../../src/adap-b05/common/ServiceFailureException";
import { Exception } from "../../../src/adap-b05/common/Exception";
import { assert } from "console";
import { Dir } from "fs";


function createFileSystem(): RootNode {
  let rn: RootNode = new RootNode();

  let usr: Directory = new Directory("usr", rn);
  let bin: Directory = new Directory("bin", usr);
  let ls: File = new File("ls", bin);
  let code: File = new File("code", bin);

  let media: Directory = new Directory("media", rn);

  let home: Directory = new Directory("home", rn);
  let riehle: Directory = new Directory("riehle", home);
  let bashrc: File = new File(".bashrc", riehle);
  let wallpaper: File = new File("wallpaper.jpg", riehle);
  let projects: Directory = new Directory("projects", riehle);

  return rn;
}

describe("Basic naming test", () => {
    it("test name checking", () => {
    let fs: RootNode = createFileSystem();
    let ls: Node = [...fs.findNodes("ls")][0];
    expect(ls.getFullName().isEqual(new StringName("/usr/bin/ls", '/'))).toBe(true);
    });
});

function createBuggySetup(): RootNode {
  let rn: RootNode = new RootNode();

  let usr: Directory = new Directory("usr", rn);
  let bin: Directory = new Directory("bin", usr);
  let ls: File = new BuggyFile("ls", bin);
  let code: File = new BuggyFile("code", bin);

  let media: Directory = new Directory("media", rn);

  let home: Directory = new Directory("home", rn);
  let riehle: Directory = new Directory("riehle", home);
  let bashrc: File = new BuggyFile(".bashrc", riehle);
  let wallpaper: File = new BuggyFile("wallpaper.jpg", riehle);
  let projects: Directory = new Directory("projects", riehle);

  return rn;
}

describe("Buggy setup test", () => {
  it("test finding files", () => {
    let threwException: boolean = false;
    try {
      let fs: RootNode = createBuggySetup();
      fs.findNodes("ls");
    } catch(er) {
      threwException = true;
      let ex: Exception = er as Exception;
      expect(ex instanceof ServiceFailureException).toBe(true);
      expect(ex.hasTrigger()).toBe(true);
      let tx: Exception = ex.getTrigger();
      expect(tx instanceof InvalidStateException).toBe(true);
    }
    expect(threwException).toBe(true);
  });
  it("selfmade", () => {
    let rn: RootNode = new RootNode();
    let usr: Directory = new Directory("usr", rn);
    let bin: Directory = new Directory("bin", usr);
    let bin2: File = new File("bin", bin);
    let found = rn.findNodes("bin")
    expect(found.size).toBe(2)
    expect(found.has(bin)).toBe(true)
    expect(found.has(bin2)).toBe(true)
    let mnt: Directory = new Directory("mnt",rn)
    found = rn.findNodes("mnt")
    expect(found.size).toBe(1)
    expect(found.has(mnt)).toBe(true)
  });
});
