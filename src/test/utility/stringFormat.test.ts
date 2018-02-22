import { S } from "../../ts/utility/stringFormat";
import 'mocha'
import { expect } from "chai";

describe('String formatting', () => {
    it('string format 1', () => {
        const f = "Apples %s and %s are nice";
        const expected = "Apples are great and oranges are nice";

        expect(S.format(f, "are great", "oranges")).to.equal(expected);
    });
});