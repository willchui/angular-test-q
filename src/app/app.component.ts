import { Component, VERSION } from '@angular/core';
import { Source } from './source';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  q1_1in: string = Source.InputQ1;
  q1_1out: number;
  q1_2out: number;

  q4_in: string[] = Source.InputQ4;
  q4_1out: string;
  q4_2out: string;
  name = 'Angular ' + VERSION.major;


  q10_in: Array<any> =  Source.InputQ10;
  q10_1out: string;
  q10_2out: string;
  bots: Array<any> =[];
  outputs: Array<any> =[];
//2016 Q1 P1/////////////////////////////////////////////////////////
processQ1P1 = () => {
  const output = this.q1_1in
    .split(', ')
    .map((x) => {
      return {
        way: x[0],
        steps: parseInt(x.substring(1, x.length)),
      };
    })
    .reduce((acc, curr) => {
      switch (acc.head) {
        case 'E':
          acc.head = curr.way === 'L' ? 'N' : 'S';
          acc.y += curr.steps * (acc.head === 'S' ? -1 : 1);
          break;
        case 'S':
          acc.head = curr.way === 'L' ? 'E' : 'W';
          acc.x += curr.steps * (acc.head === 'W' ? -1 : 1);
          break;
        case 'W':
          acc.head = curr.way === 'L' ? 'S' : 'N';
          acc.y += curr.steps * (acc.head === 'S' ? -1 : 1);
          break;
        case 'N':
          acc.head = curr.way === 'L' ? 'W' : 'E';
          acc.x += curr.steps * (acc.head === 'W' ? -1 : 1);
          break;
      }
      return acc;
    }, { head: 'N', x: 0, y: 0 });
  this.q1_1out =  Math.abs(output.x) + Math.abs(output.y);
};

//2016 Q1 P2 //////////////////////////////////////////////////////
processQ1P2= () => {
  let output;
  let past = {};
  let walkPoints = (p1, p2) => {
  const xdiff = p2.x - p1.x;
  const ydiff = p2.y - p1.y;

    if (p1.y === p2.y) {
      for (let t = 1; t <= Math.abs(xdiff); t++) {
        const x = p1.x + t * Math.sign(xdiff);

        if (!past[`${x}:${p1.y}`]) {
          past[`${x}:${p1.y}`] = 1;
        }

        if (past[`${x}:${p1.y}`] === 2) {
          return { x, y: p1.y };
        } else {
          past[`${x}:${p1.y}`] += 1;
        }
      }
    }

    if (p1.x === p2.x) {
      for (let t = 1; t <= Math.abs(ydiff); t++) {
        const y = p1.y + t * Math.sign(ydiff);
        if (!past[`${p1.x}:${y}`]) {
          past[`${p1.x}:${y}`] = 1;
        }

        if (past[`${p1.x}:${y}`] === 2) {
          return { x: p1.x, y };
        } else {
          past[`${p1.x}:${y}`] += 1;
        }
      }
    }
  };

  this.q1_1in
    .split(', ')
    .map((x) => {
      return {
        direction: x[0],
        steps: parseInt(x.substring(1, x.length)),
      };
    })
    .reduce((acc, curr) => {
      let head = acc.head;
      let x = 0;
      let y = 0;

      switch (head) {
        case 'E':
          head = curr.direction === 'L' ? 'N' : 'S';
          y += curr.steps * (head === 'S' ? -1 : 1);
          break;
        case 'S':
          head = curr.direction === 'L' ? 'E' : 'W';
          x += curr.steps * (head === 'W' ? -1 : 1);
          break;
        case 'W':
          head = curr.direction === 'L' ? 'S' : 'N';
          y += curr.steps * (head === 'S' ? -1 : 1);
          break;
        case 'N':
          head = curr.direction === 'L' ? 'W' : 'E';
          x += curr.steps * (head === 'W' ? -1 : 1);
          break;
      }

      const start = { x: acc.x, y: acc.y };
      const end = { x: acc.x + x, y: acc.y + y };

      const cross = walkPoints(start, end);

      if (cross && !output) {
        output = { x: cross.x, y: cross.y };
      }

      acc.head = head;
      acc.x += x;
      acc.y += y;

      return acc;
    }, { head: 'N', x: 0, y: 0 });

   this.q1_2out =  Math.abs(output.x) + Math.abs(output.y);
};

///2016 Q4 P1 ////////////////////////////////////////////

processQ4P1 = function() {
  
    this.q4_1out = this.q4_in.reduce((acc, val) => {
    const [, name, sector, checksum] = /(.+)-(\d+)\[(.+)\]/.exec(val);
    if (this.isReal(val)) {
      return acc + parseInt(sector, 10);
    }
    return acc;
  }, 0);
}

