import { Obstacle, ObstacleType } from "../../ts/tanks/gameMap/obstacle";
import { Point } from "../../ts/tanks/utility/point";
import { expect } from 'chai';
import 'mocha';
import { Tank } from "../../ts/tanks/objects/tank";
import { CanvasContextMock } from "../mocking/canvasContextMock";
import { SepiaTheme } from "../../ts/tanks/themes/sepia";

describe('Obstacle', () => {
    it('construct solid obstacle', () => {
        const solid = new Obstacle(1, "solid", new Point(15, 15), [new Point(0, 0), new Point(5, 5)]);
        expect(solid.id).to.eq(1);
        expect(solid.type).to.eq(ObstacleType.SOLID);
        expect(solid.center.equals(new Point(15, 15))).to.be.true;
        expect(solid.points.length).to.eq(2);
    });
    it('construct water obstacle', () => {
        const water = new Obstacle(1, "water", new Point(15, 15), [new Point(0, 0), new Point(5, 5)]);
        expect(water.id).to.eq(1);
        expect(water.type).to.eq(ObstacleType.WATER);
        expect(water.center.equals(new Point(15, 15))).to.be.true;
        expect(water.points.length).to.eq(2);
    });
    it('construct wood obstacle', () => {
        const wood = new Obstacle(1, "wood", new Point(15, 15), [new Point(0, 0), new Point(5, 5)]);
        expect(wood.id).to.eq(1);
        expect(wood.type).to.eq(ObstacleType.WOOD);
        expect(wood.center.equals(new Point(15, 15))).to.be.true;
        expect(wood.points.length).to.eq(2);
    });
    it('construct from data', () => {
        const data = {
            "id": 0,
            "type": "solid",
            "center": {
                "x": 634,
                "y": 660
            },
            "points": [{
                "x": 625,
                "y": 538
            }, {
                "x": 624,
                "y": 538
            }, {
                "x": 602,
                "y": 544
            }]
        };

        const obstacle = Obstacle.fromData(data);
        expect(obstacle.id).to.eq(0);
        expect(obstacle.type).to.eq(ObstacleType.SOLID);
        expect(obstacle.center.equals(new Point(634, 660))).to.be.true;
        expect(obstacle.points.length).to.eq(3);
    })
    it('draw on context', () => {
        const context = new CanvasContextMock();
        const theme = new SepiaTheme();

        const obstacle = Obstacle.sampleObstacle("water");
        obstacle.draw(context as any, theme);
        context.mock_beginPath.expect_called.once();
        context.mock_lineTo.expect_called.thrice();
        context.mock_stroke.expect_called.once();
        context.mock_closePath.expect_called.once();
    })
    it('correct type from string', () => {
        expect(Obstacle.typeFromString("solid")).to.eq(ObstacleType.SOLID);
        expect(Obstacle.typeFromString("water")).to.eq(ObstacleType.WATER);
        expect(Obstacle.typeFromString("wood")).to.eq(ObstacleType.WOOD);
    })
    it('can affect a tank', () => {
        const tank = Tank.sampleTank();
        const obstacle = Obstacle.sampleObstacle("water");
        obstacle.affect(tank);
        expect(tank.effects.length).to.be.greaterThan(0);
    })

});