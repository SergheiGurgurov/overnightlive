const config = require('../config.json');
const scoreBoard = {
    list: new Map(),
};
const timeoutMs = 1000 * 60 * config.resetTimer;
let timeout;

function resetTimeout() {
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(resetScore, timeoutMs);
}

function resetScore() {
    scoreBoard.list = new Map();
    config.contestants.forEach((contestant) => {
        if (contestant.visible === "always") {
            scoreBoard.list.set(contestant.id, {
                contestant: contestant.id,
                score: 0,
                imageUrl: contestant.imageUrl,
            })
        }
    });
}

function addScore(contestantId, score) {
    resetTimeout()
    if (scoreBoard.list.has(contestantId)) {
        scoreBoard.list.get(contestantId).score += score;
        return;
    }

    scoreBoard.list.set(contestantId, {
        contestant: contestantId,
        score: score,
        imageUrl: config.contestants.find(c => c.id === contestantId).imageUrl,
    });
}

function getScoreboardEncoded() {
    function replacer(key, value) {
        if (value instanceof Map) {
            return {
                dataType: 'Map',
                value: Array.from(value.entries()), // or with spread: value: [...value]
            };
        } else {
            return value;
        }
    }
    return JSON.stringify(scoreBoard, replacer);
}


(function main() {
    /* START */
    resetScore();
    resetTimeout()
})()

exports.init = resetScore
exports.addScore = addScore
exports.getScoreboardEncoded = getScoreboardEncoded
exports.scoreBoard = scoreBoard
exports.contestants = config.contestants.map(c => c.id)