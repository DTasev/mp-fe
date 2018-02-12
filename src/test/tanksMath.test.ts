import { expect } from 'chai';
import 'mocha';

import { TanksMath } from "../ts/tanksMath";
import { CartesianCoords } from '../ts/cartesianCoords';

describe('Tanks Math', () => {
    it('should calculate distance between two points', () => {
        // when the end is on the right
        let start = new CartesianCoords(0, 0);
        let end = new CartesianCoords(1, 1);
        expect(TanksMath.point.dist2d(start, end)).to.equal(Math.SQRT2);

        // when the end is on the left
        start = new CartesianCoords(1, 1);
        end = new CartesianCoords(0, 0);
        expect(TanksMath.point.dist2d(start, end)).to.equal(Math.SQRT2);

        start = new CartesianCoords(10, 10);
        end = new CartesianCoords(15, 15);
        expect(TanksMath.point.dist2d(start, end)).to.equal(7.0710678118654755);
    });
    it('should be able to check circle-point collision', () => {
        const point = new CartesianCoords(2, 5);
        const obj_coords = new CartesianCoords(3, 4);

        let obj_width = 3;
        expect(TanksMath.point.collide_circle(point, obj_coords, obj_width)).to.be.true;
        obj_width = 2;
        expect(TanksMath.point.collide_circle(point, obj_coords, obj_width)).to.be.true;
        obj_width = 1;
        expect(TanksMath.point.collide_circle(point, obj_coords, obj_width)).to.be.false;
    })
});