// @ts-check

import test from "tape";
import RefMap from "./refmap.js";

test("basic ref and deref", t => {
    t.plan(2);

    const refmap = new RefMap();
    const obj = {};
    const ref = refmap.ref(obj);
    const deref = refmap.deref(ref);

    t.equal(typeof ref, "symbol", "refs are symbols");
    t.equal(deref, obj, "object lookup is successful");
});

test("multiple ref and deref", t => {
    const N_REFS = 3;
    t.plan(N_REFS);

    const refmap = new RefMap();
    const objs = [];
    const refs = [];

    for (let i = 0; i < N_REFS; i++) {
        const obj = {};
        objs.push(obj);
        refs.push(refmap.ref(obj));
    }
    
    for (let i = 0; i < N_REFS; i++) {
        const obj = objs[i];
        const ref = refs[i];
        const deref = refmap.deref(ref);

        t.equal(deref, obj, `refs[${i}] derefs to objs[${i}]`);
    }
});

test("stable ref creation", t => {
    t.plan(1);

    const refmap = new RefMap();
    const obj = {};
    const ref1 = refmap.ref(obj);
    const ref2 = refmap.ref(obj);

    t.equal(
        ref1,
        ref2,
        "creating a ref for the same object returns the same ref"
    );
});

test("multiple refs are different for different objects", t => {
    const N_REFS = 3;
    t.plan(N_REFS * N_REFS - N_REFS);

    const refmap = new RefMap();
    const refs = [];

    for (let i = 0; i < N_REFS; i++) {
        const obj = {};
        refs.push(refmap.ref(obj));
    }
    
    for (let i = 0; i < N_REFS; i++) {
        for (let j = 0; j < N_REFS; j++) {
            const refi = refs[i];
            const refj = refs[j];

            if (i !== j) {
                t.notEqual(refi, refj, `refs[${i}] differs from refs[${j}]`);
            }
        }
    }
});

test("POLYFILL_ONLY_releaseRef", t => {
    t.plan(2);

    const refmap = new RefMap();
    const obj = {};
    const ref = refmap.ref(obj);
    refmap.POLYFILL_ONLY_releaseRef(ref);
    const deref = refmap.deref(ref);
    const newref = refmap.ref(obj);

    t.equal(deref, undefined, "object lookup gives undefined");
    t.notEqual(ref, newref,
        "creating a new ref after release gives a different ref");
});