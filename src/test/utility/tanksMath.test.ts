import { expect } from 'chai';
import 'mocha';

import { TanksMath } from "../../ts/tanks/utility/tanksMath";
import { Point } from '../../ts/tanks/utility/point';
import { Tank } from '../../ts/tanks/objects/tank';

describe('Tanks Math - Point', () => {
    it('should calculate distance between two points', () => {
        // when the end is on the right
        let start = new Point(0, 0);
        let end = new Point(1, 1);
        expect(TanksMath.point.dist(start, end)).to.equal(Math.SQRT2);

        // when the end is on the left
        start = new Point(1, 1);
        end = new Point(0, 0);
        expect(TanksMath.point.dist(start, end)).to.equal(Math.SQRT2);

        start = new Point(10, 10);
        end = new Point(15, 15);
        expect(TanksMath.point.dist(start, end)).to.equal(7.0710678118654755);
    });
    it('should be able to check circle-point collision', () => {
        const point = new Point(2, 5);
        const obj_coords = new Point(3, 4);

        let obj_width = 3;
        expect(TanksMath.point.collideCircle(point, obj_coords, obj_width)).to.be.true;
        obj_width = 2;
        expect(TanksMath.point.collideCircle(point, obj_coords, obj_width)).to.be.true;
        obj_width = 1;
        expect(TanksMath.point.collideCircle(point, obj_coords, obj_width)).to.be.false;
    });
});
describe('Tanks Math - Closest Points', () => {
    it('closest two points from obstacle', () => {
        const point = new Point(2, 3);
        const expectedClosestPoint1 = new Point(1.5, 2);
        const expectedClosestPoint2 = new Point(1, 2.5);
        const center = new Point(0.9, 1.7);
        const points = [
            new Point(1, 1),
            new Point(0, 1.5),
            new Point(0.5, 2),
            expectedClosestPoint2,
            expectedClosestPoint1,
        ];

        const [p1, p2] = TanksMath.line.closestTwo(point, center, points);
        expect(p1).to.eq(expectedClosestPoint2);
        expect(p2).to.eq(expectedClosestPoint1);
    });

    let point = new Point(540, 640);
    const center = new Point(500, 600);
    const points = [
        new Point(500, 500), // 0
        new Point(550, 550), // 1
        new Point(500, 700), // 2
        new Point(450, 650), // 3
    ];
    it('point on the right of obstacle', () => {
        let [p1, p2] = TanksMath.line.closestTwo(point, center, points);
        expect(p1).to.eq(points[1]);
        expect(p2).to.eq(points[2]);
    });
    it('point on the left of obstacle', () => {
        point = new Point(400, 650);
        let [p1, p2] = TanksMath.line.closestTwo(point, center, points);
        expect(p1).to.eq(points[3]);
        expect(p2).to.eq(points[0]);

    });
    it('point below the center of obstacle', () => {
        point = new Point(530, 500);
        let [p1, p2] = TanksMath.line.closestTwo(point, center, points);
        expect(p1).to.eq(points[0]);
        expect(p2).to.eq(points[1]);
    });

    it('point closer to point on the other side of the obstacle', () => {
        point = new Point(540, 650);
        let [p1, p2] = TanksMath.line.closestTwo(point, center, points);
        expect(p1).to.eq(points[1]);
        expect(p2).to.eq(points[2]);
    });
    it('point on the same X position as center', () => {
        point = new Point(center.x, 750);
        let [p1, p2] = TanksMath.line.closestTwo(point, center, points);
        expect(p1).to.eq(points[1]);
        expect(p2).to.eq(points[2]);
    });
    it('point closer on the left', () => {
        point = new Point(480, 530);
        let [p1, p2] = TanksMath.line.closestTwo(point, center, points);
        expect(p1).to.eq(points[3]);
        expect(p2).to.eq(points[0]);
    });
    it('point inside the obstacle, right of center', () => {
        point = new Point(520, 629);
        let [p1, p2] = TanksMath.line.closestTwo(point, center, points);
        expect(p1).to.eq(null);
        expect(p2).to.eq(null);
        point = new Point(525, 570);
        [p1, p2] = TanksMath.line.closestTwo(point, center, points);
        expect(p1).to.eq(null);
        expect(p2).to.eq(null);
        point = new Point(525, 600);
        [p1, p2] = TanksMath.line.closestTwo(point, center, points);
        expect(p1).to.eq(null);
        expect(p2).to.eq(null);
    });
    it('point inside the obstacle, left of center', () => {
        point = new Point(465, 629);
        let [p1, p2] = TanksMath.line.closestTwo(point, center, points);
        expect(p1).to.eq(null);
        expect(p2).to.eq(null);
        point = new Point(480, 600);
        [p1, p2] = TanksMath.line.closestTwo(point, center, points);
        expect(p1).to.eq(null);
        expect(p2).to.eq(null);
    });
    it('point inside the obstacle, top of center', () => {
        point = new Point(480, 630);
        let [p1, p2] = TanksMath.line.closestTwo(point, center, points);
        expect(p1).to.eq(null);
        expect(p2).to.eq(null);

        point = new Point(515, 630);
        [p1, p2] = TanksMath.line.closestTwo(point, center, points);
        expect(p1).to.eq(null);
        expect(p2).to.eq(null);
    });
    it('point inside the obstacle, bottom of center', () => {
        point = new Point(500, 570);
        let [p1, p2] = TanksMath.line.closestTwo(point, center, points);
        expect(p1).to.eq(null);
        expect(p2).to.eq(null);
        point = new Point(500, 570);
        [p1, p2] = TanksMath.line.closestTwo(point, center, points);
        expect(p1).to.eq(null);
        expect(p2).to.eq(null);
    });
    // it('point on the same Y position as center', () => {
    // });
});
describe('Tanks Math - Line', () => {
    it('calculate the closest point on a horizontal line', () => {
        // test horizontal line
        let start = new Point(0, 0);
        let end = new Point(4, 0);
        let point = new Point(2, 2);
        let res = TanksMath.line.closestPoint(start, end, point);
        expect(res.x).to.equal(2);
        expect(res.y).to.equal(0);

        start = new Point(0, 0);
        end = new Point(3, 0);
        point = new Point(2, 2);
        res = TanksMath.line.closestPoint(start, end, point);
        expect(res.x).to.equal(2);
        expect(res.y).to.equal(0);

        start = new Point(0, 0);
        end = new Point(500, 0);
        point = new Point(250, 250);
        res = TanksMath.line.closestPoint(start, end, point);
        expect(res.x).to.equal(250);
        expect(res.y).to.equal(0);
    });
    it('calculate the closest point on a diagonal line, up to the right', () => {
        // test diagonal line / pointing up and to the right
        let start = new Point(0, 0);
        let end = new Point(2, 2);
        let point = new Point(0, 2);
        let res = TanksMath.line.closestPoint(start, end, point);
        expect(res.x).to.equal(1);
        expect(res.y).to.equal(1);
        res = TanksMath.line.closestPoint(end, start, point);
        expect(res.x).to.equal(1);
        expect(res.y).to.equal(1);

        start = new Point(1, 1);
        end = new Point(3, 3);
        point = new Point(0, 2);
        res = TanksMath.line.closestPoint(start, end, point);
        expect(res.x).to.equal(1);
        expect(res.y).to.equal(1);
        res = TanksMath.line.closestPoint(end, start, point);
        expect(res.x).to.equal(1);
        expect(res.y).to.equal(1);
    });
    it('calculate the closest point on a vertical line', () => {
        // test vertical line
        let start = new Point(0, 0);
        let end = new Point(0, 2);
        let point = new Point(1, 1);
        let res = TanksMath.line.closestPoint(start, end, point);
        expect(res.x).to.equal(0);
        expect(res.y).to.equal(1);
        res = TanksMath.line.closestPoint(end, start, point);
        expect(res.x).to.equal(0);
        expect(res.y).to.equal(1);
    });
    it('calculate the closest point on a diagonal line, up to the left', () => {
        // test diagonal line \, up and to the left
        let start = new Point(0, 2);
        let end = new Point(2, 0);
        let point = new Point(2, 2);
        let res = TanksMath.line.closestPoint(start, end, point);
        expect(res.x).to.equal(1);
        expect(res.y).to.equal(1);
        res = TanksMath.line.closestPoint(end, start, point);
        expect(res.x).to.equal(1);
        expect(res.y).to.equal(1);

        start = new Point(1, 3);
        end = new Point(3, 1);
        point = new Point(3, 3);
        res = TanksMath.line.closestPoint(start, end, point);
        expect(res.x).to.equal(2);
        expect(res.y).to.equal(2);
        res = TanksMath.line.closestPoint(end, start, point);
        expect(res.x).to.equal(2);
        expect(res.y).to.equal(2);
    });
    it('calculate the closest point on a line, when the point is on the line', () => {
        // test diagonal line \, up and to the left
        let start = new Point(0, 2);
        let end = new Point(2, 4);
        let point = new Point(1, 3);
        let res = TanksMath.line.closestPoint(start, end, point);
        expect(res.x).to.equal(1);
        expect(res.y).to.equal(3);
        res = TanksMath.line.closestPoint(end, start, point);
        expect(res.x).to.equal(1);
        expect(res.y).to.equal(3);
    });
});
describe('Tanks Math - Line-Circle Collision', () => {
    it('check collision of a line with a circle', () => {
        let start = new Point(0, 2);
        let end = new Point(2, 4);
        let point = new Point(2, 2);
        let radius = 3;
        expect(TanksMath.line.collideCircle(start, end, point, radius)).to.be.true;

        start = new Point(171, 465);
        end = new Point(196, 434);
        point = new Point(241, 364);
        radius = Tank.WIDTH;
        expect(TanksMath.line.collideCircle(start, end, point, radius)).to.be.false;

        start = new Point(522, 195);
        end = new Point(493, 153);
        point = new Point(501, 164);
        radius = Tank.WIDTH;
        expect(TanksMath.line.collideCircle(start, end, point, radius)).to.be.true;
    });
    it('check collision of a vertical line with a circle below', () => {
        let start = new Point(542, 289);
        let end = new Point(542, 345);
        let point = new Point(553, 475);
        let radius = Tank.WIDTH;
        expect(TanksMath.line.collideCircle(start, end, point, radius)).to.be.false;

        start = new Point(356, 210);
        end = new Point(405, 210);
        point = new Point(400, 210);
        radius = Tank.WIDTH;
        expect(TanksMath.line.collideCircle(start, end, point, radius)).to.be.true;
    });
    it("calculate distance from a line to a circle's center", () => {
        let start = new Point(0, 0);
        let end = new Point(0, 4);
        let point = new Point(2, 2);
        let dist = TanksMath.line.distCircleCenter(start, end, point);
        expect(dist).to.equal(2);

        start = new Point(0, 0);
        end = new Point(0, 4);
        point = new Point(2, 6);

        dist = TanksMath.line.distCircleCenter(start, end, point);
        expect(dist).to.equal(-1);
    });
});
describe('Tanks Math - Line-Line Collision', () => {
    it('collide with another line', () => {
        let start1 = new Point(100, 100),
            end1 = new Point(200, 200),
            start2 = new Point(100, 200),
            end2 = new Point(200, 100);
        expect(TanksMath.line.intersect(start1, end1, start2, end2)).to.be.true;
    });
    it('return point from collision with another line', () => {
        let start1 = new Point(100, 100),
            end1 = new Point(200, 200),
            start2 = new Point(100, 200),
            end2 = new Point(200, 100);
        expect(TanksMath.line.intersectPoint(start1, end1, start2, end2).equals(new Point(150, 150))).to.be.true;
    });
});