processQ4P2 = function() {
  
    this.q4_2out = this.q4_in.filter(this.isReal).map(this.decrypt).find((v) => v[0] === 'northpole object storage')[1];
}

isReal = function(val) {
  let [, name, sector, checksum] = /(.+)-(\d+)\[(.+)\]/.exec(val);
  let count = {};
  [...name.replace(/-/g, '')].forEach((char) => {
    if (count[char]) {
      count[char]++;
    } else {
      count[char] = 1;
    }
  });
  let pairs = Object.keys(count).map((k) => [k, count[k]]);
  pairs.sort((a, b) => {
    if (b[1] > a[1]) {
      return 1;
    } else if (b[1] < a[1]) {
      return -1;
    }
    return a[0] < b[0] ? -1 : 1;
  });
  let expected = pairs.map((p) => p[0]).join('').substring(0, 5);
  return expected === checksum;
}

decrypt = function(val) {
  let alphabetOrder = 'abcdefghijklmnopqrstuvwxyz'.split('');
  let [, name, sector, checksum] = /(.+)-(\d+)\[(.+)\]/.exec(val);
  let decrypted = [...name].map((c) => {
    if (c === '-') {
      return ' ';
    }
    return alphabetOrder[(alphabetOrder.indexOf(c) + parseInt(sector, 10)) % 26];
  }).join('');
  return [decrypted, parseInt(sector, 10)];
}

/////2016 Q10 /////////////////////////////////////////////////
constructor() {
this.q10_in.map(line => {
  if (line.match(/^value/)) { this.addChipValue(line); }
  if (line.match(/^bot/)) { this.addChipDestinations(line); }
})

this.exchangeChips();
}

processQ10P1() {
  this.q10_1out = this.findBot([61,17]);
}

processQ10P2() {
  this.q10_2out = this.multiplyOutputs();
}

addChipValue(line) {
  const matches = line.match(/(\d+)/g).map(parseFloat);
  const botId = matches[1];
  const chip = matches[0];

  const foundBot = this.bots.find(bot => (bot.botId === botId));
  if (foundBot) {
    foundBot.chips.push(chip);
  } else {
    this.bots.push({
      botId,
      chips: [chip],
    });
  }
}

addChipDestinations(line) {
  const matches = line.match(/(\d+)/g).map(parseFloat);
  const botId = matches[0];
  const lowDestination = { type: line.match(/(?:low to )(\w+)/)[1], id: matches[1] };
  const highDestination = { type: line.match(/(?:high to )(\w+)/)[1], id: matches[2] };

  const foundBot = this.bots.find(bot => (bot.botId === botId));
  if (foundBot) {
    foundBot.lowDestination = lowDestination;
    foundBot.highDestination = highDestination;
    foundBot.hasExchanged = false;
  } else {
    this.bots.push({
      botId,
      lowDestination,
      highDestination,
      chips: [],
      hasExchanged: false,
    });
  }
}

exchangeChips() {
  const botsToRun = this.bots.filter((b)=>{
    return b.chips.length === 2 && b.hasExchanged === false});

  if (botsToRun.length > 0) {
    for (const bot of botsToRun) {
    
      if (bot.highDestination.type === 'bot') {
        const high = this.bots.find(item => item.botId === bot.highDestination.id)
        high.chips.push(Math.max(...bot.chips));
      }
      
      if (bot.lowDestination.type === 'bot') {
        const low = this.bots.find(item => item.botId === bot.lowDestination.id)
        low.chips.push(Math.min(...bot.chips));
      }

      if (bot.highDestination.type === 'output') {
        this.outputs.push({
          id: bot.highDestination.id,
          chip: Math.max(...bot.chips),
        });
      }
      if (bot.lowDestination.type === 'output') {
        this.outputs.push({
          id: bot.lowDestination.id,
          chip: Math.min(...bot.chips),
        });
      }

      bot.chips.sort();
      bot.hasExchanged = true;
    }
    return this.exchangeChips();
  } else {
    return this.bots;
  }
}

findBot(chips) {
  chips = chips.sort();
  const bot = this.bots.filter(bot => {
    return bot.chips[0] === chips[0] && bot.chips[1] === chips[1];
  })[0];
  return bot.botId;
}

multiplyOutputs() {
  const filteredOutputs =  this.outputs.filter(output => {
    return (output.id === 0 || output.id === 1 || output.id === 2);
  })

  return filteredOutputs.reduce((acc, curr) => {
    return acc * curr.chip;
  }, 1)
}



}
