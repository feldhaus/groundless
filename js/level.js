// game levels
var levels = [
    {
        level: [
            [1, 1, 1, 1, 1, 1],
        ],
        playerPos: new Phaser.Point(0, 0),
        finalPos: new Phaser.Point(5, 0),
        message: "Sometimes I move on and I can't go back..."
    },
        {
        level: [
            [1, 1, 1, 1],
            [1, 0, 0, 1],
            [1, 0, 0, 1],
            [1, 1, 1, 1],
        ],
        playerPos: new Phaser.Point(0, 0),
        message: "But I walk around without leaving the place."
    },
    {
        level: [
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1]
        ],
        playerPos: new Phaser.Point(0, 0),
        message: "Since that you left me I feel the ground fall below my feet."
    },
    {
        level: [
            [1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 1, 0, 1],
            [1, 1, 2, 1, 1]
        ],
        playerPos: new Phaser.Point(2, 2),
        message: "I think that everything happens for a reason..."
    },
    {
        level: [
            [1, 1, 1, 0, 0],
            [1, 0, 1, 0, 0],
            [1, 1, 2, 1, 1],
            [0, 0, 1, 0, 1],
            [0, 0, 1, 1, 1],
            [0, 0, 0, 0, 0]
        ],
        playerPos: new Phaser.Point(2, 0),
        message: "But I don't know why!"
    },
    {
        level: [
            [1, 1, 1, 0, 1, 1, 1],
            [1, 0, 1, 0, 1, 0, 1],
            [1, 1, 2, 1, 2, 1, 1],
            [0, 0, 1, 0, 1, 0, 0],
            [0, 0, 1, 1, 1, 0, 0],
        ],
        playerPos: new Phaser.Point(0, 2),
        message: "Our paths were crossed in the past."
    },
    {
        level: [
            [1, 1, 2, 1, 1],
            [1, 0, 1, 0, 1],
            [1, 2, 2, 2, 1],
            [0, 1, 0, 1, 0],
            [0, 1, 1, 1, 0]
        ],
        playerPos: new Phaser.Point(2, 1),
        message: "It can get hard sometimes."
    },
    {
        level: [
            [0, 1, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0]
        ],
        playerPos: new Phaser.Point(4, 1),
        message: "Don't matter it wherever I go..."
    },
    {
        level: [
            [0, 0, 0, 0, 1, 1, 1, 1],
            [1, 1, 0, 0, 1, 1, 1, 1],
            [1, 1, 2, 2, 1, 1, 1, 0],
            [1, 1, 2, 2, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 2, 2, 0],
            [0, 0, 0, 0, 0, 2, 2, 0],
            [0, 0, 0, 0, 0, 1, 1, 0]
        ],
        playerPos: new Phaser.Point(4, 2),
        message: "I'm looking for you!"
    },
    {
        level: [
            [0, 1, 1, 0, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 2, 1, 1, 1, 2, 1],
            [0, 1, 1, 1, 1, 1, 0],
            [0, 0, 1, 2, 1, 0, 0],
            [0, 0, 0, 1, 0, 0, 0]
        ],
        playerPos: new Phaser.Point(3, 2),
        message: "But please, don't go breaking my heart!"
    },
    {
        level: [
            [1, 1, 1, 1, 1, 1, 1],
            [1, 0, 1, 0, 1, 0, 1],
            [2, 1, 2, 1, 2, 1, 2],
            [1, 0, 1, 0, 1, 0, 1],
            [1, 1, 2, 1, 1, 1, 1]
        ],
        playerPos: new Phaser.Point(3, 0),
        message: "I hardly ever walk the floor and cry"
    }
];