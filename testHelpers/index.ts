import { createSandbox } from 'sinon';
import { assert as chaiAssert } from 'chai';
import { assert as sinonAssert } from 'sinon';

export let sandbox = createSandbox();

export const assert = {
    ...chaiAssert,
    ...sinonAssert
}

afterEach(() => {
    sandbox.restore();
});
