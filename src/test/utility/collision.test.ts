import { expect } from 'chai';

import { TanksMath } from "../../ts/utility/tanksMath";
import { Point } from '../../ts/utility/point';
import { Tank } from '../../ts/gameObjects/tank';
import { Collision } from '../../ts/utility/collision';
import { IObstacleData } from "../../ts/gameMap/dataInterfaces";
import { Obstacle } from '../../ts/gameMap/obstacle';
import { Line } from '../../ts/utility/line';

const exampleMap = {
    "name": "Map",
    "creator": "DT",
    "createdDate": "2018-03-13T02:00:00Z",
    "updatedDate": "2018-03-13T03:00:00Z",
    "downloadedDate": "2018-03-14T05:00:00Z",
    "terrain": [
        {
            "type": "solid",
            "data": [
                500, 500,
                550, 550,
                500, 700,
                450, 650
            ],
            "centerX": 500,
            "centerY": 600
        }
    ]
};
const obstacles: Obstacle[] = [
    new Obstacle(exampleMap.terrain[0])
];
describe('Collision - Tank with Terrain', () => {

    const tankRadius = 12;
    it('tank inside obstacle', () => {
        // below are a bunch of points inside the obstacle
        let tankPos = new Point(498, 578);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(498, 585);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(497, 602);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(495, 621);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(491, 630);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(478, 629);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(484, 601);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(490, 589);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(499, 575);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(504, 569);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(512, 569);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(519, 561);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(517, 537);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(507, 537);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(504, 539);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(500, 574);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(498, 624);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(499, 641);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(499, 660);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(499, 671);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(499, 679);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(499, 682);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(496, 685);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(489, 682);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(485, 674);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(480, 668);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(473, 661);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(467, 656);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(460, 641);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(464, 616);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(470, 606);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(473, 596);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(475, 589);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(481, 573);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(488, 557);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(492, 540);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(497, 527);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(506, 515);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(513, 522);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(519, 533);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(528, 540);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(536, 551);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(533, 579);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(524, 595);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(514, 617);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(506, 636);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(502, 642);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(497, 603);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(503, 583);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
    });
    it('tank collides on right', () => {
        let tankPos = new Point(548, 582);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(515, 680);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(515, 677);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(519, 670);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(521, 667);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(524, 657);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(526, 646);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(530, 640);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(534, 631);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(538, 621);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(539, 614);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(543, 602);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(547, 592);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(549, 586);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(550, 578);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
    });
    it('tank collides on left', () => {
        let tankPos = new Point(465, 570);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point (448, 630);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point (456, 605);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point (466, 580);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point (474, 544);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point (486, 510);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point (488, 513);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
    });
    it('tank collides on top', () => {
        let tankPos = new Point(526, 510);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(516, 502);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(528, 515);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(538, 527);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(545, 536);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
    });
    it('tank collides on bottom', () => {
        let tankPos = new Point(476, 692);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(453, 665);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(464, 675);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(472, 687);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(484, 694);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
        tankPos = new Point(491, 698);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.true;
    });
    it('tank right of obstacle', () => {
        const tankPos = new Point(559, 581);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.false;
    });
    it('tank left of obstacle', () => {
        const tankPos = new Point(440, 581);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.false;
    });

    it('tank bottom of obstacle', () => {
        const tankPos = new Point(500, 750);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.false;
    });
    it('tank top of obstacle', () => {
        const tankPos = new Point(500, 450);
        expect(Collision.terrain(tankPos, tankRadius, obstacles)).to.be.false;
    });
});
describe('Collision - Shot line with Terrain', () => {
    // glancing shot - at a large angle [160-180) deg
    it('glancing shot from the right', () => {
        // this is exported shot line data from Chrome by right click > store as global variable > JSON.stringify(tempN)
        const pointsJson = '[{"x":568,"y":539},{"x":546,"y":567},{"x":526,"y":608},{"x":496,"y":692},{"x":489,"y":720}]';
        const line = new Line();
        line.points = JSON.parse(pointsJson);
        const [collides, lineIdx] = Collision.lineWithTerrain(line, obstacles);
        expect(collides).to.be.true;
        expect(lineIdx).to.eq(3);
    });
    it('shot from the left', () => {
        const line = new Line();
        line.points = [
            new Point(441, 629),
            new Point(479, 587),
            new Point(505, 552),
            new Point(551, 472),
            new Point(574, 426)
        ];

        const [collides, lineIdx] = Collision.lineWithTerrain(line, obstacles);
        expect(collides).to.be.true;
        expect(lineIdx).to.eq(2);
    });
    it('glancing shot from the left', () => {
        // this is exported shot line data from Chrome by right click > store as global variable > JSON.stringify(tempN)
        const pointsJson = '[{"x":425,"y":689},{"x":441,"y":660},{"x":478,"y":579},{"x":508,"y":525},{"x":521,"y":506}]';
        const line = new Line();
        line.points = JSON.parse(pointsJson);
        const [collides, lineIdx] = Collision.lineWithTerrain(line, obstacles);
        expect(collides).to.be.true;
        expect(lineIdx).to.eq(3);
    });
    it('longer glancing shot from the left', () => {
        // this is exported shot line data from Chrome by right click > store as global variable > JSON.stringify(tempN)
        const pointsJson = '[{"x":425,"y":689},{"x":442,"y":652},{"x":464,"y":604},{"x":500,"y":531},{"x":520,"y":482}]';
        const line = new Line();
        line.points = JSON.parse(pointsJson);
        const [collides, lineIdx] = Collision.lineWithTerrain(line, obstacles);
        expect(collides).to.be.true;
        expect(lineIdx).to.eq(4);
    });
    it('shot from the top', () => {
        // this is exported shot line data from Chrome by right click > store as global variable > JSON.stringify(tempN)
        const pointsJson = '[{"x":535,"y":508},{"x":532,"y":545},{"x":524,"y":589},{"x":505,"y":656},{"x":494,"y":686}]';
        const line = new Line();
        line.points = JSON.parse(pointsJson);
        const [collides, lineIdx] = Collision.lineWithTerrain(line, obstacles);
        expect(collides).to.be.true;
        expect(lineIdx).to.eq(2);
    });
    it('shot from the bottom', () => {
        // this is exported shot line data from Chrome by right click > store as global variable > JSON.stringify(tempN)
        const pointsJson = '[{"x":469,"y":709},{"x":488,"y":656},{"x":532,"y":548},{"x":580,"y":454}]';
        const line = new Line();
        line.points = JSON.parse(pointsJson);
        const [collides, lineIdx] = Collision.lineWithTerrain(line, obstacles);
        expect(collides).to.be.true;
        expect(lineIdx).to.eq(2);
    });
    it('close to diagonal point', () => {
        const pointsJson = '[{"x":498,"y":753},{"x":500,"y":722},{"x":502,"y":643},{"x":504,"y":601},{"x":504,"y":556}]';
        const line = new Line();
        line.points = JSON.parse(pointsJson);
        const [collides, lineIdx] = Collision.lineWithTerrain(line, obstacles);
        expect(collides).to.be.true;
        expect(lineIdx).to.eq(3);
    })
    it('shot across obstacle', () => {
        const pointsJson = '[{"x":429,"y":685},{"x":456,"y":651},{"x":487,"y":614},{"x":564,"y":520},{"x":605,"y":478}]';
        const line = new Line();
        line.points = JSON.parse(pointsJson);
        const [collides, lineIdx] = Collision.lineWithTerrain(line, obstacles);
        expect(collides).to.be.true;
        expect(lineIdx).to.eq(2);
    });
    it('shot that does NOT collide with obstacle', () => {
        const pointsJson = '[{"x":544,"y":750},{"x":544,"y":720},{"x":551,"y":617},{"x":565,"y":506},{"x":574,"y":465}]';
        const line = new Line();
        line.points = JSON.parse(pointsJson);
        const [collides, lineIdx] = Collision.lineWithTerrain(line, obstacles);
        expect(collides).to.be.false;
        expect(lineIdx).to.eq(-1);

    })
});